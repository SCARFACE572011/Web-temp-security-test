
        <!--Start Page Header-->
        <section class="page-header">
            <div class="page-header__bg" style="background-image: url(assets/images/backgrounds/page-header-bg.jpg)">
            </div>
            <div class="container">
                <div class="page-header__inner">
                    <h2 class="wow fadeInLeft" data-wow-delay="400ms" data-wow-duration="1500ms"><?php if(isset($page_title)&&!empty($page_title)) { echo $page_title; } ?></h2>
                    <ul class="thm-breadcrumb wow fadeInRight" data-wow-delay="400ms" data-wow-duration="1500ms">
                        <li><a href="index.php">Home</a></li>
                        <li><span>-</span></li>
                        <li><?php if(isset($page_title)&&!empty($page_title)) { echo $page_title; } ?></li>
                    </ul>
                </div>
            </div>
        </section>
        <!--End Page Header-->