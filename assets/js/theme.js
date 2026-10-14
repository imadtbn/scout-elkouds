/*!
 * theme.js — وضع ليلي يدوي مع حفظ الاختيار وبيانات وصول واضحة.
 */
(function (document) {
    "use strict";

    var storageKey = "theme";
    var stored;
    try { stored = localStorage.getItem(storageKey); }
    catch (e) { stored = null; }
    // الوضع النهاري افتراضي؛ لا نغيّره تلقائياً بناءً على إعداد النظام.
    var initialDark = stored === "dark";
    document.documentElement.classList.toggle("dark-mode", initialDark);

    App.ready(function () {
        document.body.classList.toggle("dark-mode", initialDark);
        var themeToggle = document.getElementById("themeToggle");
        if (!themeToggle) return;

        function updateUI(isDark) {
            var icon = themeToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }
            themeToggle.setAttribute("aria-pressed", String(isDark));
            themeToggle.setAttribute("aria-label", isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي");
            themeToggle.setAttribute("title", isDark ? "الوضع النهاري" : "الوضع الليلي");
        }

        updateUI(initialDark);
        themeToggle.addEventListener("click", function () {
            var isDark = !document.documentElement.classList.contains("dark-mode");
            document.documentElement.classList.toggle("dark-mode", isDark);
            document.body.classList.toggle("dark-mode", isDark);
            try { localStorage.setItem(storageKey, isDark ? "dark" : "light"); }
            catch (e) { /* نمط الخصوصية قد يمنع التخزين */ }
            updateUI(isDark);
        });
    });
})(document);
