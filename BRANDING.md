# Atlas Branding Guidelines

## Logo Requirements

### Icon Sizes Needed

#### Chrome Extension (apps/extension/public/icons/)
- `icon-16.png` - 16x16px (browser toolbar)
- `icon-32.png` - 32x32px (Windows taskbar)
- `icon-48.png` - 48x48px (extension management page)
- `icon-128.png` - 128x128px (Chrome Web Store listing)

#### Web App (apps/web/public/)
- `favicon.ico` - Multi-resolution (16x16, 32x32)
- `favicon-16x16.png` - Browser tab
- `favicon-32x32.png` - Browser tab (retina)
- `apple-touch-icon.png` - 180x180px (iOS home screen)
- `android-chrome-192x192.png` - Android home screen
- `android-chrome-512x512.png` - Splash screen
- `logo.svg` - Scalable logo for header

### File Format Requirements
- **PNG** - For all raster icons (24-bit with alpha transparency)
- **SVG** - For scalable logo in web app
- **ICO** - For favicon.ico (multi-resolution)

## Color Palette

### Primary Colors
```
Primary Blue:     #3B82F6  (Main brand color)
Primary Dark:     #2563EB  (Hover states)
Primary Darker:   #1D4ED8  (Active states)
```

### Semantic Colors
```
Deep Blue:        #1E40AF  (Leverage/keystone tools)
Success Green:    #10B981  (Workflows)
Purple:           #8B5CF6  (Goals)
Gold:             #EAB308  (Monetization)
Orange:           #F97316  (Redundancy/warnings)
Cyan:             #06B6D4  (Filters)
```

### Neutral Grays
```
Gray 900:         #111827  (Text)
Gray 700:         #374151  (Secondary text)
Gray 500:         #6B7280  (Tertiary text)
Gray 300:         #D1D5DB  (Borders)
Gray 100:         #F3F4F6  (Backgrounds)
Gray 50:          #F9FAFB  (Page background)
```

## Design Principles

### Logo Concept
Atlas represents **personal tool intelligence** - organizing and understanding your tool ecosystem with AI.

**Symbolism Options:**
- 🗺️ Atlas/Map - Tool landscape mapping
- 🧭 Compass - Navigation through tools
- 🔗 Network Graph - Connected relationships
- 🧠 Intelligence - AI-powered insights
- 🌐 Globe with Nodes - Global tool ecosystem

### Visual Style
- **Modern & Geometric** - Clean, professional lines
- **Flat or Subtle Gradient** - Matches current UI
- **Scalable** - Must work at 16px favicon size
- **Distinctive** - Recognizable in browser tabs
- **Professional but Approachable** - Productivity tool, not enterprise

### Logo Variations Needed

1. **Icon Only**
   - For favicons and small spaces
   - Should be distinctive without text
   - Works in monochrome

2. **Icon + Wordmark**
   - For web app header
   - Horizontal lockup
   - "Atlas" in clean sans-serif

3. **Full Lockup** (optional)
   - Icon + "Atlas" + tagline
   - "Personal Tool Intelligence"
   - For marketing materials

## Implementation Checklist

### For Web App
- [ ] Add favicons to `apps/web/public/`
- [ ] Update `apps/web/index.html` with favicon links
- [ ] Add `manifest.json` for PWA support
- [ ] Add `logo.svg` for header component

### For Extension
- [ ] Add all icon sizes to `apps/extension/public/icons/`
- [ ] Icons referenced in `manifest.json`
- [ ] Test icons at all sizes in Chrome

### Design File Requirements
- Provide source files (AI, Figma, Sketch)
- Export specifications documented
- Color codes match exactly
- Maintain aspect ratios

## Typography

**Primary Font:** System font stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
```

**Wordmark Font Suggestions:**
- Inter (modern, geometric)
- Poppins (friendly, approachable)
- Space Grotesk (unique, techy)
- Work Sans (professional, clean)

## Usage Guidelines

### Minimum Sizes
- Icon: 16x16px minimum
- Logo with text: 120px width minimum

### Clear Space
- Maintain padding equal to 25% of icon height around logo
- Don't crowd with other elements

### Don'ts
- Don't stretch or distort
- Don't rotate (except 90° increments if needed)
- Don't change colors outside approved palette
- Don't add effects (shadows, outlines, glows)
- Don't place on busy backgrounds

## Technical Specifications

### Export Settings
**PNG Icons:**
- Color mode: RGB
- Bit depth: 24-bit + alpha
- Compression: Optimize for web
- Background: Transparent

**SVG Logo:**
- Convert text to outlines
- Simplify paths
- Remove unused elements
- Optimize/minify file size
- viewBox attribute set correctly

### File Naming
- Lowercase
- Hyphens for spaces
- Descriptive sizes
- Examples: `icon-128.png`, `logo-dark.svg`

## Next Steps

1. **Design Phase**
   - Sketch initial concepts
   - Choose direction
   - Refine design
   - Create variations

2. **Export Phase**
   - Generate all required sizes
   - Test at actual sizes
   - Validate colors
   - Optimize files

3. **Implementation Phase**
   - Add files to project
   - Update HTML/manifests
   - Test in browsers
   - Verify on devices

---

**Quick Start Template:**

If you need a starting point, consider this concept:
- **Primary icon:** Stylized network graph or atlas globe
- **Colors:** Primary blue (#3B82F6) with subtle gradients
- **Shape:** Circle or rounded square
- **Style:** Minimalist, 2-3 colors max
- **Details:** Bold enough to read at 16px

Example prompt for AI image generation:
> "Modern minimalist app icon, network graph with connected nodes, primary blue #3B82F6, geometric style, professional, clean, scalable, flat design with subtle gradient"
