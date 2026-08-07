/*!
 * pwa.js — تسجيل الـ Service Worker، اقتراح التثبيت، إشعار التحديث
 */
(function (window, document, navigator) {
    "use strict";

    App.ready(function () {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register(App.url("service-worker.js")).then(function (reg) {
                    // كشف وجود نسخة جديدة من العامل الخدمي
                    reg.addEventListener("updatefound", function () {
                        var installing = reg.installing;
                        if (!installing) return;
                        installing.addEventListener("statechange", function () {
                            if (installing.state === "installed" && navigator.serviceWorker.controller) {
                                showUpdateBanner(reg);
                            }
                        });
                    });
                }).catch(function (err) {
                    console.warn("تعذر تسجيل Service Worker:", err);
                });
            });
        }

        function showUpdateBanner(reg) {
            var bar = document.createElement("div");
            bar.className = "pwa-update-banner";
            bar.innerHTML =
                '<span>يتوفر تحديث جديد للموقع</span>' +
                '<button type="button" id="__pwaUpdateBtn">تحديث الآن</button>';
            document.body.appendChild(bar);
            bar.querySelector("#__pwaUpdateBtn").addEventListener("click", function () {
                if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
            });
        }

        // اقتراح تثبيت التطبيق (PWA Install Prompt)
        var deferredPrompt;
        var installBtn = document.getElementById("installBtn");

        window.addEventListener("beforeinstallprompt", function (e) {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) installBtn.hidden = false;
        });

        if (installBtn) {
            installBtn.addEventListener("click", function () {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function () {
                    deferredPrompt = null;
                    installBtn.hidden = true;
                });
            });
        }

        window.addEventListener("appinstalled", function () {
            if (installBtn) installBtn.hidden = true;
        });
    });

})(window, document, navigator);
