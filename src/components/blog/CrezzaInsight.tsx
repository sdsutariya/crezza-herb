import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { logoGreenTextClass, sectionEyebrowSmClass } from "@/lib/brand";

type CrezzaInsightProps = {
  children: string;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CrezzaInsight = ({ children }: CrezzaInsightProps) => {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease }}
      className="my-5 rounded-[16px] border border-primary/20 bg-primary/5 px-5 py-4 flex gap-3"
    >
      <Leaf className={`w-4 h-4 ${logoGreenTextClass} shrink-0 mt-0.5`} aria-hidden />
      <div>
        <p className={`${sectionEyebrowSmClass} tracking-[0.18em] mb-1.5`}>
          Crezza Insight
        </p>
        <p className="text-sm text-foreground leading-relaxed">{children}</p>
      </div>
    </motion.div>
  );
};

export default CrezzaInsight;
