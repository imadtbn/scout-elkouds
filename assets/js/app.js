/*!
 * app.js — أدوات مشتركة وتهيئة عامة للموقع
 * فوج القدس - سيدي داود
 */
(function (window, document) {
    "use strict";

    // المسار الجذري للموقع على GitHub Pages (اسم المستودع)
    var ROOT = window.SITE_ROOT || "/scout-elkouds";

    var App = {
        root: ROOT,

        /** يبني رابطاً كاملاً بالنسبة لجذر الموقع */
        url: function (path) {
            if (/^https?:\/\//i.test(path)) return path;
            path = path.replace(/^\/+/, "");
            return ROOT.replace(/\/+$/, "") + "/" + path;
        },

        /** جلب ملف JSON من مجلد assets/data مع تخزين مؤقت بسيط بالذاكرة */
        _cache: {},
        fetchJSON: function (name) {
            var key = name;
            if (App._cache[key]) return Promise.resolve(App._cache[key]);
            return fetch(App.url("assets/data/" + name))
                .then(function (r) {
                    if (!r.ok) throw new Error("تعذر تحميل البيانات: " + name);
                    return r.json();
                })
                .then(function (data) {
                    App._cache[key] = data;
                    return data;
                });
        },

        /** تنسيق تاريخ ميلادي بصيغة عربية جزائرية مبسطة */
        formatDate: function (iso) {
            if (!iso) return "";
            var months = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان",
                "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
            var d = new Date(iso + "T00:00:00");
            if (isNaN(d.getTime())) return iso;
            return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
        },

        ready: function (fn) {
            if (document.readyState !== "loading") fn();
            else document.addEventListener("DOMContentLoaded", fn);
        }
    };

    window.App = App;

    App.ready(function () {
        // تحديث السنة في الفوتر تلقائياً
        document.querySelectorAll("[data-current-year]").forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });

        // أيقونات روابط الفوتر: تُطبّق على كل الصفحات باستخدام الروابط الفعلية
        // دون تغيير عناوينها أو وجهاتها، مع إخفاء الأيقونات عن قارئات الشاشة.
        var footerIcons = {
            "index.html": "fa-house",
            "about.html": "fa-circle-info",
            "history.html": "fa-clock-rotate-left",
            "organization.html": "fa-sitemap",
            "activities/index.html": "fa-campground",
            "news/index.html": "fa-newspaper",
            "gallery.html": "fa-images",
            "join.html": "fa-user-plus",
            "contact.html": "fa-envelope",
            "faq.html": "fa-circle-question",
            "search.html": "fa-magnifying-glass",
            "sitemap.html": "fa-map",
            "privacy.html": "fa-shield-halved",
            "terms.html": "fa-file-contract"
        };
        var sitePrefix = ROOT.split("/").filter(Boolean).join("/") + "/";
        document.querySelectorAll(".footer .footer-section p > a[href]").forEach(function (link) {
            if (link.classList.contains("footer-link")) return;
            var address;
            try { address = new URL(link.getAttribute("href"), window.location.href); }
            catch (e) { return; }

            var iconName = "fa-link";
            if (address.hostname === "imadtbn.github.io" && address.pathname.indexOf("/dz_portal/") === 0) {
                iconName = "fa-globe";
            } else if (address.hostname === "imadtbn.github.io" && address.pathname.indexOf("/meteo-dz/") === 0) {
                iconName = "fa-cloud-sun";
            } else if (address.origin === window.location.origin) {
       var targetPath = address.pathname;
                while (targetPath.charAt(0) === "/") targetPath = targetPath.slice(1);
                if (targetPath.indexOf(sitePrefix) === 0) targetPath = targetPath.slice(sitePrefix.length);
                iconName = footerIcons[targetPath] || "fa-link";
            }

            var label = document.createElement("span");
            label.className = "footer-link-text";
            while (link.firstChild) label.appendChild(link.firstChild);

            var icon = document.createElement("i");
            icon.className = "fas " + iconName + " footer-link-icon";
            icon.setAttribute("aria-hidden", "true");
            link.appendChild(icon);
            link.appendChild(label);
            link.classList.add("footer-link");
        });

        // إبراز رابط التنقل النشط حسب الصفحة الحالية
        var current = window.location.pathname.replace(/\/index\.html$/, "/");
        document.querySelectorAll(".nav-menu a[href]").forEach(function (a) {
            try {
                var target = new URL(a.href, window.location.href).pathname.replace(/\/index\.html$/, "/");
                if (target === current) a.classList.add("active");
            } catch (e) { /* ignore */ }
        });
    });

})(window, document);
