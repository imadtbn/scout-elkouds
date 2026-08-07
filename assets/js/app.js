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
