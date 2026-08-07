/*!
 * modal.js — نظام موحّد للنوافذ المنبثقة (خريطة، ملف الانخراط، صور... إلخ)
 * يفتح أي عنصر يحمل data-modal-open="modalId" ويغلق بالزر أو Escape أو النقر خارج المحتوى
 */
(function (document) {
    "use strict";

    function openModal(modal) {
        if (!modal) return;
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        var focusable = modal.querySelector("button, a, input, [tabindex]");
        if (focusable) focusable.focus();
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    App.ready(function () {
        document.querySelectorAll(".modal").forEach(function (m) {
            m.setAttribute("role", "dialog");
            m.setAttribute("aria-modal", "true");
            m.setAttribute("aria-hidden", "true");
        });

        document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                openModal(document.getElementById(btn.getAttribute("data-modal-open")));
            });
        });

        document.querySelectorAll(".modal .close-button, [data-modal-close]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                closeModal(btn.closest(".modal"));
            });
        });

        document.querySelectorAll(".modal").forEach(function (modal) {
            modal.addEventListener("click", function (e) {
                if (e.target === modal) closeModal(modal);
            });
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                document.querySelectorAll(".modal").forEach(closeModal);
            }
        });

        // نافذة الخريطة
        var openMapBtn = document.getElementById("open-map");
        var mapModal = document.getElementById("map-modal");
        if (openMapBtn && mapModal) {
            openMapBtn.addEventListener("click", function () { openModal(mapModal); });
        }
        var openGoogleMaps = document.getElementById("open-google-maps");
        if (openGoogleMaps) {
            openGoogleMaps.addEventListener("click", function () {
                window.open("https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent("سيدي داود، بومرداس، الجزائر"), "_blank", "noopener");
            });
        }
        var copyAddressBtn = document.getElementById("copy-address");
        if (copyAddressBtn) {
            copyAddressBtn.addEventListener("click", function () {
                var address = "الطريق الولائي رقم 18 - المكتبة البلدية الشهيد طويلب محمد، سيدي داود، بومرداس";
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(address).then(function () {
                        copyAddressBtn.innerHTML = '<i class="fas fa-check"></i> تم نسخ العنوان';
                        setTimeout(function () {
                            copyAddressBtn.innerHTML = '<i class="fas fa-copy"></i> نسخ العنوان';
                        }, 2000);
                    });
                }
            });
        }

        var callNowBtn = document.getElementById("call-now");
        if (callNowBtn) {
            callNowBtn.addEventListener("click", function () {
                window.location.href = "tel:+213541032117";
            });
        }
        var sendEmailBtn = document.getElementById("send-email");
        if (sendEmailBtn) {
            sendEmailBtn.addEventListener("click", function () {
                window.location.href = "mailto:groupeelkods@gmail.com";
            });
        }

        window.ScoutModal = { open: openModal, close: closeModal };
    });

})(document);
