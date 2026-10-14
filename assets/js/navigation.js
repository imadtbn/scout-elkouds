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
        var scrim = document.getElementById("navScrim");
        var desktopBreakpoint = 1320;

        // توحيد الأيقونات الدلالية في كل الصفحات دون تكرار تعديلات HTML.
        var linkIcons = {
            "index.html": "fa-house",
            "about.html": "fa-people-group",
            "history.html": "fa-clock-rotate-left",
            "organization.html": "fa-sitemap",
            "activities/index.html": "fa-campground",
            "news/index.html": "fa-newspaper",
            "gallery.html": "fa-images",
            "contact.html": "fa-envelope",
            "join.html": "fa-user-plus",
            "search.html": "fa-magnifying-glass"
        };
        navLinks.forEach(function (link) {
            var url;
            try { url = new URL(link.getAttribute("href"), window.location.href); }
            catch (e) { return; }
            var path = url.pathname;
            var iconName = null;
            Object.keys(linkIcons).forEach(function (suffix) {
                if (path.endsWith("/" + suffix)) iconName = linkIcons[suffix];
            });
            if (!iconName || link.querySelector(".nav-link-icon")) return;
            var icon = document.createElement("i");
            icon.className = "nav-link-icon fa-solid " + iconName;
            icon.setAttribute("aria-hidden", "true");
            link.insertBefore(icon, link.firstChild);
        });
        if (navMenu && !navMenu.id) navMenu.id = "siteNavMenu";

        function setMenuOpen(open) {
            if (!navMenu) return;
            navMenu.classList.toggle("active", open);
            document.body.classList.toggle("nav-open", open);
            if (mobileMenu) {
                mobileMenu.setAttribute("aria-expanded", String(open));
                mobileMenu.setAttribute("aria-label", open ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل");
            }
            if (header && open) header.classList.remove("hide");
            if (mobileMenu) {
                var icon = mobileMenu.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-bars", !open);
                    icon.classList.toggle("fa-times", open);
                }
            }
        }

        if (mobileMenu && navMenu) {
            mobileMenu.setAttribute("role", "button");
            mobileMenu.setAttribute("tabindex", "0");
            mobileMenu.setAttribute("aria-expanded", "false");
            mobileMenu.setAttribute("aria-label", "فتح قائمة التنقل");
            mobileMenu.setAttribute("aria-controls", navMenu.id);

            var toggleMenu = function () {
                setMenuOpen(!navMenu.classList.contains("active"));
            };

            mobileMenu.addEventListener("click", toggleMenu);
            mobileMenu.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMenu();
                }
            });
        }

        if (scrim) {
            scrim.addEventListener("click", function () {
                setMenuOpen(false);
                if (mobileMenu) mobileMenu.focus();
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
                setMenuOpen(false);
                if (mobileMenu) mobileMenu.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > desktopBreakpoint && navMenu && navMenu.classList.contains("active")) {
                setMenuOpen(false);
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                setMenuOpen(false);
            });
        });

        // إخفاء/إظهار الشريط العلوي عند التمرير
        var lastScroll = 0;
        if (header) {
            window.addEventListener("scroll", function () {
                var current = window.pageYOffset;
                if (window.innerWidth > desktopBreakpoint && !document.body.classList.contains("nav-open") && current > 200 && current > lastScroll) {
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
