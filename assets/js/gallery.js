/*!
 * gallery.js — معرض الصور: تحميل من data/gallery.json، فلاتر، تحميل تدريجي، صندوق العرض
 */
(function (document) {
    "use strict";

    App.ready(function () {
        var container = document.getElementById("gallery-container");
        if (!container) return;

        var loadMoreBtn = document.getElementById("load-more");
        var filterButtons = document.querySelectorAll(".filter-btn");
        var yearButtons = document.querySelectorAll(".year-filter-btn");
        var lightbox = document.getElementById("lightbox");

        var PAGE_SIZE = 12;
        var visibleCount = PAGE_SIZE;
        var activeCategory = "all";
        var activeYear = "all";
        var items = [];
        var filtered = [];

        function yearOf(dateStr) {
            var m = /(\d{4})/.exec(dateStr || "");
            return m ? m[1] : "";
        }

        function applyFilters() {
            filtered = items.filter(function (it) {
                var catOk = activeCategory === "all" || it.category === activeCategory;
                var yearOk = activeYear === "all" || yearOf(it.date) === activeYear;
                return catOk && yearOk;
            });
            visibleCount = PAGE_SIZE;
            render();
        }

        function cardHTML(it, index) {
            return (
                '<figure class="gallery-item" data-category="' + it.category + '" data-index="' + index + '">' +
                '<img src="' + it.image + '" loading="lazy" alt="' + it.title + '" width="400" height="300">' +
                '<figcaption>' +
                '<h3>' + it.title + '</h3>' +
                '<span class="lightbox-meta-inline"><i class="fas fa-calendar"></i> ' + it.date + '</span>' +
                '</figcaption>' +
                '</figure>'
            );
        }

        function render() {
            var toShow = filtered.slice(0, visibleCount);
            container.innerHTML = toShow.map(function (it) {
                return cardHTML(it, items.indexOf(it));
            }).join("");

            container.querySelectorAll(".gallery-item").forEach(function (el) {
                el.addEventListener("click", function () {
                    openLightbox(parseInt(el.getAttribute("data-index"), 10));
                });
            });

            if (loadMoreBtn) {
                if (visibleCount >= filtered.length) {
                    loadMoreBtn.style.display = filtered.length <= PAGE_SIZE ? "none" : "inline-flex";
                    loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> جميع الصور معروضة';
                    loadMoreBtn.disabled = true;
                } else {
                    loadMoreBtn.style.display = "inline-flex";
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد من الصور';
                }
            }

            var statTotal = document.querySelector('[data-gallery-stat="total"]');
            if (statTotal) statTotal.textContent = items.length;
        }

        var currentLightboxIndex = 0;
        function openLightbox(index) {
            if (!lightbox) return;
            var it = items[index];
            if (!it) return;
            currentLightboxIndex = index;
            document.getElementById("lightbox-img").src = it.image;
            document.getElementById("lightbox-img").alt = it.title;
            document.getElementById("lightbox-title").textContent = it.title;
            document.getElementById("lightbox-description").textContent = it.description;
            document.getElementById("lightbox-date").textContent = it.date;
            document.getElementById("lightbox-category").textContent = it.category;
            lightbox.classList.add("active");
            lightbox.style.display = "flex";
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove("active");
            lightbox.style.display = "none";
            document.body.style.overflow = "";
        }

        function stepLightbox(dir) {
            var next = currentLightboxIndex;
            do {
                next = (next + dir + items.length) % items.length;
            } while (
                (activeCategory !== "all" && items[next].category !== activeCategory) &&
                next !== currentLightboxIndex
            );
            openLightbox(next);
        }

        if (lightbox) {
            var closeBtn = document.getElementById("lightbox-close");
            if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
            lightbox.addEventListener("click", function (e) {
                if (e.target === lightbox) closeLightbox();
            });
            var prevBtn = document.getElementById("lightbox-prev");
            var nextBtn = document.getElementById("lightbox-next");
            if (prevBtn) prevBtn.addEventListener("click", function () { stepLightbox(-1); });
            if (nextBtn) nextBtn.addEventListener("click", function () { stepLightbox(1); });
            document.addEventListener("keydown", function (e) {
                if (!lightbox.classList.contains("active")) return;
                if (e.key === "Escape") closeLightbox();
                if (e.key === "ArrowRight") stepLightbox(-1);
                if (e.key === "ArrowLeft") stepLightbox(1);
            });
        }

        filterButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                filterButtons.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                activeCategory = btn.getAttribute("data-filter");
                applyFilters();
            });
        });

        yearButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                yearButtons.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                activeYear = btn.getAttribute("data-year");
                applyFilters();
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", function () {
                visibleCount += PAGE_SIZE;
                render();
            });
        }

        App.fetchJSON("gallery.json").then(function (data) {
            items = data;
            filtered = items;
            render();
        }).catch(function (err) {
            container.innerHTML = "<p>تعذر تحميل معرض الصور حالياً.</p>";
            console.error(err);
        });
    });

})(document);
