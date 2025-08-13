# Usage Guide: Liquid Glass Effect

This guide explains how to use the reusable liquid glass effect component and its related exports within the project.

---

## 1. The Easy Way: `<LiquidGlass />` Component

The simplest way to apply the effect is to wrap your components with the `<LiquidGlass />` wrapper. It handles everything for you, including the styles, the filter, and the SVG definition.

**When to use it:** This is the recommended approach for most situations, especially when you are creating new UI elements and don't want to worry about the implementation details.

### Example:

```tsx
// src/app/my-page.tsx

import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10">
      <LiquidGlass className="rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Hello from inside the glass!</h1>
        <p className="mt-2 text-muted-foreground">
          This entire container has the liquid glass effect applied via the wrapper component.
        </p>
        <Button className="mt-4">A Button</Button>
      </LiquidGlass>
    </div>
  );
}
```

---

## 2. The Advanced Way: Direct Styling

For more control, you can apply the effect directly to your own components using the exported `liquidGlassClasses` and `liquidGlassStyle`.

**When to use it:**
- When you want to apply the effect to an existing component from a library (e.g., a `Card` or `Dialog` from shadcn/ui) without adding a wrapper `<div>`.
- When adding a wrapper would break your CSS layout (e.g., in a complex flex or grid container).

### **IMPORTANT REQUIREMENT**

When using this method, you **MUST** ensure the `<GlassFilter />` component is rendered somewhere in your application tree. The best place for this is your root layout file, so it's available globally.

### Example:

**Step A: Add the `<GlassFilter />` to your layout.**

```tsx
// src/app/layout.tsx

import { GlassFilter } from "@/components/ui/liquid-glass";
// ... other imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Add this here! It renders the hidden SVG filter definition. */}
        <GlassFilter />
      </body>
    </html>
  );
}
```

**Step B: Apply the styles to your component.**

```tsx
// src/app/my-advanced-page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  liquidGlassClasses,
  liquidGlassStyle,
} from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

export default function MyAdvancedPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-10">
      <Card
        // 1. Use cn() to merge the effect classes with your own.
        className={cn(
          liquidGlassClasses,
          "w-1/2 rounded-2xl border-none p-4"
        )}
        // 2. Apply the style object for the backdrop-filter.
        style={liquidGlassStyle}
      >
        <CardHeader>
          <CardTitle>A Directly Styled Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This `Card` has the liquid glass effect applied directly to it, without a wrapper.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```
