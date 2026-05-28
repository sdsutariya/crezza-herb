import { useEffect } from "react";
import { DEFAULT_SEO_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

const SEO = ({
  title,
  description,
  path = "/",
  keywords = [],
  image = DEFAULT_SEO_IMAGE,
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[name="author"]', "name", "author", SITE_NAME);
    if (keywords.length > 0) {
      setMeta('meta[name="keywords"]', "name", "keywords", keywords.join(", "));
    }

    setLink("canonical", canonicalUrl);

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", `${SITE_NAME} Ayurvedic Herbal Hair Oil`);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);

    document.querySelectorAll('script[data-seo="json-ld"]').forEach((node) => node.remove());
    const schemas = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "json-ld";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [description, image, keywords, noindex, path, structuredData, title, type]);

  return null;
};

export default SEO;
