/*!
 * search.js — محرك بحث داخلي بسيط يفهرس الأخبار والأنشطة والمراحل والأسئلة الشائعة
 * يعمل بالكامل من طرف المتصفح (client-side) دون خادم بحث خارجي
 */
(function (document) {
    "use strict";

    function buildIndex() {
        return Promise.all([
            App.fetchJSON("posts.json").catch(function () { return []; }),
            App.fetchJSON("stages.json").catch(function () { return []; }),
            App.fetchJSON("faq.json").catch(function () { return []; })
        ]).then(function (results) {
            var posts = results[0], stages = results[1], faq = results[2];
            var index = [];

            posts.forEach(function (p) {
                var section = p.category === "news" ? "news" : "activities";
                var base = section === "news" ? "news/" : "activities/";
                index.push({
                    type: section === "news" ? "خبر" : "نشاط",
                    title: p.title,
                    text: (p.teaser || "") + " " + (p.paragraphs || []).join(" "),
                    url: App.url(base + p.slug + ".html")
                });
            });

            stages.forEach(function (s) {
                index.push({
                    type: "مرحلة تنظيمية",
                    title: s.name,
                    text: (s.about || "") + " " + (s.goals || []).join(" "),
                    url: App.url("organization.html#" + s.id)
                });
            });

            faq.forEach(function (f) {
                index.push({
                    type: "سؤال شائع",
                    title: f.question,
                    text: f.answer,
                    url: App.url("faq.html")
                });
            });

            return index;
        });
    }

    function score(entry, terms) {
        var hay = (entry.title + " " + entry.text).toLowerCase();
        var s = 0;
        terms.forEach(function (t) {
            if (!t) return;
            var titleHits = entry.title.toLowerCase().split(t).length - 1;
            var bodyHits = hay.split(t).length - 1;
            s += titleHits * 5 + bodyHits;
        });
        return s;
    }

    function excerpt(text, terms) {
        var lower = text.toLowerCase();
        var pos = -1;
        terms.forEach(function (t) {
            if (!t) return;
            var i = lower.indexOf(t);
            if (i !== -1 && (pos === -1 || i < pos)) pos = i;
        });
        if (pos === -1) return text.slice(0, 140) + (text.length > 140 ? "…" : "");
        var start = Math.max(0, pos - 60);
        return (start > 0 ? "…" : "") + text.slice(start, start + 160) + "…";
    }

    function runSearch(index, query) {
        var terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (!terms.length) return [];
        return index
            .map(function (e) { return { entry: e, s: score(e, terms) }; })
            .filter(function (r) { return r.s > 0; })
            .sort(function (a, b) { return b.s - a.s; })
            .slice(0, 30)
            .map(function (r) { return r.entry; });
    }

    App.ready(function () {
        var input = document.getElementById("search-input");
        var resultsBox = document.getElementById("search-results");
        var countBox = document.getElementById("search-count");
        if (!input || !resultsBox) return;

        var indexPromise = buildIndex();

        function renderResults(list, query) {
            if (!query) {
                resultsBox.innerHTML = "";
                if (countBox) countBox.textContent = "";
                return;
            }
            if (countBox) countBox.textContent = list.length + " نتيجة لبحثك عن \u201c" + query + "\u201d";
            if (!list.length) {
                resultsBox.innerHTML = '<p class="search-empty">لا توجد نتائج مطابقة. جرّب كلمات أخرى.</p>';
                return;
            }
            var terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
            resultsBox.innerHTML = list.map(function (r) {
                return (
                    '<a class="search-result-item" href="' + r.url + '">' +
                    '<span class="search-result-type">' + r.type + '</span>' +
                    '<h3>' + r.title + '</h3>' +
                    '<p>' + excerpt(r.text, terms) + '</p>' +
                    '</a>'
                );
            }).join("");
        }

        function doSearch() {
            var query = input.value;
            indexPromise.then(function (index) {
                renderResults(runSearch(index, query), query.trim());
            });
        }

        var params = new URLSearchParams(window.location.search);
        if (params.get("q")) {
            input.value = params.get("q");
            doSearch();
        }

        var timer;
        input.addEventListener("input", function () {
            clearTimeout(timer);
            timer = setTimeout(doSearch, 200);
        });

        var form = input.closest("form");
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                doSearch();
            });
        }
    });

    // شريط بحث سريع في الرأس (إن وجد) يوجّه إلى صفحة البحث
    App.ready(function () {
        var quick = document.getElementById("quick-search-form");
        if (!quick) return;
        quick.addEventListener("submit", function (e) {
            e.preventDefault();
            var q = quick.querySelector("input").value.trim();
            window.location.href = App.url("search.html") + (q ? "?q=" + encodeURIComponent(q) : "");
        });
    });

})(document);
