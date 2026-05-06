
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $head_title;?></title>

    <!-- Canonical & robots -->
    <link rel="canonical" href="<?php echo $page_url;?>" />
    <meta name="robots" content="<?php echo $robots_meta;?>" />

    <!-- Primary meta -->
    <meta name="description" content="<?php echo $meta_description;?>" />
    <meta name="keywords" content="Stratton Security, security guards, Los Angeles, California, armed security, executive protection, commercial security" />
    <meta name="theme-color" content="#050608" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Stratton Security Group" />
    <meta property="og:title" content="<?php echo $head_title;?>" />
    <meta property="og:description" content="<?php echo $meta_description;?>" />
    <meta property="og:url" content="<?php echo $page_url;?>" />
    <meta property="og:image" content="<?php echo $og_image;?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo $head_title;?>" />
    <meta name="twitter:description" content="<?php echo $meta_description;?>" />
    <meta name="twitter:image" content="<?php echo $og_image;?>" />

    <!-- Structured data (JSON-LD) -->
    <script type="application/ld+json"><?php echo $schema_json;?></script>

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="assets/images/favicons/favicon.svg" />
    <link rel="apple-touch-icon" href="assets/images/favicons/favicon.svg" />

    <!-- Resource hints -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="dns-prefetch" href="https://maps.googleapis.com" />
    <link rel="dns-prefetch" href="https://formspree.io" />

    <!-- Fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Big+Shoulders+Stencil+Display:wght@600;700;800;900&family=Saira+Stencil+One&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="assets/vendors/animate/animate.min.css" />
    <link rel="stylesheet" href="assets/vendors/animate/custom-animate.css" />
    <link rel="stylesheet" href="assets/vendors/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/vendors/bootstrap-select/css/bootstrap-select.min.css" />
    <link rel="stylesheet" href="assets/vendors/fontawesome/css/all.min.css" />
    <link rel="stylesheet" href="assets/vendors/jquery-magnific-popup/jquery.magnific-popup.css" />
    <link rel="stylesheet" href="assets/vendors/jquery-ui/jquery-ui.css" />
    <link rel="stylesheet" href="assets/vendors/nice-select/nice-select.css" />
    <link rel="stylesheet" href="assets/vendors/odometer/odometer.min.css" />
    <link rel="stylesheet" href="assets/vendors/owl-carousel/owl.carousel.min.css" />
    <link rel="stylesheet" href="assets/vendors/owl-carousel/owl.theme.default.min.css" />
    <link rel="stylesheet" href="assets/vendors/swiper/swiper.min.css" />
    <link rel="stylesheet" href="assets/vendors/thm-icons/style.css" />
    <link rel="stylesheet" href="assets/vendors/reey-font/stylesheet.css" />

    <link rel="stylesheet" href="assets/css/style.css" />
    <link rel="stylesheet" href="assets/css/responsive.css" />
    <link rel="stylesheet" href="assets/css/stratton.css" />

    <!-- Analytics: uncomment and replace G-XXXXXXXXXX with your GA4 Measurement ID -->
    <!--
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>
    -->
    <!-- Vercel Analytics: enable in Vercel dashboard, then uncomment -->
    <!-- <script defer src="/_vercel/insights/script.js"></script> -->
</head>

<body>
    <div class="loader-wrap">
        <div class="preloader">
            <div class="preloader-close">x</div>
            <div id="handle-preloader" class="handle-preloader">
                <div class="animation-preloader">
                    <div class="spinner"></div>
                    <div class="txt-loading">
                        <span data-text-preloader="S" class="letters-loading"> S </span>
                        <span data-text-preloader="T" class="letters-loading"> T </span>
                        <span data-text-preloader="R" class="letters-loading"> R </span>
                        <span data-text-preloader="A" class="letters-loading"> A </span>
                        <span data-text-preloader="T" class="letters-loading"> T </span>
                        <span data-text-preloader="T" class="letters-loading"> T </span>
                        <span data-text-preloader="O" class="letters-loading"> O </span>
                        <span data-text-preloader="N" class="letters-loading"> N </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="page-wrapper">
