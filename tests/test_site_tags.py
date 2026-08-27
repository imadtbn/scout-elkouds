import re
import unittest
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CONTENT_PAGES = [
    path for path in ROOT.rglob('*.html')
    if path.name != 'offline.html'
]


class SiteTagsMigrationTest(unittest.TestCase):
    def test_every_document_has_one_central_loader(self):
        for path in CONTENT_PAGES:
            soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
            loaders = soup.find_all('script', src=lambda value: value and 'site-tags.js' in value)
            self.assertEqual(len(loaders), 1, path.relative_to(ROOT))

    def test_gtm_noscript_is_present_once(self):
        for path in CONTENT_PAGES:
            soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
            matches = [
                node for node in soup.find_all('iframe')
                if 'googletagmanager.com/ns.html?id=GTM-MMZPPWW9' in (node.get('src') or '')
            ]
            self.assertEqual(len(matches), 1, path.relative_to(ROOT))

    def test_direct_measurement_loaders_are_absent(self):
        forbidden = re.compile(r'gtag/js|adsbygoogle\.js|clarity\.ms/tag|googletagmanager\.com/gtm\.js', re.I)
        for path in CONTENT_PAGES:
            html = path.read_text(encoding='utf-8')
            for script in BeautifulSoup(html, 'html.parser').find_all('script', src=True):
                self.assertIsNone(forbidden.search(script['src']), path.relative_to(ROOT))
            self.assertNotRegex(html, r"gtag\s*\(\s*['\"]config['\"]", path.relative_to(ROOT))

    def test_central_loader_contains_documented_configuration(self):
        loader = (ROOT / 'assets/js/site-tags.js').read_text(encoding='utf-8')
        self.assertIn("gtmId: 'GTM-MMZPPWW9'", loader)
        self.assertNotIn("gtmId: 'GTM-xxxxxxxx'", loader)
        self.assertIn("ga4MeasurementId: 'G-NKN85LGVRY'", loader)
        self.assertIn("adsenseClient: 'ca-pub-5656416032906373'", loader)
        self.assertIn("clarityId: 'xxxxxxxx'", loader)
        self.assertIn('معرّف حاوية Google Tag Manager الحالي', loader)
        self.assertIn('ضع هنا معرف مشروع Microsoft Clarity', loader)

    def test_ads_have_required_attributes_and_unified_wrappers(self):
        ad_count = 0
        for path in CONTENT_PAGES:
            soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
            for ad in soup.select('ins.adsbygoogle'):
                ad_count += 1
                self.assertTrue(ad.get('data-ad-client'), path.relative_to(ROOT))
                self.assertTrue(ad.get('data-ad-slot'), path.relative_to(ROOT))
                self.assertTrue(ad.get('data-ad-format'), path.relative_to(ROOT))
                wrapper = ad.find_parent(class_='ad-container')
                self.assertIsNotNone(wrapper, path.relative_to(ROOT))
                self.assertTrue(wrapper.has_attr('data-ad-wrapper'), path.relative_to(ROOT))
        self.assertGreaterEqual(ad_count, 1)


if __name__ == '__main__':
    unittest.main()
