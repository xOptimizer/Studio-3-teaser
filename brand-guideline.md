# Brand Design & Styling Guidelines (Studio 3)

This document contains the visual identity, typography, spacing, component configurations, and interactive behaviors of the **Studio 3** website. Use these specifications to build consistent subdomains or related web products that align perfectly with the parent site's modern, premium minimalist aesthetic.

---

## 1. Design Philosophy
The design system of Studio 3 is built upon **premium minimalism, smooth transitions, and glassmorphism elements** overlaying structured, responsive layouts.
* **Light Theme Foundation**: The app uses a soft, off-white/light grey background with high-contrast black typography, combined with glassmorphism overlays for elements that float.
* **Responsive Fluidity**: Space, text sizes, and margins are fluidly scaled using CSS `clamp()` bounds, ensuring seamless adjustment from small mobile screens to large desktop viewports.
* **Micro-interactions**: Hover behaviors and modal transitions are smooth and premium, featuring subtle opacity shifts, scale animations, and backdrop-blur styling.

---

## 2. Color Palette

Use these exact color values to maintain color consistency across layouts:

| Name | Hex / RGBA Value | Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#F7F7F7` | Core page/body background |
| **Dark Slate (Zinc)** | `#101010` | Dark sections or dark background themes |
| **Brand Blue (Accent)** | `#2997FF` | Highlighting, primary links, primary buttons |
| **Deep Blue (Link Hover)**| `#2563EB` | Secondary action links and text arrows |
| **Primary Text** | `#000000` | Headings, core body copy, active labels |
| **Secondary Gray** | `#86868b` (or `#848597`) | Subheadings, secondary details, captions |
| **Muted Gray** | `#94928d` | Neutral borders and less-accented text elements |
| **Light Gray Border** | `#afafaf` | Input borders and dividers |
| **Overlay Gray** | `#42424570` | Translucent container backdrops (backdrop-blur) |
| **Slab/Footer Gray** | `#D4D4D4` | Flat footer section background |
| **Glassmorphism Backdrop** | `rgba(255, 255, 255, 0.7)` | Nav bars, modal cards, floated containers |
| **Glassmorphism Border** | `rgba(255, 255, 255, 0.3)` | Subtle outer border on glass components |

---

## 3. Typography System

Studio 3 utilizes Google Fonts to divide roles clearly between branding, branding actions, technical elements, and content reading.

### Font Families
1. **Branding/Logo**: `'Josefin Sans', sans-serif`
2. **Interactive Action Font**: `'Space Grotesk', sans-serif` (used for premium launch call-to-actions)
3. **Headings & Body Copy**: `'Inter', sans-serif`
4. **Technical/Monospace Headings**: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` (used for code-inspired header animations)

### Fluid Typography Scale (using `clamp()`)
Implement fluid font sizes to ensure they scale naturally according to screen size:

* **Large Hero / Highlight Titles**:
  ```css
  font-size: clamp(24pt, 6vw, 40pt);
  font-weight: 600 or 700;
  line-height: 1.3;
  ```
* **Section / Topic Headings**:
  ```css
  font-size: clamp(19pt, 4vw, 25pt);
  font-weight: 600 or 700;
  line-height: 1.2;
  ```
* **Feature Subtitles / Secondary Heading**:
  ```css
  font-size: clamp(18pt, 4vw, 28pt);
  font-weight: 600;
  ```
* **Paragraph Text (Large/Intro)**:
  ```css
  font-size: clamp(14pt, 4vw, 18pt);
  line-height: 1.6;
  color: #848597;
  ```
* **Paragraph Text (Regular Body)**:
  * Desktop: `14pt` (line-height: `1.5`, color: `#4B5563`)
  * Mobile: `11pt` (line-height: `1.5`, color: `#4B5563`)
* **Technical Headings (JetBrains Mono)**:
  * Responsive tailwind equivalent: `text-3xl sm:text-4xl md:text-6xl lg:text-7xl`
  * CSS additions: `letter-spacing: 0.05em; word-wrap: break-word;`

---

## 4. Layout, Spacing, and Margins

### Layout Boundaries
* **Maximum Screen Width**:
  * Centered core content: `max-width: 1120px;` (class: `.screen-max-width`)
  * Centered navigation bar: `max-width: 1280px;` (`max-w-7xl`)

### Page Spacing (Responsive)
* **Horizontal Section Padding**:
  * Responsive Utility: `px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36`
  * Tailwind Class Equivalent: `px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36`
* **Vertical Section Padding**:
  * Top: `clamp(40px, 8vw, 72px)`
  * Bottom: `clamp(40px, 10vw, 112px)`
  * Social/Discover exceptions: Top `clamp(60px, 8vw, 80px)` and Bottom `clamp(24px, 5vw, 44px)`
* **Content Spacing (Bottom Margins)**:
  * Small margins (Topic labels/Titles to subheadings): `clamp(16px, 3vw, 24px)`
  * Large margins (Subheadings to blocks): `clamp(32px, 6vw, 48px)`

---

## 5. Component Styling Guidelines

### A. Navigation Bar (TopBar)
Floating nav bar that sits at the top of the viewport.
* **Layout**: `fixed top-0 left-0 right-0 z-50 w-full py-3 sm:py-5 px-3 sm:px-4`
* **Card Design**:
  * Max width: `max-w-7xl mx-auto`
  * Border radius: `rounded-2xl`
  * Background: `rgba(255, 255, 255, 0.7)`
  * Backdrop filter: `blur(20px) saturate(180%)`
  * Border: `1px solid rgba(255, 255, 255, 0.3)`
  * Box shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.1)`
* **Logo text**:
  * Value: `studio 3` (lowercase preferred)
  * Styling: `font-family: 'Josefin Sans'`, `font-bold`, `text-black`
  * Size: `text-lg sm:text-xl md:text-2xl lg:text-3xl`
* **CTA Button**:
  * Font family: `'Space Grotesk', sans-serif`
  * Background color: `#B8C5D6`
  * Text color: `#000000`
  * Border-radius: `9999px` (Pill shape)
  * Padding: `px-3 sm:px-5 py-1.5 sm:py-2.5`
  * Box shadow: `0 2px 8px 0 rgba(0, 0, 0, 0.1)`
  * Hover: `hover:opacity-80` with `transition-all duration-200`

### B. Glassmorphism Modals & Forms
Modals are triggered via portals and float over the page with a blurred background.

* **Modal Overlay**:
  * Layout: `fixed inset-0 z-[9999]`
  * Backdrop: `bg-white bg-opacity-10 backdrop-blur-md`
  * Inner styling: `opacity: 0` (animated to `1`), custom box-shadow: `inset 0 0 100px rgba(255, 255, 255, 0.1), 0 0 200px rgba(0, 0, 0, 0.1)`
* **Modal Container Box**:
  * Layout: `relative z-10 rounded-3xl p-8 md:p-12 w-full max-h-[90vh] max-w-[600px] overflow-y-auto`
  * Background: `rgba(255, 255, 255, 0.7)`
  * CSS Filters: `backdrop-filter: blur(20px)`
  * Border: `1px solid rgba(255, 255, 255, 0.3)` (or tailwind `border-white border-opacity-20`)
  * Box shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)`
* **Close Button**:
  * Class: `absolute top-6 right-6 text-gray-600 hover:text-black transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center`
  * Label: `×` (or close icon)
* **Form Input Fields**:
  * Layout: `w-full px-4 py-2.5 rounded-2xl text-black focus:outline-none transition-all text-xs`
  * Background: `rgba(255, 255, 255, 0.3)`
  * Filter: `backdrop-filter: blur(10px)`
  * Border: `1px solid rgba(0, 0, 0, 0.3)`
  * Focus State: `focus:ring-2 focus:ring-gray-300`, focus border: `border-color: rgba(0, 0, 0, 0.5) !important`
  * Placeholder: Color: `#000000 !important`, opacity: `0.6`
* **Form Action Button (Submit)**:
  * Layout: `w-full bg-black text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 mt-3`

### C. Standard Buttons

1. **Brand Blue Button (`.btn` Utility)**:
   * Layout: `px-5 py-2 rounded-3xl bg-[#2997FF] my-5 border border-transparent`
   * Text: `text-white font-medium`
   * Hover: `hover:bg-transparent hover:text-[#2997FF] hover:border-[#2997FF]` (smooth inverse transition)
2. **Text Link Button (CTA Link)**:
   * Color: `#2563EB` (or Brand Blue `#2997FF`)
   * Layout: `inline-flex items-center gap-1 font-medium cursor-pointer`
   * Size: `clamp(14pt, 2.5vw, 16pt)`
   * Hover: `hover:opacity-80`
   * Trailing arrow: `→` (or svg icon)
3. **Muted Selector Button (Backdrop Controls)**:
   * Layout: `p-1 rounded-full bg-gray-300 backdrop-blur` (class: `.color-container` or `.size-btn-container`)
   * Active children: `w-10 h-10 text-sm flex justify-center items-center bg-white text-black rounded-full transition-all`

### D. Footers
A flat, solid slab section resting at the bottom of the page.
* **Layout**: `w-full flex flex-col md:flex-row justify-between items-center px-4 sm:px-12 lg:px-20 md:py-8`
* **Padding / Inset Styling**:
  * Padding top: `2rem`
  * Padding bottom: `calc(5rem + env(safe-area-inset-bottom))` (offsets navigation controls on iOS safari devices)
* **Background**: `#D4D4D4`
* **Typography**: `'Inter', sans-serif`, `text-black text-sm font-semibold`
* **Link Action State**: `hover:opacity-70 transition-opacity`

---

## 6. Animations & Interactive Transitions

Keep interactive elements alive using smooth transition definitions and keyframes:

### CSS Keyframes
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

### GSAP (GreenSock) Motion Patterns
If GSAP is available in your sub-domain bundle, replicate these transition parameters:
* **Modal Trigger Scale-In**:
  * Overlay: opacity `0` -> `1`, duration `0.3s`
  * Modal Content: scale `0.95` -> `1.0`, opacity `0` -> `1`, duration `0.4s`, easing: `'power2.out'`
* **Modal Dismiss Scale-Out**:
  * Overlay: opacity `1` -> `0`, duration `0.2s`
  * Modal Content: scale `1` -> `0.95`, opacity `1` -> `0`, duration `0.2s`
* **Scroll Animation Fade-In (`.g_fadeIn` or `.translate-y-20`)**:
  * Initial State: `opacity: 0; transform: translateY(100px);` (or `translateY(20px)`)
  * Target State: Animates to `opacity: 1; transform: translateY(0);` upon scrolling into viewport using GSAP ScrollTrigger.

---

## 7. Tailwind Configuration Boilerplate

To easily implement this design system in a Tailwind CSS project, merge the following into your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#2997FF", // Primary Brand Accent
          hover: "#2563EB"    // Secondary Action Blue
        },
        gray: {
          DEFAULT: "#86868b", // Neutral Body Text
          100: "#94928d",     // Semi-light Label Gray
          200: "#afafaf",     // Form Input Border
          300: "#42424570",   // Glassmorphism Container Backdrop
          slab: "#D4D4D4"     // Flat solid gray
        },
        zinc: {
          DEFAULT: "#101010"  // Dark canvas
        },
        canvas: "#F7F7F7"     // Primary light background canvas
      },
      fontFamily: {
        josefin: ["'Josefin Sans'", "sans-serif"],
        grotesk: ["'Space Grotesk'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
        jetbrains: ["'JetBrains Mono'", "monospace"]
      }
    },
  },
  plugins: [],
};
```

---

## 8. Vanilla CSS Core Definitions

Add the following to your main styles CSS stylesheet (e.g., `index.css`) to define key brand utility classes and defaults:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  color: #000000;
  background: #F7F7F7;
  min-height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* Glassmorphism Containers & Buttons */
@layer utilities {
  .flex-center {
    @apply flex items-center justify-center;
  }

  .screen-max-width {
    margin-inline-start: auto;
    margin-inline-end: auto;
    position: relative;
    max-width: 1120px;
  }

  .common-padding {
    @apply sm:py-32 py-20 sm:px-10 px-5;
  }

  @media (max-width: 640px) {
    .common-padding {
      @apply py-16 px-5;
    }
  }

  /* Brand Blue Pill Button */
  .btn {
    @apply px-5 py-2 rounded-3xl bg-blue text-white my-5 border border-transparent transition-all duration-300;
  }
  .btn:hover {
    @apply bg-transparent text-blue border-blue;
  }

  /* Glassmorphism Color Picker Backdrop */
  .color-container {
    @apply flex items-center justify-center px-4 py-4 rounded-full bg-gray-300 backdrop-blur;
  }

  /* Chevron text icon transition */
  .link-arrow {
    @apply transition-transform duration-300 inline-block;
  }
  .link-arrow-hover:hover .link-arrow {
    @apply translate-x-1;
  }
}
```
