import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Forastieri Propiedades';
const DEFAULT_SITE_URL = 'https://vapropiedades.com.ar';
const siteUrl = (process.env.REACT_APP_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

const setMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
};

const setLink = (rel, href) => {
    let element = document.head.querySelector(`link[rel="${rel}"]`);

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    element.setAttribute('href', href);
};

const removeJsonLd = () => {
    const existingScript = document.head.querySelector('script[data-seo-jsonld="true"]');
    if (existingScript) {
        existingScript.remove();
    }
};

function SEO({
    title,
    description,
    path,
    image,
    type = 'website',
    noIndex = false,
    jsonLd,
}) {
    const location = useLocation();
    const canonicalPath = path || location.pathname;
    const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const metaDescription = description || 'Inmobiliaria en Olavarria. Propiedades en venta y alquiler, casas, departamentos, terrenos y locales.';

    useEffect(() => {
        document.title = fullTitle;

        setMeta('meta[name="description"]', { name: 'description', content: metaDescription });
        setMeta('meta[name="robots"]', {
            name: 'robots',
            content: noIndex ? 'noindex, nofollow' : 'index, follow',
        });
        setMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
        setMeta('meta[property="og:description"]', { property: 'og:description', content: metaDescription });
        setMeta('meta[property="og:type"]', { property: 'og:type', content: type });
        setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
        setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });

        if (image) {
            setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
            setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
        }

        setLink('canonical', canonicalUrl);
        removeJsonLd();

        if (jsonLd) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-jsonld', 'true');
            script.text = JSON.stringify(jsonLd);
            document.head.appendChild(script);
        }

        return removeJsonLd;
    }, [canonicalUrl, fullTitle, image, jsonLd, metaDescription, noIndex, type]);

    return null;
}

export { siteUrl };
export default SEO;
