import { useEffect } from 'react';

const DEFAULT_TITLE = 'Sapling & Seeds® | Premium Eco-Friendly Sustainable Products';
const DEFAULT_DESC  = 'Shop premium eco-friendly & sustainable products at Sapling & Seeds. Discover our bamboo toothbrushes, neem combs & plantable stationery. Join our green mission';
const DEFAULT_CANONICAL = 'https://www.saplingandseeds.com/';

/**
 * SEOHead — updates document <title>, meta description, OG tags, and canonical
 * for each page without needing react-helmet.
 *
 * Usage:
 *   <SEOHead
 *     title="Page Title | Sapling & Seeds"
 *     description="Page-specific description (max 160 chars)."
 *     canonical="https://www.saplingandseeds.com/page"
 *   />
 */
const SEOHead = ({ title, description, canonical }) => {
  useEffect(() => {
    const prev = {
      title: document.title,
      desc:  document.querySelector('meta[name="description"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      ogDesc:  document.querySelector('meta[property="og:description"]')?.content,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
      twitterDesc:  document.querySelector('meta[name="twitter:description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    };

    if (title) {
      document.title = title;
      const ogT = document.querySelector('meta[property="og:title"]');
      if (ogT) ogT.content = title;
      const twT = document.querySelector('meta[name="twitter:title"]');
      if (twT) twT.content = title;
    }

    if (description) {
      const metaD = document.querySelector('meta[name="description"]');
      if (metaD) metaD.content = description;
      const ogD = document.querySelector('meta[property="og:description"]');
      if (ogD) ogD.content = description;
      const twD = document.querySelector('meta[name="twitter:description"]');
      if (twD) twD.content = description;
    }

    if (canonical) {
      const link = document.querySelector('link[rel="canonical"]');
      if (link) link.href = canonical;
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = canonical;
    }

    return () => {
      document.title = DEFAULT_TITLE;
      const metaD = document.querySelector('meta[name="description"]');
      if (metaD) metaD.content = prev.desc ?? DEFAULT_DESC;
      const ogT = document.querySelector('meta[property="og:title"]');
      if (ogT) ogT.content = prev.ogTitle ?? DEFAULT_TITLE;
      const ogD = document.querySelector('meta[property="og:description"]');
      if (ogD) ogD.content = prev.ogDesc ?? DEFAULT_DESC;
      const twT = document.querySelector('meta[name="twitter:title"]');
      if (twT) twT.content = prev.twitterTitle ?? DEFAULT_TITLE;
      const twD = document.querySelector('meta[name="twitter:description"]');
      if (twD) twD.content = prev.twitterDesc ?? DEFAULT_DESC;
      const link = document.querySelector('link[rel="canonical"]');
      if (link) link.href = prev.canonical ?? DEFAULT_CANONICAL;
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = prev.canonical ?? DEFAULT_CANONICAL;
    };
  }, [title, description, canonical]);

  return null;
};

export default SEOHead;
