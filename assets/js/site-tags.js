/*
 * site-tags.js — محمّل مركزي لوسوم الموقع
 *
 * ضع هنا المعرف الحقيقي لحاوية Google Tag Manager بدلاً من GTM-xxxxxxxx.
 * ضع هنا معرّف Microsoft Clarity بدلاً من xxxxxxxx.
 * معرّف GA4 الحالي موجود للتوثيق داخل إعدادات GTM، ولا يتم تحميل gtag.js مباشرة.
 */
(() => {
  'use strict';

  if (window.__siteTagsLoaded) return;
  window.__siteTagsLoaded = true;

  const config = Object.freeze({
    // ضع هنا معرف حاوية Google Tag Manager: GTM-xxxxxxxx
    gtmId: 'GTM-xxxxxxxx',
    // معرف GA4 الموجود في إعدادات الموقع؛ اربطه بـ Google tag داخل GTM.
    ga4MeasurementId: 'G-NKN85LGVRY',
    // معرّف ناشر AdSense الموجود في ملف adsbygoogle.txt.
    adsenseClient: 'ca-pub-5656416032906373',
    // ضع هنا معرف مشروع Microsoft Clarity: xxxxxxxx
    clarityId: 'xxxxxxxx',
  });

  window.__siteTagsConfig = config;
  const state = { gtm: false, adsense: false, clarity: false };
  const queuedAds = typeof WeakSet === 'function' ? new WeakSet() : null;

  const isPlaceholder = (value) => !value || /x{4,}|your[-_ ]|replace[-_ ]|example/i.test(value);

  const findExistingScript = (src) => Array.from(document.scripts).find((script) => (
    script.dataset.siteTagSrc === src || script.src === src
  ));

  const loadScript = (src, onload) => {
    const existing = findExistingScript(src);
    if (existing) {
      if (onload) existing.addEventListener('load', onload, { once: true });
      return existing;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.siteTagSrc = src;
    if (onload) script.addEventListener('load', onload, { once: true, passive: true });
    script.addEventListener('error', () => {
      console.warn('[SiteTags] تعذر تحميل المصدر الخارجي:', src);
    }, { once: true, passive: true });
    document.head.appendChild(script);
    return script;
  };

  const idle = (callback, timeout) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout });
    } else {
      window.setTimeout(callback, timeout);
    }
  };

  const loadGtm = () => {
    if (state.gtm || isPlaceholder(config.gtmId)) return;
    state.gtm = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtagProxy(...args) {
      window.dataLayer.push(args);
    };
    if (!window.__siteGtmStartQueued) {
      window.__siteGtmStartQueued = true;
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    }
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`);
  };

  const pushAds = () => {
    if (!window.adsbygoogle) window.adsbygoogle = [];
    document.querySelectorAll('ins.adsbygoogle').forEach((block) => {
      if (
        block.hasAttribute('data-adsbygoogle-status') ||
        block.hasAttribute('data-site-tag-queued') ||
        (queuedAds && queuedAds.has(block))
      ) return;

      block.setAttribute('data-site-tag-queued', 'true');
      if (queuedAds) queuedAds.add(block);
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        block.removeAttribute('data-site-tag-queued');
        if (queuedAds) queuedAds.delete(block);
        console.warn('[SiteTags] تعذر تهيئة وحدة AdSense.', error);
      }
    });
  };

  const loadAdsense = () => {
    if (state.adsense || isPlaceholder(config.adsenseClient)) return;
    if (!document.querySelector('ins.adsbygoogle')) return;
    state.adsense = true;
    loadScript(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseClient)}`,
      pushAds,
    );
  };

  const loadClarity = () => {
    if (state.clarity || isPlaceholder(config.clarityId)) return;
    state.clarity = true;
    window.clarity = window.clarity || function clarityQueue(...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
    loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(config.clarityId)}`);
  };

  loadGtm();

  window.addEventListener('load', () => {
    idle(loadAdsense, 3500);
    idle(loadClarity, 6000);
  }, { once: true, passive: true });
})();
