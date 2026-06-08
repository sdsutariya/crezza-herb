import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blogPosts, searchBlogPosts } from "@/data/blogPosts";
import { logoGreenTextClass, sectionEyebrowSmClass } from "@/lib/brand";
import { SITE_URL } from "@/lib/seo";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_SIZE = 5;

const blogIndexStructuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CrezzaHerb Hair Care Blog",
  url: `${SITE_URL}/blog`,
  description:
    "Ayurvedic hair care tips, hair fall solutions, and herbal hair oil guides from CrezzaHerb.",
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.dateModified,
  })),
};

const Blog = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => searchBlogPosts(search), [search]);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Hair Care Blog - Ayurvedic Tips for Hair Fall & Growth"
        description="Read CrezzaHerb hair care blog for Ayurvedic hair oil tips, hair fall solutions, scalp care guides, and natural hair growth advice for India."
        path="/blog"
        keywords={[
          "hair care blog",
          "ayurvedic hair tips",
          "hair fall blog",
          "herbal hair oil guide",
          "CrezzaHerb blog",
        ]}
        structuredData={blogIndexStructuredData}
      />
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="text-center space-y-4 mb-10"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-primary/10 mb-2">
              <BookOpen className={`w-5 h-5 ${logoGreenTextClass}`} />
            </div>
            <span className={sectionEyebrowSmClass}>
              Hair Care Blog
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">
              Ayurvedic Hair Care Tips & Guides
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Expert guides on hair fall, hair growth, scalp care, and herbal hair oil — written to help you choose the right routine and shop smarter.
            </p>
          </motion.div>

          <div className="mb-8">
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Search articles
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, topic, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-[10px] pl-10"
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-[20px] border border-border/10 p-12 text-center shadow-sm"
            >
              <p className="font-serif text-xl text-foreground mb-2">No articles found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or browse all articles below.
              </p>
              {search.trim() && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-6 h-9 rounded-[10px]"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="space-y-5">
                {paginatedPosts.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block bg-card rounded-[20px] border border-border/10 shadow-sm overflow-hidden hover:border-primary/20 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-44 md:w-52 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[140px] overflow-hidden bg-accent/30">
                          <img
                            src={post.heroImage}
                            alt={post.heroImageAlt}
                            loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6 md:p-8 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`font-mono text-[10px] uppercase tracking-wider ${logoGreenTextClass} bg-primary/10 px-2.5 py-1 rounded-full`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                      </div>
                      <h2 className="font-serif text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-8 text-xs font-mono text-muted-foreground">
                <span>
                  {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} · Page {page} / {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-[10px] gap-1"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-[10px] gap-1"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
