# AureaVoice Frontend

A single-page application (SPA) built with Vite and vanilla JavaScript using the MVP (Model-View-Presenter) pattern and hash routing.

## Features

- **MVP Architecture**: Clean separation of concerns with Models, Views, and Presenters
- **Hash Routing**: Client-side routing using URL hash fragments
- **Style Components**: CSS-in-JS approach for consistent styling
- **Responsive Design**: Neutral, eye-friendly color scheme
- **Smooth Animations**: Entrance animations for better user experience

## Project Structure

```
src/
├── models/          # Data models and business logic
│   └── AppModel.js
├── views/           # UI components and rendering
│   ├── WelcomeView.js
│   └── TestView.js
├── presenters/      # Controllers that connect models and views
│   ├── WelcomePresenter.js
│   └── TestPresenter.js
├── utils/           # Utility functions and helpers
│   └── router.js
├── styles/          # Style components and base styles
│   └── base.js
├── assets/          # Static assets
│   └── microphone.svg
└── main.js          # Application entry point
```

## Pages

### Welcome Page (`/`)
- Displays the main question: "Wanna test how good your speaking skill is?"
- Features a microphone button that navigates to the test page
- Includes smooth entrance animations

### Test Page (`/test`)
- Shows the test text for reading practice
- Features a floating microphone button for recording
- Text is optimized for readability with 1200px+ width

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173/`

## Navigation

- **Home**: `http://localhost:5173/#/` or `http://localhost:5173/`
- **Test**: `http://localhost:5173/#/test`

## Styling Approach

This project uses a "style components" approach where styles are defined as JavaScript objects and applied programmatically. This provides:

- Type safety and IDE support
- Dynamic styling capabilities
- Consistent design system
- Easy maintenance and updates

## Technologies Used

- **Vite**: Fast build tool and development server
- **Vanilla JavaScript**: No framework dependencies
- **CSS-in-JS**: Style components approach
- **Google Fonts**: Inter font family for typography
- **SVG Icons**: Custom microphone icon

## Browser Support

Modern browsers that support ES6 modules and CSS custom properties.
