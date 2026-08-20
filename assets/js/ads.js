(function () {
    'use strict';

    var ADSENSE_SCRIPT = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    var SELECTOR = '.ad-container[data-ad-wrapper] ins.adsbygoogle, .ad-container ins.adsbygoogle';
    var pushedAds = typeof WeakSet === 'function' ? new WeakSet() : null;
    var queued = false;

    function getAdContainers() {
        return Array.prototype.slice.call(document.querySelectorAll('.ad-container'));
    }

    function markContainer(container, ad) {
        var format = ad.getAttribute('data-ad-format') || 'auto';
        var layout = ad.getAttribute('data-ad-layout');

        container.setAttribute('data-ad-wrapper', '');
        container.setAttribute('aria-label', 'مساحة إعلانية');
        container.classList.toggle('ad-container--fluid', format === 'fluid');
        container.classList.toggle('ad-container--native', format === 'autorelaxed');
        container.classList.toggle('ad-container--in-article', layout === 'in-article');
    }

    function isReadyForPush(ad) {
        return ad &&
            !ad.hasAttribute('data-adsbygoogle-status') &&
            !ad.hasAttribute('data-ad-initialized') &&
            ad.getAttribute('data-ad-client') &&
            ad.getAttribute('data-ad-slot');
    }

    function pushAd(ad) {
        if (!isReadyForPush(ad) || (pushedAds && pushedAds.has(ad))) {
            return;
        }

        ad.setAttribute('data-ad-initialized', 'true');
        if (pushedAds) {
            pushedAds.add(ad);
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            ad.removeAttribute('data-ad-initialized');
            if (pushedAds) {
                pushedAds.delete(ad);
            }
            console.warn('[Ads] تعذر تهيئة الوحدة الإعلانية.', error);
        }
    }

    function updateState(container, ad) {
        if (!ad || !container) {
            return;
        }

        var status = ad.getAttribute('data-ad-status');
        if (status === 'unfilled') {
            container.classList.add('is-unfilled');
            container.setAttribute('data-ad-state', 'unfilled');
        } else if (status === 'filled') {
            container.classList.remove('is-unfilled');
            container.setAttribute('data-ad-state', 'filled');
        }
    }

    function observeAd(ad) {
        var container = ad.closest('.ad-container');
        if (!container || ad.hasAttribute('data-ad-observed')) {
            return;
        }

        ad.setAttribute('data-ad-observed', 'true');
        if (typeof MutationObserver === 'function') {
            var observer = new MutationObserver(function () {
                updateState(container, ad);
            });
            observer.observe(ad, { attributes: true, attributeFilter: ['data-ad-status', 'data-adsbygoogle-status'] });
        }
        updateState(container, ad);
    }

    function processAds() {
        queued = false;
        var ads = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
        ads.forEach(function (ad) {
            var container = ad.closest('.ad-container');
            if (container) {
                markContainer(container, ad);
            }
            observeAd(ad);
        });

        if (!ads.length || !window.adsbygoogle) {
            return;
        }

        ads.forEach(pushAd);
    }

    function scheduleProcess() {
        if (queued) {
            return;
        }
        queued = true;
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(processAds, { timeout: 1800 });
        } else {
            window.setTimeout(processAds, 80);
        }
    }

    function loadAdSense() {
        var existingScript = document.querySelector('script[src^="' + ADSENSE_SCRIPT + '"]');
        if (existingScript) {
            if (window.adsbygoogle) {
                scheduleProcess();
            } else {
                existingScript.addEventListener('load', scheduleProcess, { once: true });
                window.setTimeout(scheduleProcess, 2500);
            }
            return;
        }

        var script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = ADSENSE_SCRIPT + '?client=ca-pub-5656416032906373';
        script.onload = scheduleProcess;
        script.onerror = function () {
            getAdContainers().forEach(function (container) {
                container.setAttribute('data-ad-state', 'error');
            });
        };
        document.head.appendChild(script);
    }

    function init() {
        getAdContainers().forEach(function (container) {
            container.setAttribute('data-ad-wrapper', '');
        });
        loadAdSense();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
