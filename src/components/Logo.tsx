import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/crezzaherb-icon-transparent.png";

type LogoVariant = "brand" | "stacked" | "icon";
type LogoSize = "xs" | "sm" | "nav" | "md" | "footer" | "lg";
type CoreLogoSize = "xs" | "sm" | "md" | "lg";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  linkTo?: string;
};

const BRAND_GAP = "gap-1 sm:gap-1.5";
const FOOTER_GAP = "gap-0.5 sm:gap-1";
const TEXT_MD = "text-2xl md:text-3xl";

function sizePresets(
  core: Record<CoreLogoSize, string>,
  overrides?: Partial<Record<"nav" | "footer", string>>,
): Record<LogoSize, string> {
  return {
    ...core,
    nav: overrides?.nav ?? core.sm,
    footer: overrides?.footer ?? core.md,
  };
}

const textSizes: Record<LogoSize, string> = {
  xs: "text-base",
  sm: "text-lg md:text-xl",
  nav: "text-xl md:text-2xl",
  md: TEXT_MD,
  footer: TEXT_MD,
  lg: TEXT_MD,
};

const brandIconSizes = sizePresets(
  {
    xs: "h-[1.12em] w-[1.12em]",
    sm: "h-[1.14em] w-[1.14em] md:h-[1.16em] md:w-[1.16em]",
    md: "h-[1.12em] w-[1.12em] md:h-[1.16em] md:w-[1.16em]",
    lg: "h-[1.14em] w-[1.14em] md:h-[1.18em] md:w-[1.18em]",
  },
  {
    nav: "h-10 w-10 md:h-11 md:w-11",
    footer: "h-12 w-12 md:h-14 md:w-14",
  },
);

const stackedIconSizes = sizePresets(
  {
    xs: "h-[1.45em] w-[1.45em]",
    sm: "h-[1.5em] w-[1.5em] md:h-[1.55em] md:w-[1.55em]",
    md: "h-[1.45em] w-[1.45em] md:h-[1.5em] md:w-[1.5em]",
    lg: "h-[1.45em] w-[1.45em] md:h-[1.5em] md:w-[1.5em]",
  },
  {
    nav: "h-12 w-12 md:h-14 md:w-14",
  },
);

const iconOnlySizes = sizePresets({
  xs: "h-8 w-8",
  sm: "h-10 w-10 md:h-11 md:w-11",
  md: "h-12 w-12 md:h-14 md:w-14",
  lg: "h-16 w-16 md:h-20 md:w-20",
});

const wordmarkClass =
  "font-serif font-semibold tracking-tight text-primary leading-none whitespace-nowrap";

const logoMaskStyle = {
  WebkitMaskImage: `url(${logoIcon})`,
  maskImage: `url(${logoIcon})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

type LogoMarkProps = {
  sizeClass: string;
  className?: string;
  ariaHidden?: boolean;
};

const LogoMark = ({ sizeClass, className, ariaHidden = true }: LogoMarkProps) => (
  <span
    aria-hidden={ariaHidden ? "true" : undefined}
    className={cn("inline-block shrink-0 bg-primary", sizeClass, className)}
    style={logoMaskStyle}
  />
);

const Logo = ({
  variant = "brand",
  size = "sm",
  className,
  linkTo,
}: LogoProps) => {
  const content =
    variant === "icon" ? (
      <LogoMark
        sizeClass={iconOnlySizes[size]}
        className={className}
        ariaHidden={false}
      />
    ) : variant === "stacked" ? (
      <span
        className={cn(
          "inline-flex flex-col items-center gap-2 text-center",
          textSizes[size],
          className,
        )}
      >
        <LogoMark sizeClass={stackedIconSizes[size]} />
        <span className={wordmarkClass}>CREZZAHERB</span>
      </span>
    ) : (
      <span
        className={cn(
          "inline-flex max-w-full items-center",
          size === "footer" ? FOOTER_GAP : BRAND_GAP,
          textSizes[size],
          className,
        )}
      >
        <LogoMark sizeClass={brandIconSizes[size]} />
        <span className={wordmarkClass}>CREZZAHERB</span>
      </span>
    );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className="inline-flex shrink-0 items-center"
        aria-label="CrezzaHerb home"
      >
        {content}
      </Link>
    );
  }

  if (variant === "icon") {
    return (
      <span className="inline-flex shrink-0 items-center" aria-label="CrezzaHerb">
        {content}
      </span>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{content}</span>;
};

export default Logo;
