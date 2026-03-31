# Design System Specification: The Curated Estate

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Concierge"**

This design system moves away from the sterile, modular "box-filling" of traditional property apps. Instead, it adopts a high-end editorial approach—think of a luxury architectural digest meeting a private banking interface. We break the "template" look by utilizing intentional asymmetry, where large serif headlines anchor the eye, and secondary information floats in generous whitespace.

The goal is to evoke a sense of "quiet luxury." By layering soft, warm surfaces and prioritizing tonal depth over rigid lines, we create a digital environment that feels as tactile and reassuring as a high-end limestone lobby.

---

## 2. Colors & Tonal Architecture
The palette is rooted in organic, warm neutrals with deep, authoritative accents. It avoids the harshness of pure black or the sterility of pure white.

### Theme Principle
This system is designed to support both **light mode** and **dark mode** using the same semantic roles. Light and dark should not behave like separate brands; they should feel like two expressions of the same estate identity.

- Light mode should feel like warm paper, stone, and editorial ink.
- Dark mode should feel like midnight navy, slate, and softened pale accents.
- Components must map to semantic roles such as `background`, `surface`, `card`, `border`, `text`, `text-weak`, `primary`, `secondary`, and `tertiary` instead of hardcoded per-screen colors.
- Token definitions in implementation should stay aligned across both Tailwind/NaturalWind tokens and runtime theme values.

### The Palette (Material Design Mapping)
- **Core Background:** `#fbf9f6` (Surface) – A warm, off-white bone that reduces eye strain and feels premium.
- **Primary Accent:** `#000104` (Primary) – A deep, "Ink Navy" used for high-contrast branding and navigation.
- **Secondary Accent:** `#715b3e` (Secondary) – A "Muted Gold/Bronze" used to denote luxury and status.
- **Tertiary Accent:** `#000101` (Tertiary) – A "Forest Obsidian" for subtle interactive elements.

### Light / Dark Role Mapping
- **Paper / Main Background (Light):** `#fbf9f6`
- **Stone / Tonal Surface (Light):** `#f5f3f0`
- **Pebble / Subtle Detail (Light):** `#e6e8e9`
- **Steel / Muted Text (Light):** `#71777f`
- **Charcoal / Secondary Text (Light):** `#44474c`
- **Midnight / Main Background (Dark):** `#0f1d2d`
- **Slate / Tonal Surface (Dark):** `#1b2a3a`
- **Divider / Structural Edge (Dark):** `#2c3e50`
- **Primary Text (Dark):** `#fbf9f6`
- **Muted Text (Dark):** `#c4c6cd`

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define a new content area, you must use a background color shift. For example:
- A property detail card (`surface_container_lowest`) sits on a `surface_container_low` background.
- A sidebar uses `surface_container_high` to distinguish itself from the main `surface` feed.
- **Never** use a `1px solid #ccc` line to separate sections.

### Glass & Gradient Soul
To move beyond "flat" design, use Glassmorphism for floating navigation bars or action sheets.
- **Glass Token:** `surface` at 80% opacity with a `20px` backdrop-blur.
- **Signature Gradients:** For primary CTAs (e.g., "Request Viewing"), use a subtle linear gradient from `primary` (#000104) to `primary_container` (#0f1d2d) at a 135-degree angle. This adds a "weighted" feel that flat color lacks.

---

## 3. Typography: Editorial Authority
We utilize a high-contrast pairing: a sophisticated Serif for storytelling and a precision Sans-Serif for data.

* **Display & Headlines (Noto Serif):** These are the "voice" of the brand. Use `display-lg` (3.5rem) for hero property titles and `headline-md` (1.75rem) for section headers. The serif nature conveys history, trust, and permanence.
* **Body & Labels (Manrope):** This is the "engine." `body-lg` (1rem) provides the clarity of a fintech app for lease agreements and financial breakdowns. Manrope’s geometric but warm terminals keep the interface feeling modern and legible at small scales.
* **Hierarchy Tip:** Always use `on_surface_variant` (#44474c) for secondary labels to ensure the eye hits the Serif headlines first.

---

## 4. Elevation & Depth
In this system, depth is a physical property of the UI "layers," not a decoration.

### The Layering Principle
Think of the UI as stacked sheets of fine cotton paper.
1. **Level 0 (Base):** `surface` (#fbf9f6)
2. **Level 1 (Sub-sections):** `surface_container_low` (#f5f3f0)
3. **Level 2 (Active Cards):** `surface_container_lowest` (#ffffff)

### Ambient Shadows
Shadows must feel like natural light hitting an object. Use the following logic:
- **Large Blur:** Minimum `32px` blur for a `4px` Y-offset.
- **Low Opacity:** Shadow color must be a tinted version of `on_surface` at `5%` opacity.
- **Shadow Token:** `0 4px 32px rgba(27, 28, 26, 0.05)`.

### The Ghost Border Fallback
If accessibility requires a container edge (e.g., in high-glare environments), use a "Ghost Border": `outline_variant` (#c4c6cd) at **15% opacity**. It should be felt, not seen.

---

## 5. Components & UI Elements

### Buttons
- **Primary:** Gradient-filled (`primary` to `primary_container`), `xl` (0.75rem) rounded corners. Height: `3.5rem` (Spacing 10).
- **Secondary:** Transparent background with a `secondary` (#715b3e) text color and a `Ghost Border`.
- **States:** On hover, shift the background to `secondary_container` for a warm, "glow" effect.

Implementation note:
- In shared code, button treatments must stay theme-aware.
- If the product uses a solid primary button in a component set, dark mode should still map that button to the dark-theme primary role rather than introducing unrelated colors.

### Input Fields
- **Styling:** No bottom border. Instead, use a `surface_container_highest` fill with `md` (0.375rem) rounded corners.
- **Focus State:** Background remains the same, but the label (floating) shifts to `primary` and a `1px` Ghost Border becomes visible at 30% opacity.

Implementation note:
- Inputs should derive border, fill, label, placeholder, and icon treatments from shared semantic tokens so light and dark remain visually matched.

### Property Cards & Lists
- **Prohibition:** **No dividers.**
- **The Gap Rule:** Use `spacing-6` (2rem) of vertical white space to separate list items.
- **Image Integration:** Images should always use `xl` (0.75rem) roundedness to soften the "luxury" feel.

### Additional Signature Components
- **The "Status Ribbon":** A chip using `secondary_fixed` (#fcdeba) background and `on_secondary_fixed` (#281903) text. Used for "Premium Listing" or "Verified Landlord."
- **Tonal Steppers:** For mortgage or lease applications, use a progress bar where the inactive track is `surface_variant` and the active track is a `secondary` gradient.

---

## 6. Do’s and Don’ts

### Do:
* **Do** use asymmetrical spacing. A left margin of `spacing-8` and a right margin of `spacing-4` can create a more editorial, bespoke feel.
* **Do** prioritize the Serif typeface for any text over 24px.
* **Do** use `surface_bright` to highlight active financial data points in a table.

### Don’t:
* **Don't** use pure black (#000000) or pure grey. Always use the provided tinted neutrals to maintain warmth.
* **Don't** use "Drop Shadows" on text. High-end design relies on typographic scale and color contrast for legibility.
* **Don't** use sharp 0px corners. Even the most "fintech" elements should have at least the `sm` (0.125rem) corner radius to feel approachable.
* **Don't** crowd the screen. If a page feels full, increase the spacing scale by one step. Luxury is defined by the space you *don't* use.
