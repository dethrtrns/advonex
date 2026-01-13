
# Plan: Apply Liquid Glass Design to Login Modal

## 1. Goal
Apply the existing `LiquidGlass` styling to the `login-modal.tsx` component to give the login drawer a modern, liquid glass appearance.

## 2. Component to Modify
- `src/hooks/login/login-modal.tsx`

## 3. Required Modifications

### `src/hooks/login/login-modal.tsx`
- I will import the `LiquidGlass` component from `src/components/ui/liquid-glass.tsx`.
- I will wrap the content of the `DrawerContent` component with the `LiquidGlass` component.
- I will adjust the styling of the `DrawerContent` and surrounding elements to ensure the liquid glass effect is seamless and visually appealing. This includes removing the existing `shadow-xl` and `rounded-2xl` classes from `DrawerContent` and applying them to the `LiquidGlass` component instead.

### `src/app/layout.tsx`
- I will import the `GlassFilter` component from `src/components/ui/liquid-glass.tsx`.
- I will add the `<GlassFilter />` component to the root layout to ensure the SVG filter is available globally for any component that uses the `liquidGlassStyle`.

## 4. Permissions
- I need permission to modify `src/app/layout.tsx` to add the global SVG filter.

## 5. Implementation Steps
1.  **Modify `login-modal.tsx`:**
    - Import `LiquidGlass`.
    - Restructure the JSX to use `LiquidGlass` as a wrapper.
    - Transfer and adjust CSS classes.
2.  **Modify `layout.tsx`:**
    - Import `GlassFilter`.
    - Add `<GlassFilter />` to the main `body` element.

This approach will apply the desired visual effect while ensuring the necessary SVG filter is available for the component to render correctly.
