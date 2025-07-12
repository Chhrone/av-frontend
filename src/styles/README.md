# Styles

## Overall

The `styles` directory contains the global CSS files that define the visual appearance of the application. The styling is organized into separate files based on their concern, such as colors, layout, and animations. This modular approach makes the CSS easier to manage and maintain.

The application uses a custom color palette defined in `color-global.css` and a modern, clean design aesthetic with a focus on user experience. The styles are designed to be responsive, ensuring that the application looks great on a variety of devices, from mobile phones to desktop monitors.

### `animations.css`

This file contains all the keyframe animations used throughout the application.

- **Purpose**: To define reusable animations for loading indicators, recording states, and other dynamic UI elements.
- **Key Animations**:
    - `recording-pulse`: A pulsing animation used to indicate that a recording is in progress.
    - `loading-spin`: A simple spinning animation for loading states.

### `base.css`

This file sets up the base styles for the entire application.

- **Purpose**: To establish a consistent foundation for the typography, background colors, and other global styles.
- **How it works**:
    - It imports the `Inter` font from Google Fonts, which is used as the primary font for the application.
    - It includes a CSS reset to ensure consistent rendering across different browsers.
    - It defines the default styles for the `body` element, including the background color and text color.
    - It also includes custom scrollbar styles to match the application's theme.

### `color-global.css`

This file defines the global color palette for the application using CSS custom properties (variables).

- **Purpose**: To provide a single source of truth for all colors used in the application, making it easy to maintain a consistent color scheme.
- **How it works**: It defines a set of CSS variables for primary, secondary, background, text, and other colors. These variables are then used throughout the other CSS files.

### `components.css`

This file is intended to hold styles for global, non-feature-specific components. In the current structure, it is largely empty as most component styles are defined within their respective feature's CSS files.

### `footer.css`

This file contains all the styles for the application's shared footer component.

- **Purpose**: To define the layout, typography, and responsive behavior of the footer.
- **How it works**: It uses a combination of Flexbox and CSS Grid to create a responsive layout that adapts to different screen sizes. It also includes styles for the footer's text, links, and decorative background text.

### `layout.css`

This file is intended for global layout styles that are not specific to any feature. Similar to `components.css`, it is currently minimal as most layout styles are handled within the feature-specific CSS.

### `responsive.css`

This file is intended for global responsive styles. It is currently minimal, with most responsive design handled within the CSS files for each feature and the shared components.

### `transitions.css`

This file manages the application's view transitions.

- **Purpose**: To provide smooth, animated transitions between different views, enhancing the user experience.
- **How it works**:
    - It enables the browser's native View Transition API for seamless SPA (Single Page Application) navigation.
    - It provides a simple fade-in animation as a fallback for browsers that do not support the View Transition API, ensuring a consistent, albeit simpler, experience for all users.
