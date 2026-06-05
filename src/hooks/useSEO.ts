import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  lang?: 'bn' | 'en';
}

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  lang = 'bn',
}: SeoProps) {
  useEffect(() => {
    // 1. Update Document Language (SEO signal)
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('lang', lang);
    }

    // 2. Update Document Title
    const originalTitle = document.title;
    if (title) {
      document.title = title;
    }

    // Helper to find or create metadata tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to find or create link tag
    const setLinkTag = (relVal: string, hrefVal: string) => {
      let element = document.querySelector(`link[rel="${relVal}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relVal);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefVal);
    };

    // 3. Update Standard Meta Tags
    if (description) {
      setMetaTag('name', 'description', description);
    }
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 4. Update OpenGraph Tags (Facebook, LinkedIn, Social Channels)
    if (ogTitle || title) {
      setMetaTag('property', 'og:title', ogTitle || title || '');
    }
    if (ogDescription || description) {
      setMetaTag('property', 'og:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }
    if (ogUrl) {
      setMetaTag('property', 'og:url', ogUrl);
    }

    // 5. Update Twitter Tags (for better Twitter card indexing)
    if (ogTitle || title) {
      setMetaTag('name', 'twitter:title', ogTitle || title || '');
    }
    if (ogDescription || description) {
      setMetaTag('name', 'twitter:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('name', 'twitter:image', ogImage);
    }

    // 6. Update Canonical URL for duplicate content prevention
    if (canonical) {
      setLinkTag('canonical', canonical);
    }

    // Cleanup logic (restore to standard or remove dynamic tags if we want, or make it persistent per-view transition)
    return () => {
      // We don't remove everything immediately to prevent flickering during dynamic page switches,
      // but we reset the title back to fallback if next page does not set it immediately
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogUrl, lang]);
}
