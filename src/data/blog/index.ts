import type { BlogPost } from "./types";
import { allBlogPosts } from "./posts";

export type { BlogPost, BlogSection, BlogFAQ } from "./types";

export const blogPosts: BlogPost[] = allBlogPosts;

export function searchBlogPosts(query: string): BlogPost[] {
  const term = query.trim().toLowerCase();
  if (!term) return blogPosts;

  return blogPosts.filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.description,
      post.category,
      post.answerSummary,
      post.heroImageAlt,
      ...post.keyTakeaways,
      ...post.keywords,
      ...post.faqs.map((f) => `${f.q} ${f.a}`),
      ...post.sections.map((s) => s.heading),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getBlogPost(currentSlug);
  if (!current) return blogPosts.slice(0, count);

  const sameCategory = blogPosts.filter(
    (post) => post.slug !== currentSlug && post.category === current.category,
  );
  const others = blogPosts.filter(
    (post) => post.slug !== currentSlug && post.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, count);
}
