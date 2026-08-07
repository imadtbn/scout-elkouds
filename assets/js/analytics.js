/*!
 * analytics.js — تغليف بسيط لأحداث Google Analytics (gtag) لتتبع تفاعلات مهمة
 * لا يقوم بأي شيء إن كانت gtag غير محمّلة (مثلاً في وضع عدم الاتصال)
 */
(function (document) {
    "use strict";

    function track(action, params) {
        if (typeof window.gtag === "function") {
            window.gtag("event", action, params || {});
        }
    }
    window.trackEvent = track;

    App.ready(function () {
        document.querySelectorAll("[data-track]").forEach(function (el) {
            el.addEventListener("click", function () {
                track(el.getAttribute("data-track"), {
                    event_category: el.getAttribute("data-track-category") || "engagement",
                    event_label: el.getAttribute("data-track-label") || el.textContent.trim()
                });
            });
        });

        // تتبع نجاح/فشل تحميل الصفحة بدون اتصال
        window.addEventListener("offline", function () { track("connection_offline"); });
        window.addEventListener("online", function () { track("connection_online"); });
    });

})(document);
