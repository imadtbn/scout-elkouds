/*!
 * theme.js — الوضع الليلي/النهاري مع حفظ التفضيل واحترام تفضيل النظام
 */
(function (document) {
    "use strict";

    // تطبيق الوضع المحفوظ فوراً قبل رسم الصفحة لتفادي الوميض (FOUC)
    (function applyStoredTheme() {
        var stored = localStorage.getItem("theme");
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (stored === "dark" || (!stored && prefersDark)) {
            document.documentElement.classList.add("dark-mode");
        }
    })();

    App.ready(function () {
        // نقل الفئة إلى body للتوافق مع الأنماط الحالية
        if (document.documentElement.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
        }

        var themeToggle = document.getElementById("themeToggle");
        if (!themeToggle) return;

        var icon = themeToggle.querySelector("i");
        var setIcon = function (isDark) {
            if (!icon) return;
            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);
        };

        themeToggle.setAttribute("aria-label", "تبديل الوضع الليلي");
        setIcon(document.body.classList.contains("dark-mode"));

        themeToggle.addEventListener("click", function () {
            var isDark = document.body.classList.toggle("dark-mode");
            document.documentElement.classList.toggle("dark-mode", isDark);
            localStorage.setItem("theme", isDark ? "dark" : "light");
            setIcon(isDark);
        });
    });

})(document);
