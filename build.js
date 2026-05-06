// Build pipeline: inlines PHP templates → evaluates variables → minifies → writes static HTML.
// Also generates sitemap.xml, copies robots.txt, and minifies custom CSS/JS.

const fs   = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');

const SRC      = __dirname;
const OUT      = path.join(__dirname, 'public');
const BASE_URL = 'https://strattonsecuritygroup.com';

const PAGES = ['index.php', 'about.php', 'services.php', 'contact.php', '404.php'];

const SITEMAP_PAGES = [
  { slug: '',         changefreq: 'weekly',  priority: '1.0' },
  { slug: 'about',    changefreq: 'monthly', priority: '0.8' },
  { slug: 'services', changefreq: 'monthly', priority: '0.9' },
  { slug: 'contact',  changefreq: 'yearly',  priority: '0.7' },
];

function read(p) { return fs.readFileSync(p, 'utf8'); }

function splitMultiStmtPhp(src) {
  return src.replace(/<\?php([\s\S]*?)\?>/g, (full, inner) => {
    if (!/require_once/.test(inner)) return full;
    const stmts = inner.split(/;(?=\s*(?:\$|require_once|\/\/|$))/).map(s => s.trim()).filter(Boolean);
    if (stmts.length <= 1) return full;
    return stmts.map(s => `<?php ${s}; ?>`).join('');
  });
}

function inlineRequires(src, srcDir, ctx, depth = 0) {
  if (depth > 12) throw new Error('require depth exceeded');
  src = splitMultiStmtPhp(src);
  return src.replace(/<\?php\s+require_once\(['"]([^'"]+)['"]\)\s*;?\s*\?>/g, (_, rel) => {
    const inc = path.join(srcDir, rel);
    let content = read(inc);
    content = inlineRequires(content, srcDir, ctx, depth + 1);
    return content;
  });
}

// Capture `<?php $name = "value"; ?>` (double-quoted) into ctx, remove the block.
function captureDoubleQuoted(src, name, ctx) {
  return src.replace(
    new RegExp(`<\\?php\\s+\\$${name}\\s*=\\s*"([^"]*)"\\s*;?\\s*\\?>`, 'g'),
    (_, val) => { ctx[name] = val; return ''; }
  );
}

// Capture `<?php $name = 'value'; ?>` (single-quoted, safe for JSON) into ctx.
function captureSingleQuoted(src, name, ctx) {
  return src.replace(
    new RegExp(`<\\?php\\s+\\$${name}\\s*=\\s*'([^']*)'\\s*;?\\s*\\?>`, 'g'),
    (_, val) => { ctx[name] = val; return ''; }
  );
}

function evaluatePhp(src, ctx) {
  // Capture variable assignments.
  src = captureDoubleQuoted(src, 'head_title',       ctx);
  src = captureDoubleQuoted(src, 'meta_description', ctx);
  src = captureDoubleQuoted(src, 'og_image',         ctx);
  src = captureDoubleQuoted(src, 'page_url',         ctx);
  src = captureDoubleQuoted(src, 'robots_meta',      ctx);
  src = captureSingleQuoted(src, 'schema_json',      ctx);

  // Legacy bare $page_title assignment (may appear inside a mixed PHP block).
  src = src.replace(/\$page_title\s*=\s*"([^"]*)"\s*;?/g, (_, t) => {
    ctx.page_title = t;
    return '';
  });

  // Apply fallback defaults.
  ctx.robots_meta      = ctx.robots_meta      || 'index,follow';
  ctx.meta_description = ctx.meta_description || 'Stratton Security Group — proactive, armed and unarmed protection across California.';
  ctx.og_image         = ctx.og_image         || `${BASE_URL}/assets/images/stratton/exec-protection.jpg`;
  ctx.page_url         = ctx.page_url         || BASE_URL;
  ctx.schema_json      = ctx.schema_json      || '{}';

  // Substitute echo statements.
  const echoRe = (name) =>
    new RegExp(`<\\?php(?:(?!\\?>)[\\s\\S])*?echo\\s+\\$${name}(?:(?!\\?>)[\\s\\S])*?\\?>`, 'g');

  src = src.replace(echoRe('head_title'),        () => ctx.head_title        || '');
  src = src.replace(echoRe('page_title'),        () => ctx.page_title        || '');
  src = src.replace(echoRe('meta_description'),  () => ctx.meta_description);
  src = src.replace(echoRe('og_image'),          () => ctx.og_image);
  src = src.replace(echoRe('page_url'),          () => ctx.page_url);
  src = src.replace(echoRe('robots_meta'),       () => ctx.robots_meta);
  src = src.replace(echoRe('schema_json'),       () => ctx.schema_json);

  // Strip any remaining PHP tags.
  src = src.replace(/<\?php[\s\S]*?\?>/g, '');
  return src;
}

function rewriteLinks(html) {
  return html.replace(/(href|src|action)=("|')([^"']+)\.php(\?[^"']*)?(["'])/g, (_, attr, q, base, query, qend) => {
    if (/^(https?:|mailto:|tel:|#)/i.test(base)) return _;
    return `${attr}=${q}${base}.html${query || ''}${qend}`;
  });
}

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

function copyDir(src, dst) {
  ensureDir(dst);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

function minifyCssDir(dir) {
  if (!fs.existsSync(dir)) return;
  const cc = new CleanCSS({ level: 2 });
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.css')) continue;
    const fp = path.join(dir, file);
    const result = cc.minify(read(fp));
    if (result.styles) {
      fs.writeFileSync(fp, result.styles);
      console.log('  minified css:', file);
    }
  }
}

async function minifyJsDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    // Skip already-minified files and non-JS files.
    if (!file.endsWith('.js') || file.endsWith('.min.js')) continue;
    const fp = path.join(dir, file);
    try {
      const result = await minifyJs(read(fp), { compress: true, mangle: true });
      if (result.code) {
        fs.writeFileSync(fp, result.code);
        console.log('  minified js:', file);
      }
    } catch (e) {
      console.warn('  js minify skipped:', file, `(${e.message})`);
    }
  }
}

function generateSitemap(buildDate) {
  const urls = SITEMAP_PAGES.map(p => {
    const loc = p.slug ? `${BASE_URL}/${p.slug}` : BASE_URL;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${buildDate}</lastmod>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
  console.log('generated sitemap.xml');
}

async function build() {
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // Copy and minify assets.
  copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
  console.log('minifying css...');
  minifyCssDir(path.join(OUT, 'assets', 'css'));
  console.log('minifying js...');
  await minifyJsDir(path.join(OUT, 'assets', 'js'));

  // Render and minify pages.
  for (const page of PAGES) {
    const ctx = {};
    let html = read(path.join(SRC, page));
    html = inlineRequires(html, SRC, ctx);
    html = evaluatePhp(html, ctx);
    html = rewriteLinks(html);
    html = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: false,
    });
    const outName = page.replace(/\.php$/, '.html');
    fs.writeFileSync(path.join(OUT, outName), html);
    console.log('built', outName, ' title=', ctx.head_title);
  }

  // Sitemap.
  const buildDate = new Date().toISOString().split('T')[0];
  generateSitemap(buildDate);

  // robots.txt.
  const robotsSrc = path.join(SRC, 'robots.txt');
  if (fs.existsSync(robotsSrc)) {
    fs.copyFileSync(robotsSrc, path.join(OUT, 'robots.txt'));
    console.log('copied robots.txt');
  }

  console.log('\nDone. Output: public/');
}

build().catch(err => { console.error(err); process.exit(1); });
