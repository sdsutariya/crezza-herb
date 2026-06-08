import { motion } from "framer-motion";
import { logoGreenBgClass } from "@/lib/brand";

type BlogArticleHeroProps = {
  image: string;
  alt: string;
  category: string;
  caption?: string;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BlogArticleHero = ({ image, alt, category, caption }: BlogArticleHeroProps) => {
  return (
    <motion.figure
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.04, ease }}
      className="mb-8 overflow-hidden rounded-[24px] border border-border/10 shadow-sm bg-card"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-accent/30">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <span className={`absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground ${logoGreenBgClass} backdrop-blur-sm px-2.5 py-1 rounded-full`}>
          {category}
        </span>
      </div>
      {caption && (
        <figcaption className="px-5 py-3 text-xs text-muted-foreground leading-relaxed border-t border-border/10">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
};

export default BlogArticleHero;
