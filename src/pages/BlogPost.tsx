import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BlogCTA from "@/components/BlogCTA";
import BlogArticleHero from "@/components/blog/BlogArticleHero";
import BlogKeyTakeaways from "@/components/blog/BlogKeyTakeaways";
import BlogTableOfContents, { slugifyHeading } from "@/components/blog/BlogTableOfContents";
import CrezzaInsight from "@/components/blog/CrezzaInsight";
import BlogReadingProgress from "@/components/blog/BlogReadingProgress";
import NotFound from "@/pages/NotFound";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from "@/lib/seo";
import { logoGreenTextClass, sectionEyebrowSmClass } from "@/lib/brand";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const tocItems = post.sections.map((section) => ({
    id: slugifyHeading(section.heading),
    label: section.heading,
  }));

  const structuredData = [
    buildBlogPostingSchema(post),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(post.faqs.length > 0 ? [buildFAQSchema(post.faqs)] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <BlogReadingProgress />
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        keywords={post.keywords}
        type="article"
        image={post.heroImage}
        structuredData={structuredData}
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
            <span className={`${sectionEyebrowSmClass} bg-primary/10 px-2.5 py-1 rounded-full inline-block`}>
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

          <BlogArticleHero
            image={post.heroImage}
            alt={post.heroImageAlt}
            category={post.category}
            caption={post.heroImageAlt}
          />

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.06, ease }}
            className="mb-8 bg-primary/5 border border-primary/10 rounded-[20px] p-6 md:p-8"
          >
            <p className={`${sectionEyebrowSmClass} mb-3`}>
              Quick Answer
            </p>
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              {post.answerSummary}
            </p>
          </motion.div>

          <BlogKeyTakeaways items={post.keyTakeaways} />
          <BlogTableOfContents items={tocItems} />

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
            {post.sections.map((section, sectionIndex) => (
              <section key={section.heading} className="p-6 md:p-8">
                <h2
                  id={slugifyHeading(section.heading)}
                  className="text-lg md:text-xl font-serif text-foreground mb-4 scroll-mt-28"
                >
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.crezzaInsight && (
                  <CrezzaInsight>{section.crezzaInsight}</CrezzaInsight>
                )}
                {sectionIndex === 2 && (
                  <div className="mt-6 pt-2">
                    <BlogCTA variant="inline" />
                  </div>
                )}
              </section>
            ))}
          </motion.article>

          {post.faqs.length > 0 && (
            <motion.section
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.16, ease }}
              className="mt-8 bg-card rounded-[24px] border border-border/10 shadow-sm p-6 md:p-8"
            >
              <h2 className="text-lg md:text-xl font-serif text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="text-base font-serif text-foreground mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

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
