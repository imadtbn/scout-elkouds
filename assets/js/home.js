/*!
 * home.js — يملأ أقسام الصفحة الرئيسية (آخر الأخبار، آخر الأنشطة، لمحة من المعرض، الإحصائيات)
 * ديناميكياً من بيانات assets/data/*.json، بحيث تنعكس أي إضافة جديدة على الصفحات الأخرى
 * تلقائياً في الصفحة الرئيسية دون الحاجة لتعديلها يدوياً.
 * المحتوى المُولَّد وقت البناء يبقى كواجهة أولية فورية (Fallback) قبل اكتمال الجلب.
 */
(function (document) {
    "use strict";

    function newsCardHTML(p) {
        var badge = (p.badges && p.badges[0]) ? '<div class="card-badge">' + p.badges[0] + '</div>' : "";
        return (
            '<div class="card">' +
            '<div class="card-img"><img src="' + p.image + '" loading="lazy" alt="' + p.title + '">' + badge + '</div>' +
            '<div class="card-content"><h3>' + p.title + '</h3><p>' + (p.teaser || "") + '</p>' +
            '<div class="card-buttons-container">' +
            '<a class="card-button" href="' + App.url("news/" + p.slug + ".html") + '">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>' +
            '<button class="card-button" data-share data-share-title="' + p.title + '" data-share-url="' + App.url("news/" + p.slug + ".html") + '"><i class="fas fa-share-alt"></i></button>' +
            '</div></div></div>'
        );
    }

    function activityCardHTML(p) {
        var badge = (p.badges && p.badges[0]) ? '<div class="card-badge">' + p.badges[0] + '</div>' : "";
        return (
            '<div class="card">' +
            '<div class="card-img"><img src="' + p.image + '" loading="lazy" alt="' + p.title + '">' + badge + '</div>' +
            '<div class="card-content"><h3>' + p.title + '</h3><p>' + (p.teaser || "") + '</p>' +
            '<div class="card-buttons-container">' +
            '<a class="card-button" href="' + App.url("activities/" + p.slug + ".html") + '">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>' +
            '<button class="card-button" data-share data-share-title="' + p.title + '" data-share-url="' + App.url("activities/" + p.slug + ".html") + '"><i class="fas fa-share-alt"></i></button>' +
            '</div></div></div>'
        );
    }

    function galleryFigureHTML(g) {
        return (
            '<figure class="gallery-item">' +
            '<img src="' + g.image + '" loading="lazy" alt="' + g.title + '" ' +
            'style="width:100%;height:220px;object-fit:cover;border-radius:var(--border-radius);box-shadow:var(--shadow);">' +
            '</figure>'
        );
    }

    function rebindDynamicButtons(container) {
        // إعادة ربط أزرار المشاركة المُضافة ديناميكياً (share.js يربط عناصر [data-share] عند تحميل الصفحة فقط)
        container.querySelectorAll("[data-share]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var url = btn.getAttribute("data-share-url") || window.location.href;
                var title = btn.getAttribute("data-share-title") || document.title;
                window.sharePost(url, title, "");
            });
        });
    }

    App.ready(function () {
        var newsGrid = document.getElementById("latest-news-grid");
        var activitiesGrid = document.getElementById("latest-activities-grid");
        var galleryGrid = document.getElementById("mini-gallery-grid");
        if (!newsGrid && !activitiesGrid && !galleryGrid) return; // ليست الصفحة الرئيسية

        Promise.all([
            App.fetchJSON("posts.json").catch(function () { return null; }),
            App.fetchJSON("gallery.json").catch(function () { return null; })
        ]).then(function (results) {
            var posts = results[0];
            var gallery = results[1];

            if (posts && newsGrid) {
                var count = parseInt(newsGrid.getAttribute("data-count"), 10) || 3;
                var news = posts.filter(function (p) { return p.category === "news"; })
                    .sort(function (a, b) { return b.date.localeCompare(a.date); })
                    .slice(0, count);
                if (news.length) {
                    newsGrid.innerHTML = news.map(newsCardHTML).join("");
                    rebindDynamicButtons(newsGrid);
                }
            }

            if (posts && activitiesGrid) {
                var acount = parseInt(activitiesGrid.getAttribute("data-count"), 10) || 3;
                var activities = posts.filter(function (p) { return p.category !== "news"; })
                    .sort(function (a, b) { return b.date.localeCompare(a.date); })
                    .slice(0, acount);
                if (activities.length) {
                    activitiesGrid.innerHTML = activities.map(activityCardHTML).join("");
                    rebindDynamicButtons(activitiesGrid);
                }
            }

            if (gallery && galleryGrid) {
                var gcount = parseInt(galleryGrid.getAttribute("data-count"), 10) || 8;
                var recentGallery = gallery.slice().sort(function (a, b) {
                    return (b.date || "").localeCompare(a.date || "");
                }).slice(0, gcount);
                if (recentGallery.length) {
                    galleryGrid.innerHTML = recentGallery.map(galleryFigureHTML).join("");
                }
            }

            // تحديث الإحصائيات لتعكس الأرقام الحقيقية الحالية
            if (posts) {
                var postsStat = document.querySelector('[data-stat="posts_count"]');
                if (postsStat) postsStat.textContent = posts.length;
            }
            if (gallery) {
                var galleryStat = document.querySelector('[data-stat="gallery_count"]');
                if (galleryStat) galleryStat.textContent = gallery.length;
            }
        }).catch(function (err) {
            console.warn("تعذر تحديث محتوى الصفحة الرئيسية ديناميكياً، سيبقى المحتوى الأصلي المعروض:", err);
        });
    });

})(document);
