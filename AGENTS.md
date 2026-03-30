# Codex Repo Rules

This repository uses the following conventions for Codex-driven edits:

## Source Of Truth

- `Design.md` is the source of truth for the design system.
- Before changing shared styling behavior, check `Design.md` first.
- If a design-system rule is implemented in code but missing from `Design.md`, update `Design.md` so the spec and implementation stay aligned.
- Keep `styleguide/theme/colors.config.js` and `styleguide/theme/Colors.ts` aligned with `Design.md`.

## Tooling And Runtime

- Use Yarn with `node_modules`.
- Do not reintroduce Yarn PnP or `.pnp.*` files.
- Do not mix unrelated Expo, React, React Native, or Metro upgrades into design-system work.

## Storybook And Metro

- Storybook must remain opt-in.
- Do not statically import `../.rnstorybook` into normal app routes or shared runtime paths.
- Keep Metro and app entrypoints safe for normal app startup when Storybook is disabled.

## Styling System

- Use `NativeWind` as the primary styling layer.
- Use `styleguide` only for shared theme tokens, theme contract, and runtime values that cannot be expressed cleanly in `className`.
- Use `useResponsive` only where runtime sizing is necessary.
- If not using `NativeWind` for sizing/spacing, use `useResponsive` helpers such as `scale`, `verticalScale`, `heightPixel`, or `widthPixel` instead of standalone numeric values.
- Example: avoid `width: 20`; prefer `width: scale(20)` or `width: widthPixel(20)`.

## Theme Usage

- Support both light mode and dark mode in shared components.
- Do not hardcode light-only or dark-only colors for design-system roles when a theme token exists.
- Prefer shared token roles from the current theme over ad hoc color values.
- NativeWind dark mode is driven by `media`.
- `useTheme().colors` is a flattened active-theme object, not a nested `light` or `dark` object.
- Do not import or reference `corttsLightColors` or `corttsDarkColors` directly inside feature components.
- In components, use `useTheme()` for non-typography runtime values such as backgrounds, borders, gradients, overlays, and icon colors.

## Typography

- Use the shared `Typography` component for text.
- Prefer `Typography` `size` props over manual `fontSize` and `lineHeight`.
- Only use manual text sizing when the design requires a one-off art-direction override.
- For `Typography` and `LinkTypography`, prefer NativeWind color token classes such as `text-onSurface`, `text-secondary`, `dark:text-dark-text`, etc.
- Do not set typography colors with inline `style.color` unless there is no valid token for that case.

## Components

- Keep shared primitives aligned to the design system specification:
  - editorial serif for display and headline text
  - Manrope for body and labels
  - tonal surfaces instead of divider-heavy layouts
  - rounded corners per the token scale
  - light/dark parity for shared controls
- Gradient buttons must be theme-aware.
- When updating primitives like `Typography`, `Button`, `TextInput`, `Checkbox`, `Radio`, or `Pill`, preserve the token-based light/dark behavior.

## Screen-Level Work

- Screens and feature components should consume the shared primitives instead of redefining design-system behavior locally.
- If a screen needs a new visual rule, prefer updating the shared primitive or token first.
- Avoid screen-level hardcoded colors, text sizing, borders, or radii when a shared token or primitive already covers the case.
