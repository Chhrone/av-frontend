# Assets Folder

This folder contains reusable asset components and resources used throughout the AureaVoice application.

## Components

### MicrophoneIcon.js

A reusable SVG microphone icon component that provides consistent microphone icons across the application.

#### Usage

```javascript
import MicrophoneIcon from '../assets/MicrophoneIcon.js';

// Method 1: Set innerHTML of existing element
const button = document.createElement('button');
MicrophoneIcon.setInnerHTML(button, { className: 'microphone-icon' });

// Method 2: Create SVG element
const svgElement = MicrophoneIcon.createElement({ className: 'custom-icon' });

// Method 3: Insert into container
const container = document.getElementById('icon-container');
MicrophoneIcon.insertInto(container, { className: 'microphone-icon' });

// Method 4: Get SVG string
const svgString = MicrophoneIcon.getSVG({ 
  className: 'microphone-icon',
  fill: 'currentColor',
  viewBox: '0 0 24 24'
});
```

#### Options

- `className`: CSS class to apply to the SVG (default: 'microphone-icon')
- `fill`: Fill color for the SVG (default: 'currentColor')
- `viewBox`: ViewBox attribute (default: '0 0 24 24')

#### Benefits

- **Consistency**: Single source of truth for microphone icon
- **Maintainability**: Easy to update icon across entire app
- **Flexibility**: Multiple usage patterns for different scenarios
- **Performance**: Reusable component reduces code duplication

## File Structure

```
src/assets/
├── MicrophoneIcon.js    # Reusable microphone SVG component
└── README.md           # This documentation file
```

## Adding New Assets

When adding new reusable assets:

1. Create a new component file in this folder
2. Follow the same pattern as MicrophoneIcon.js
3. Export as default class with static methods
4. Update this README with usage examples
5. Import and use in relevant view files
