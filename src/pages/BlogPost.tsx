import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BlogCTA from "@/components/BlogCTA";
import NotFound from "@/pages/NotFound";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}/og-image.png`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        keywords={post.keywords}
        type="article"
        structuredData={blogPostingSchema}
      />
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>

          <motion.header
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 space-y-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </motion.header>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="mb-10"
          >
            <BlogCTA />
          </motion.div>

          <motion.article
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="bg-card rounded-[24px] border border-border/10 shadow-sm divide-y divide-border/10"
          >
            {post.sections.map((section) => (
              <section key={section.heading} className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-serif text-foreground mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </motion.article>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18, ease }}
            className="mt-8 space-y-6"
          >
            <BlogCTA />
            <p className="text-center text-sm text-muted-foreground">
              Have questions? Read our{" "}
              <Link to="/faq" className="text-primary hover:underline font-medium">
                FAQ
              </Link>{" "}
              or{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                contact us
              </Link>
              .
            </p>
          </motion.div>

          {relatedPosts.length > 0 && (
            <motion.aside
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.22, ease }}
              className="mt-12"
            >
              <h2 className="font-serif text-xl text-foreground mb-5">Related Articles</h2>
              <div className="space-y-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="block bg-card rounded-[16px] border border-border/10 p-5 hover:border-primary/20 transition-colors group"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">
                      {related.category}
                    </p>
                    <p className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
                      {related.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.aside>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
