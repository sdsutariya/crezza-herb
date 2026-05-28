import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bottleImg from "@/assets/bottle.png";

type BlogCTAProps = {
  variant?: "inline" | "card";
};

const BlogCTA = ({ variant = "card" }: BlogCTAProps) => {
  if (variant === "inline") {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Ready to start your hair care routine?{" "}
        <Link to="/#order" className="text-primary font-medium hover:underline">
          Shop CrezzaHerb Herbal Hair Oil — ₹399
        </Link>
      </p>
    );
  }

  return (
    <div className="rounded-[20px] border border-primary/20 bg-primary/5 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
      <img
        src={bottleImg}
        alt="CrezzaHerb Herbal Hair Oil"
        className="w-20 h-24 object-contain shrink-0"
      />
      <div className="flex-1 text-center sm:text-left space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          Recommended Product
        </p>
        <h3 className="font-serif text-lg text-foreground">CrezzaHerb Herbal Hair Oil</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          14-day slow-infused Ayurvedic blend for hair fall control, stronger roots, and healthier-looking hair. 100% natural.
        </p>
        <p className="text-lg font-serif text-foreground">₹399 · Free shipping across India</p>
      </div>
      <Button asChild className="h-11 rounded-[12px] shrink-0 gap-2">
        <Link to="/#order">
          Buy Now <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};

export default BlogCTA;
