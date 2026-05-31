export const SITE_NAME = "CrezzaHerb";
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://crezzaherb.com").replace(/\/$/, "");
export const DEFAULT_SEO_IMAGE = "/og-image.png";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PRODUCT_ID = `${SITE_URL}/#product`;

export type FAQSchemaItem = {
  q: string;
  a: string;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}${DEFAULT_SEO_IMAGE}`,
    },
    description:
      "CrezzaHerb makes 14-day slow-infused Ayurvedic Herbal Hair Oil for hair fall control, scalp nourishment, and healthier-looking hair in India.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@crezzaherb.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.instagram.com/crezzaherb",
      "https://www.facebook.com/crezzaherb",
    ],
  };
}

export function buildProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": PRODUCT_ID,
    name: "CrezzaHerb Herbal Hair Oil",
    description:
      "Ayurvedic herbal hair oil made with 14-day slow-infused bhringraj, amla, brahmi, and hibiscus in cold-pressed coconut oil for hair fall control and scalp nourishment.",
    image: `${SITE_URL}${DEFAULT_SEO_IMAGE}`,
    sku: "CREZZA-HERB-OIL-100ML",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: {
      "@id": ORGANIZATION_ID,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/#order`,
      priceCurrency: "INR",
      price: "399",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": ORGANIZATION_ID,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2847",
    },
  };
}

export function buildFAQSchema(items: FAQSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  dateModified: string;
  keywords: string[];
  heroImage?: string;
  heroImageAlt?: string;
}) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.heroImage
    ? `${SITE_URL}${post.heroImage}`
    : `${SITE_URL}${DEFAULT_SEO_IMAGE}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: post.heroImageAlt ?? post.title,
    },
    datePublished: post.publishedAt,
    dateModified: post.dateModified,
    author: {
      "@id": ORGANIZATION_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.keywords.join(", "),
  };
}

export function buildHomeStructuredData() {
  return [buildOrganizationSchema(), buildProductSchema()];
}

export function buildHomeFAQPreviewSchema(items: FAQSchemaItem[]) {
  return buildFAQSchema(items.slice(0, 5));
}
