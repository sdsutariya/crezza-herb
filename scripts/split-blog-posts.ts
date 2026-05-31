import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { blogPosts } from "../src/data/blogPosts";

const postsDir = join(process.cwd(), "src/data/blog/posts");
mkdirSync(postsDir, { recursive: true });

function slugToVarName(slug: string): string {
  const name = slug.replace(/-/g, "_");
  return /^\d/.test(name) ? `_${name}` : name;
}

const sorted = [...blogPosts].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

const imports: string[] = [];
const arrayEntries: string[] = [];

for (const post of sorted) {
  const varName = slugToVarName(post.slug);
  const filePath = join(postsDir, `${post.slug}.ts`);
  const content = `import type { BlogPost } from "../types";

export const blogPost: BlogPost = ${JSON.stringify(post, null, 2)};
`;
  writeFileSync(filePath, content, "utf8");
  imports.push(`import { blogPost as ${varName} } from "./${post.slug}";`);
  arrayEntries.push(`  ${varName},`);
}

const indexContent = `import type { BlogPost } from "../types";
${imports.join("\n")}

export const allBlogPosts: BlogPost[] = [
${arrayEntries.join("\n")}
];
`;

writeFileSync(join(postsDir, "index.ts"), indexContent, "utf8");
console.log(`Wrote ${sorted.length} blog post files to ${postsDir}`);
