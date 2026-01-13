import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A string of Tailwind CSS classes that applies a complex, glass-like box-shadow effect.
 * This can be used directly on a component's className property.
 * It includes styles for both light and dark modes.
 */
export const liquidGlassClasses =
  "bg-transparent shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

/**
 * A React style object that applies the SVG backdrop-filter for the liquid glass effect.
 * The filter ID '#liquid-glass-filter' must be present in the DOM.
 * The `GlassFilter` component provides this definition.
 */
export const liquidGlassStyle = {
  backdropFilter: 'url("#liquid-glass-filter")',
} as React.CSSProperties;

/**
 * Renders the SVG filter definition required for the liquid glass effect.
 * This component is hidden and does not render any visible elements.
 * It must be rendered somewhere on the page for the `liquidGlassStyle` to work.
 * The `LiquidGlass` component includes this automatically.
 */
export function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={120}
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

type LiquidGlassProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A reusable component to apply a "liquid glass" effect to its children.
 * It combines a complex box-shadow and an SVG backdrop-filter to create the effect.
 *
 * @example
 * <LiquidGlass className="p-4 rounded-lg">
 *   <p>Content inside the glass container.</p>
 * </LiquidGlass>
 */
export function LiquidGlass({
  children,
  className,
  ...props
}: LiquidGlassProps) {
  return (
    <div
      className={cn(liquidGlassClasses, className)}
      style={liquidGlassStyle}
      {...props}
    >
      {children}
      {/* The GlassFilter must be rendered for the backdrop-filter to work. */}
      <GlassFilter />
    </div>
  );
}
