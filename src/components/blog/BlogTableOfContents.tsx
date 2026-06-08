import { motion } from "framer-motion";
import { ListTree } from "lucide-react";
import { logoGreenTextClass, sectionEyebrowSmClass } from "@/lib/brand";

type TocItem = {
  id: string;
  label: string;
};

type BlogTableOfContentsProps = {
  items: TocItem[];
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BlogTableOfContents = ({ items }: BlogTableOfContentsProps) => {
  if (items.length < 3) return null;

  return (
    <motion.nav
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease }}
      aria-label="Table of contents"
      className="mb-8 rounded-[20px] border border-border/10 bg-accent/20 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <ListTree className={`w-4 h-4 ${logoGreenTextClass}`} />
        <p className={sectionEyebrowSmClass}>
          In This Article
        </p>
      </div>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group flex gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className={`font-mono text-xs ${logoGreenTextClass} tabular-nums`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="group-hover:underline underline-offset-2">{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};

export default BlogTableOfContents;

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
