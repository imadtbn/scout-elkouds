/*!
 * share.js — مشاركة المحتوى عبر Web Share API مع بديل احتياطي
 * الاستخدام: <button data-share data-share-title="..." data-share-text="...">مشاركة</button>
 */
(function (document) {
    "use strict";

    function fallbackShare(url, title) {
        var box = document.createElement("div");
        box.className = "modal";
        box.style.display = "flex";
        box.setAttribute("role", "dialog");
        box.innerHTML =
            '<div class="modal-content">' +
            '<button class="close-button" data-modal-close>&times;</button>' +
            '<h3>مشاركة الصفحة</h3>' +
            '<div class="social-links" style="margin:20px 0;">' +
            '<a class="social-link" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '"><i class="fab fa-facebook-f"></i></a>' +
            '<a class="social-link" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(title + " - " + url) + '"><i class="fab fa-whatsapp"></i></a>' +
            '<a class="social-link" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url) + '"><i class="fab fa-twitter"></i></a>' +
            '<a class="social-link" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title) + '"><i class="fab fa-telegram"></i></a>' +
            '</div>' +
            '<button class="download-btn" type="button" id="__copyShareLink"><i class="fas fa-link"></i> نسخ الرابط</button>' +
            '</div>';
        document.body.appendChild(box);
        document.body.style.overflow = "hidden";

        function destroy() {
            document.body.removeChild(box);
            document.body.style.overflow = "";
        }
        box.addEventListener("click", function (e) { if (e.target === box) destroy(); });
        box.querySelector("[data-modal-close]").addEventListener("click", destroy);
        box.querySelector("#__copyShareLink").addEventListener("click", function (btn) {
            navigator.clipboard && navigator.clipboard.writeText(url);
            this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        });
    }

    window.sharePost = function (url, title, text) {
        url = url || window.location.href;
        title = title || document.title;
        text = text || "";
        if (navigator.share) {
            navigator.share({ title: title, text: text, url: url }).catch(function () { /* ألغى المستخدم */ });
        } else {
            fallbackShare(url, title);
        }
    };

    App.ready(function () {
        document.querySelectorAll("[data-share]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var url = btn.getAttribute("data-share-url") || window.location.href;
                var title = btn.getAttribute("data-share-title") || document.title;
                var text = btn.getAttribute("data-share-text") || "";
                window.sharePost(url, title, text);
            });
        });
    });

})(document);
