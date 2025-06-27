# CSS Organization Structure

This document describes the organized CSS structure for the AureaVoice frontend application.

## File Structure

```
src/
├── style.css          # Main entry point - imports all CSS modules
└── styles/
    ├── base.css           # Core reset and typography
    ├── layout.css         # Container and positioning styles
    ├── components.css     # Buttons, microphone, and UI elements
    ├── animations.css     # Keyframes and animation utilities
    ├── transitions.css    # Page transitions and view transitions
    ├── responsive.css     # Media queries for different screen sizes
    └── README.md          # This documentation file
```

## Import Order

The CSS files are imported in a specific order to ensure proper cascading:

1. **base.css** - Reset and core styles (must be first)
2. **layout.css** - Container and positioning
3. **components.css** - Buttons and UI elements
4. **animations.css** - General purpose animations
5. **transitions.css** - Page transitions and view transitions
6. **responsive.css** - Media queries (should be last)

## File Contents

### base.css
- CSS reset (`*, *::before, *::after`)
- Body typography and background
- App container base styles

### layout.css
- Container layouts and positioning
- Welcome and test page text styles
- Back button and demo link positioning

### components.css
- Microphone button styles (both center and floating)
- Recording states (recording, loading)
- General button styles (.btn, .btn-outline)
- Recording duration display
- Recording complete message
- Microphone icon styles

### animations.css
- Animation utility classes (.fade-in, .fade-out, .slide-up, .slide-down)
- Recording pulse animation
- Loading spin animation
- Basic fade and slide keyframes
- Fade in up animation for completion message

### transitions.css
- View Transition API configuration
- Page transition animations
- Microphone morphing transitions
- Specific transition keyframes for welcome/test pages

### responsive.css
- Media queries for tablet (768px and below)
- Media queries for mobile (480px and below)
- Responsive typography and spacing adjustments

## Usage

To use the organized CSS structure, simply import the main style.css file in your HTML:

```html
<link rel="stylesheet" href="/src/style.css">
```

The style.css file will automatically import all other CSS files in the correct order.

## Benefits

1. **Logical Organization**: Each file has a clear, specific purpose
2. **Maintainability**: Easy to find and modify specific styles
3. **Modularity**: Can easily add/remove specific style modules
4. **Performance**: Browser can cache individual files efficiently
5. **Collaboration**: Multiple developers can work on different style aspects
6. **Debugging**: Easier to identify which file contains specific styles

## Guidelines

- Keep base.css minimal - only reset and core typography
- Put layout-related styles in layout.css
- Component-specific styles go in components.css
- All keyframe animations belong in animations.css
- Page transitions stay in transitions.css
- Media queries should be in responsive.css and loaded last
