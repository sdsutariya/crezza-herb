export type BlogSection = {
  heading: string;
  paragraphs: string[];
  crezzaInsight?: string;
};

export type BlogFAQ = {
  q: string;
  a: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  dateModified: string;
  readTime: string;
  category: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  keyTakeaways: string[];
  answerSummary: string;
  faqs: BlogFAQ[];
  sections: BlogSection[];
};
