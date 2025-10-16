# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **CyEyes Coming Soon Page** project - a landing page for an AI-driven cybersecurity platform with the tagline "Offensive | Defensive | Intelligence".

The website features:
- Bilingual support (Vietnamese/English)
- Hero section with animated logo and "Coming Soon" message
- 6 QR codes in a grid layout linking to different platform resources
- Cybersecurity-themed design with particle/network effects

## Brand Identity

**Color Palette:**
- Primary Navy Blue: `#1a1f4d`
- Cyan/Teal: `#17a2b8`
- Light Cyan: `#4fc3dc`
- Dark Background: `#0a0e27`
- White/Light Gray: `#ffffff`, `#e8e8e8`

**Typography:**
- Headings: 'Orbitron' or 'Rajdhani' (futuristic/tech fonts)
- Body: 'Inter' or 'Space Grotesk' (clean, modern)
- Accent/Code: 'Fira Code' or 'JetBrains Mono' (monospace)

**Visual Elements:**
- Hexagon logo with network nodes representing connectivity and AI
- Animated particle/network effects in background
- Glow effects using cyan colors

## Content Structure

### QR Code Sections (6 total):
1. Official Website (🌐)
2. Product Demo (🎯)
3. Technical Documentation (📚)
4. Contact & Support (💬)
5. Community & Social Media (👥)
6. Newsletter/Updates (📧)

### Bilingual Content Keys:
- Vietnamese: "Sắp Ra Mắt"
- English: "Coming Soon"
- Tagline: "AI-Driven Cybersecurity Platform"
- Description: "Comprehensive Security Solutions: Offensive, Defensive, Intelligence"

## Design Specifications

**Responsive Breakpoints:**
- Mobile: 320px - 767px (1 column QR grid)
- Tablet: 768px - 1023px (2 column QR grid)
- Desktop: 1024px+ (3 column QR grid)

**Layout:**
- Max-width: 1400px
- Section vertical spacing: 6rem (96px)
- Grid gap: 2rem (32px)

**Key Animations:**
- Hero: Fade in + scale up entrance, pulse glow effect
- Background: Animated network nodes/particles
- "Coming Soon" text: Typing/glitch effect with gradient shimmer
- QR Cards: Hover with translateY(-10px) + scale(1.05) + enhanced glow
- Staggered card entrance: 100ms delay between each

**Effects:**
- Cyan glow: `0 0 20px rgba(79, 195, 220, 0.5)`
- Navy glow: `0 0 30px rgba(26, 31, 77, 0.8)`
- Gradient borders on hover
- Optional matrix rain effect in background

## Technical Notes

**Recommended Tech Stack:**
- HTML5 semantic markup
- CSS3 (Grid, Flexbox)
- Vanilla JS or React.js
- Animation libraries: GSAP or Framer Motion
- Particle effects: Three.js or Particles.js
- Scroll animations: AOS (Animate On Scroll)
- i18n: i18next for language switching

**Performance Considerations:**
- Lazy load images
- Use WebP format for images
- Minify CSS/JS
- Simplify animations on mobile devices

**Browser Support:**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Reference Document

All detailed specifications are in `brd.md` (Business Requirements Document in Vietnamese), which includes:
- Complete brand identity guidelines
- Detailed UI/UX specifications
- Animation sequences
- Full bilingual content
- Technical implementation details
