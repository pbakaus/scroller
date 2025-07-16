# Development Guide

Simple, unified development workflow for the Scroller library.

## Quick Start

### Development Mode (Hot Reloading)
```bash
npm run dev
```
- Starts Vite dev server on `http://localhost:3000`
- Demo pages default to loading from `src/` with hot reloading
- Changes to source files automatically reload the browser

### Production Build
```bash
npm run build
```
- Builds library bundles to `dist/`
- Copies demo pages to `dist/demo/` with script tags updated to use built bundles

## How It Works

### Simple Script Loading
Demo pages use a simple ES module script by default:

```html
<!-- Load from source files (dev mode) -->
<script type="module">
    import { EasyScroller } from '../src/EasyScroller.js';
    window.EasyScroller = EasyScroller;
</script>
```

During build, this gets replaced with:
```html
<!-- Load from built bundle (production) -->
<script src="../scroller-full.umd.js"></script>
```

### File Structure
```
demo/
├── easyscroller.html    # Default: loads from src/
├── dom.html            # Default: loads from src/
└── ...                 # All demos default to dev mode

dist/
├── scroller-full.umd.js # Built bundle
└── demo/               # Production demo copies
    ├── easyscroller.html # Uses built bundle
    └── ...              # All demos use built bundle
```

## Development Workflow

1. **Start development**: `npm run dev`
2. **Edit source files**: Changes auto-reload
3. **Test production build**: `npm run build`
4. **View production demos**: Open `dist/demo/*.html`

## Scripts

- `npm run dev` - Start dev server with hot reloading
- `npm run build` - Build library + copy demos to dist/demo/
- `npm run build:lib` - Build library bundles only  
- `npm run build:demos` - Copy demos to dist/demo/ with updated script tags
- `npm run build:watch` - Watch mode for library builds

## Benefits

✅ **Simple by default** - No complex detection logic  
✅ **Dev mode first** - Demos default to loading from source  
✅ **Hot reloading** - Instant feedback during development  
✅ **Clean production builds** - Script replacement creates static demos  
✅ **No duplication** - Single set of demo files 