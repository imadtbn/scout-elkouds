// main.js
document.addEventListener('DOMContentLoaded', function () {
    // القائمة المتنقلة
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            const icon = mobileMenu?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });

    // تأثيرات الظهور
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // تطبيق التأثيرات على العناصر
    document.querySelectorAll('.card, .section-title, .timeline-item, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // أزرار التفاعل
    document.querySelectorAll('.cta-button, .card-button').forEach(button => {
        button.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            if (this.classList.contains('cta-button')) {
                alert('مرحباً بك في فوج القدس سيتواصل معك مسؤول العضوية قريباً.');
            }
        });
    });

    // تأثيرات إضافية للبطاقات
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // تأثير التمرير على الشريط العلوي
    window.addEventListener('scroll', () => {
        if (!header) return;

        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, var(--green) 0%, var(--red) 100%)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            header.classList.add('scrolled');
        } else {
            header.style.background = 'linear-gradient(135deg, var(--green) 0%, var(--red) 100%)';
            header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.2)';
            header.classList.remove('scrolled');
        }
    });

    // اكتشاف القسم النشط أثناء التمرير
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // إخفاء الهيدر عند التمرير
    let lastScroll = window.scrollY || 0;
    const tolerance = 8;
    const hideAfter = 100;

    window.addEventListener('scroll', () => {
        if (!header) return;

        const current = window.scrollY || 0;
        const diff = Math.abs(current - lastScroll);

        if (diff <= tolerance) return;

        if (current > lastScroll && current > hideAfter) {
            header.classList.add('hide');
        } else if (current < lastScroll) {
            header.classList.remove('hide');
        }

        lastScroll = current;
    }, { passive: true });

    // زر الصعود للأعلى
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollBtn.style.display = "block";
            } else {
                scrollBtn.style.display = "none";
            }
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // زر الوضع الليلي
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        const body = document.body;
        const icon = themeToggle.querySelector("i");

        if (localStorage.getItem("theme") === "dark") {
            body.classList.add("dark-mode");
            if (icon) icon.classList.replace("fa-moon", "fa-sun");
        }

        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            const isDark = body.classList.contains("dark-mode");
            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    // PWA - تثبيت التطبيق
    let deferredPrompt;
    const installBtn = document.getElementById("installBtn");

    if (installBtn) {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = "inline-flex";
        });

        installBtn.addEventListener("click", async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === "accepted") {
                    console.log("تم تثبيت التطبيق");
                }
                deferredPrompt = null;
                installBtn.style.display = "none";
            }
        });
    }

    // Lazy Loading للصور
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    if ('loading' in HTMLImageElement.prototype) {
        // المتصفح يدعم lazy loading natively
    } else {
        lazyLoadImages();
    }

    // زر مشاركة المنشور
    window.sharePost = function (url) {
        if (navigator.share) {
            navigator.share({
                title: 'منشور من فوج القدس',
                url: url
            }).then(() => {
                console.log('تمت المشاركة بنجاح');
            }).catch(console.error);
        } else {
            prompt('انسخ الرابط للمشاركة:', url);
        }
    };
});

//   تفعيل الأزرارالفوتر
document.addEventListener('DOMContentLoaded', function () {
    // فتح نافذة الخريطة
    document.getElementById('open-map').addEventListener('click', function () {
        document.getElementById('map-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    document.getElementById("open-google-maps").addEventListener("click", function () {
        window.open("https://maps.app.goo.gl/d67mvHWhLSytnT8k6", "_blank");
    });

    // الاتصال الفوري
    document.getElementById("call-now").addEventListener("click", function () {
        window.location.href = "tel:0541032117";
    });

    // إرسال بريد إلكتروني
    document.getElementById("send-email").addEventListener("click", function () {
        window.location.href = "mailto:groupeelkods@gmail.com";
    });

    // فتح خرائط جوجل
    document.getElementById('open-google-maps').addEventListener('click', function () {
        // في التطبيقات الحقيقية، يمكن استخدام رابط خرائط جوجل
        // window.open('https://maps.google.com/?q=36.7525,3.04197', '_blank');

        alert('جارٍ فتح خرائط جوجل... في التطبيق الحقيقي، سيفتح موقع خرائط جوجل.');
    });

    // نسخ العنوان
    document.getElementById('copy-address').addEventListener('click', function () {
        const address = "الطريق الولائي رقم 18 - المكتبة البلدية، سيدي داود، بومرداس";

        // محاولة استخدام Clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(function () {
                alert('تم نسخ العنوان: ' + address);
            }, function () {
                fallbackCopyTextToClipboard(address);
            });
        } else {
            fallbackCopyTextToClipboard(address);
        }
    });

    // دالة نسخ بديلة
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('تم نسخ العنوان: ' + text);
        } catch (err) {
            alert('تعذر نسخ العنوان، يرجى نسخه يدوياً: ' + text);
        }
        document.body.removeChild(textArea);
    }

    // إغلاق نافذة الخريطة
    document.querySelector('.close-button').addEventListener('click', function () {
        document.getElementById('map-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // إغلاق النافذة بالضغط خارجها
    document.getElementById('map-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // إغلاق النافذة بالضغط على Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.getElementById('map-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });


    // تأثيرات إضافية للبطاقات
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
