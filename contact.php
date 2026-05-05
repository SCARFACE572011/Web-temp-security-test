<?php $head_title="Contact | Stratton Security Group"?>
<?php require_once('parts/layout/top-layout.php'); ?>
<?php require_once('parts/header/header3.php'); ?>
<?php $page_title = "Open Comms"; require_once('parts/page-title.php'); ?>

        <section class="contact-page stratton-contact">
            <div class="container">
                <div class="row">
                    <div class="col-xl-5">
                        <div class="stratton-contact__details">
                            <h3>// REACH THE OPS DESK</h3>
                            <p>Talk with a Stratton Security advisor about your protection needs. We respond seven days a week, around the clock.</p>

                            <ul class="stratton-contact__list">
                                <li>
                                    <span class="icon-ringing"></span>
                                    <div><p>// CALL</p><a href="tel:+14244405554"><strong>(424) 440-5554</strong></a></div>
                                </li>
                                <li>
                                    <span class="icon-message"></span>
                                    <div><p>// EMAIL</p><a href="mailto:Info@StrattonSecurityGroup.com"><strong>Info@StrattonSecurityGroup.com</strong></a></div>
                                </li>
                                <li>
                                    <span class="icon-placeholder"></span>
                                    <div><p>// HQ</p><strong>2029 Century Park E,<br>Los Angeles, CA</strong></div>
                                </li>
                            </ul>

                            <div class="contact-page-google-map stratton-contact__map">
                                <iframe
                                    src="https://www.google.com/maps?q=2029+Century+Park+E,+Los+Angeles,+CA&output=embed"
                                    class="contact-page-google-map__one" allowfullscreen loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-7">
                        <div class="contact-one__form">
                            <div class="sec-title tg-heading-subheading animation-style2">
                                <div class="sec-title__tagline">
                                    <p class="tg-element-title">// REQUEST DEPLOYMENT</p>
                                    <div class="border-box"></div>
                                </div>
                                <h2 class="sec-title__title tg-element-title">TELL US ABOUT THE <br><span>THREAT VECTOR</span></h2>
                            </div>

                            <form id="contact-form" class="default-form2" action="https://formspree.io/f/your-form-id" method="POST" novalidate>
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 col-md-6">
                                        <div class="input-box"><input type="text" name="name" placeholder="NAME *" required></div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6">
                                        <div class="input-box"><input type="email" name="email" placeholder="EMAIL *" required></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 col-md-6">
                                        <div class="input-box"><input type="text" name="phone" placeholder="PHONE *"></div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6">
                                        <div class="input-box"><input type="text" name="property_type" placeholder="PROPERTY / SECTOR *"></div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="input-box"><textarea name="message" placeholder="DESCRIBE THE SITUATION *"></textarea></div>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6">
                                        <div class="contact-one__form-btn">
                                            <button class="thm-btn" type="submit"><span class="txt">Transmit</span></button>
                                        </div>
                                    </div>
                                </div>
                                <p class="stratton-contact__note">Form posts to a Formspree endpoint — replace <code>your-form-id</code> in <code>contact.php</code> with your real ID before going live.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <?php require_once('parts/home/slogan.php'); ?>

        <?php require_once('parts/footer/footer.php'); ?>
        <?php require_once('parts/layout/bottom-layout.php'); ?>
