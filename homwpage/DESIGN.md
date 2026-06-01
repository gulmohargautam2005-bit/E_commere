---
name: Luxe
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfde'
  on-secondary-container: '#626361'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f1b13'
  on-tertiary-container: '#898377'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#eae2d4'
  tertiary-fixed-dim: '#cdc6b8'
  on-tertiary-fixed: '#1f1b13'
  on-tertiary-fixed-variant: '#4b463c'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 80px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-xl-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1440px
---

## Brand & Style
The design system is anchored in a high-fashion editorial aesthetic, blending the prestige of a physical magazine with the fluid utility of modern e-commerce. It targets a discerning audience that values curation, intentionality, and quiet luxury.

The style is **Minimalist / Editorial**, characterized by expansive white space, a strictly disciplined color palette, and a focus on high-quality product photography. Visual interest is generated through typographic scale and precise alignment rather than decorative ornamentation. The interface acts as a silent gallery, ensuring the fashion remains the primary focus.

## Colors
The palette is tonal and restrained, mirroring the materials of a luxury atelier. 
- **Primary (#1A1A1A):** A deep charcoal black used for core brand elements, high-contrast headings, and primary calls to action.
- **Secondary (#F9F8F6):** A creamy off-white that serves as the canvas for the entire system, providing a softer, more premium feel than pure white.
- **Tertiary (#8C867A):** A sophisticated beige used for accents, subtle dividers, and inactive states.
- **Neutral (#4A4A4A):** A soft charcoal for body text and secondary information, maintaining legibility without the harshness of true black.
- **Functional:** Success, Error, and Warning states should be desaturated to fit the palette (e.g., a dusty rose for errors rather than bright red).

## Typography
The typography system relies on a high-contrast pairing: **Bodoni Moda** for display and **Inter** for utility.

- **Display & Headlines:** Use Bodoni Moda to evoke a sense of heritage and high-fashion authority. Keep tracking tight for large displays and slightly looser for smaller headlines.
- **Body & UI:** Use Inter for all functional text, product descriptions, and navigation. Its neutral, geometric construction provides the necessary balance to the expressive serif.
- **Scale:** Maintain a clear hierarchy. Large display type should be used sparingly for hero sections and editorial features, while labels use all-caps tracking to create a "tag" aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop, centered within a 1440px container to maintain an editorial feel regardless of monitor size.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. For mobile, transition to a 2-column or 4-column layout with 20px margins.
- **Philosophy:** Embrace "intentional emptiness." Use large vertical margins (80px–120px) between sections to separate different fashion stories or collections.
- **Rhythm:** Spacing is strictly based on an 8px scale. Padding within components should be generous to avoid a cramped "utility" look.

## Elevation & Depth
This design system avoids traditional shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Depth is created by placing secondary-colored containers (#F9F8F6) against slightly darker backgrounds or using 1px borders in the tertiary shade (#8C867A).
- **Glassmorphism:** Use subtle backdrop blurs (20px) on navigation bars and floating overlays to maintain context while ensuring legibility.
- **Depth:** When an element must float (like a cart drawer), use a very soft, highly diffused ambient shadow (#000000 at 4% opacity) to suggest elevation without breaking the flat editorial aesthetic.

## Shapes
The shape language balances the sharp lines of modernism with soft, organic curves. 

- **Corners:** Use a standard 16px (`rounded`) for cards and input fields. Larger containers like modals or hero images should utilize 24px (`rounded-xl`) to soften the visual impact.
- **Icons:** Use **Material Symbols Outlined** with a thin weight (200-300) to match the light, airy feel of the Inter typeface.

## Components
- **Buttons:** Primary buttons are solid Charcoal (#1A1A1A) with white Inter text. Secondary buttons are outlined with 1px Tertiary (#8C867A). Both use a springy hover transition: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Inputs:** Minimalist fields with only a bottom border or a very light 1px frame. Focus states should transition the border color to Primary Charcoal.
- **Cards:** Product cards should be borderless with generous padding. The image is the hero; text should be secondary, using `label-sm` for categories and `body-md` for names.
- **Chips:** Used for sizing and filters. Small, pill-shaped with light backgrounds. Selected states are indicated by a solid fill and white text.
- **Interactive States:** All clickable elements (links, cards, buttons) must respond with a subtle scale-up (1.02x) or color shift using the defined springy cubic-bezier to feel responsive and premium.