import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { logoGreenBgClass, logoGreenTextClass, sectionEyebrowSmClass } from "@/lib/brand";

type BlogKeyTakeawaysProps = {
  items: string[];
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BlogKeyTakeaways = ({ items }: BlogKeyTakeawaysProps) => {
  if (items.length === 0) return null;

  return (
    <motion.aside
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.08, ease }}
      className="mb-8 rounded-[20px] border border-primary/15 bg-card p-6 md:p-8 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-4 h-4 ${logoGreenTextClass}`} />
        <p className={sectionEyebrowSmClass}>
          Key Takeaways
        </p>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-foreground leading-relaxed">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${logoGreenBgClass}`} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default BlogKeyTakeaways;
