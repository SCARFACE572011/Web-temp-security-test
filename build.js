// Flatten the baosh PHP template into static HTML for Vercel deployment.
// Inlines `<?php require_once('parts/x.php'); ?>` calls, evaluates simple
// $head_title / $page_title substitutions, strips other PHP tags, and rewrites
// .php links to .html.

const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const OUT = path.join(__dirname, 'public');

const PAGES = ['index.php', 'about.php', 'services.php', 'contact.php', '404.php'];

function read(p) { return fs.readFileSync(p, 'utf8'); }

function splitMultiStmtPhp(src) {
  // Turn `<?php $x = "y"; require_once('z'); ?>` into two separate <?php ?> blocks
  // so the require_once matcher below can run independently.
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

function evaluatePhp(src, ctx) {
  // Capture `<?php $head_title="..."?>` (or with semicolon).
  src = src.replace(/<\?php\s+\$head_title\s*=\s*"([^"]*)"\s*;?\s*\?>/g, (_, t) => {
    ctx.head_title = t;
    return '';
  });
  // Capture inline `<?php $page_title = "..."; require_once(...) ?>` is already
  // expanded by inlineRequires, but the `$page_title = "..";` assignment may
  // remain as part of an inlined block. Handle both inside and outside cases.
  src = src.replace(/\$page_title\s*=\s*"([^"]*)"\s*;?/g, (_, t) => {
    ctx.page_title = t;
    return '';
  });

  // Replace echoes — match a single <?php ... echo $var ... ?> block (no spanning).
  const echoRe = (name) => new RegExp(`<\\?php(?:(?!\\?>)[\\s\\S])*?echo\\s+\\$${name}(?:(?!\\?>)[\\s\\S])*?\\?>`, 'g');
  src = src.replace(echoRe('head_title'), () => ctx.head_title || '');
  src = src.replace(echoRe('page_title'), () => ctx.page_title || '');

  // Strip any remaining PHP tags.
  src = src.replace(/<\?php[\s\S]*?\?>/g, '');
  return src;
}

function rewriteLinks(html) {
  // Convert .php links to .html, but not external URLs.
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

function build() {
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // Copy assets directory verbatim.
  copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));

  // Render pages.
  for (const page of PAGES) {
    const ctx = {};
    let html = read(path.join(SRC, page));
    html = inlineRequires(html, SRC, ctx);
    html = evaluatePhp(html, ctx);
    html = rewriteLinks(html);
    const outName = page.replace(/\.php$/, '.html');
    fs.writeFileSync(path.join(OUT, outName), html);
    console.log('built', outName, ' title=', ctx.head_title);
  }

  console.log('\nDone. Output: public/');
}

build();
