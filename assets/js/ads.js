/*!
 * ads.js — تحميل وحدات Google AdSense بأمان دون التأثير على Cumulative Layout Shift
 * يُحمَّل بعد استقرار الصفحة (بعد حدث load) لتفادي منافسة موارد التحميل الحرجة
 */
(function (window, document) {
    "use strict";

    function pushAdUnit(ins) {
        if (ins.hasAttribute("data-adsbygoogle-status")) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }

    function initAds() {
        document.querySelectorAll("ins.adsbygoogle").forEach(pushAdUnit);
    }

    if (document.readyState === "complete") {
        setTimeout(initAds, 1200);
    } else {
        window.addEventListener("load", function () {
            // تأخير بسيط لضمان استقرار DOM وتفادي تعارض مع Service Worker
            setTimeout(initAds, 1200);
        });
    }

})(window, document);
