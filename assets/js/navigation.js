/*!
 * navigation.js — القائمة المتنقلة، إخفاء الشريط عند التمرير، زر الصعود للأعلى
 */
(function (document) {
    "use strict";

    App.ready(function () {
        var mobileMenu = document.querySelector(".mobile-menu");
        var navMenu = document.querySelector(".nav-menu");
        var header = document.querySelector(".header");
        var navLinks = document.querySelectorAll(".nav-menu a");

        if (mobileMenu && navMenu) {
            mobileMenu.setAttribute("role", "button");
            mobileMenu.setAttribute("tabindex", "0");
            mobileMenu.setAttribute("aria-expanded", "false");
            mobileMenu.setAttribute("aria-label", "فتح قائمة التنقل");

            var toggleMenu = function () {
                var isOpen = navMenu.classList.toggle("active");
                mobileMenu.setAttribute("aria-expanded", String(isOpen));
                var icon = mobileMenu.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-bars");
                    icon.classList.toggle("fa-times");
                }
            };

            mobileMenu.addEventListener("click", toggleMenu);
            mobileMenu.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMenu();
                }
            });
        }

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                if (navMenu) navMenu.classList.remove("active");
                if (mobileMenu) mobileMenu.setAttribute("aria-expanded", "false");
            });
        });

        // إخفاء/إظهار الشريط العلوي عند التمرير
        var lastScroll = 0;
        if (header) {
            window.addEventListener("scroll", function () {
                var current = window.pageYOffset;
                if (current > 200 && current > lastScroll) {
                    header.classList.add("hide");
                } else {
                    header.classList.remove("hide");
                }
                lastScroll = current;
            }, { passive: true });
        }

        // زر الصعود للأعلى
        var scrollBtn = document.getElementById("scrollTopBtn");
        if (scrollBtn) {
            window.addEventListener("scroll", function () {
                scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
            }, { passive: true });

            scrollBtn.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        // التمرير السلس للروابط الداخلية (نفس الصفحة فقط)
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener("click", function (e) {
                var href = this.getAttribute("href");
                if (href === "#" || href.length < 2) return;
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });

        // ظهور تدريجي للعناصر عند التمرير
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll(".fade-in-up, .card, .timeline-item").forEach(function (el) {
            observer.observe(el);
        });
    });

})(document);
