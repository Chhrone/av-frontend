# AureaVoice Frontend

A single-page application (SPA) built with Vite and vanilla JavaScript using the MVP (Model-View-Presenter) pattern and hash routing.

## Features

- **MVP Architecture**: Clean separation of concerns with Models, Views, and Presenters
- **Feature-Based Organization**: Code organized by features (intro, dashboard) with global components
- **Hash Routing**: Client-side routing using URL hash fragments
- **Style Components**: CSS-in-JS approach for consistent styling
- **Responsive Design**: Neutral, eye-friendly color scheme
- **Smooth Animations**: Entrance animations for better user experience

## Architecture

### Clean Feature-Based Structure
The application follows a clean, organized folder structure:

- **Features** (`src/features/`): Each major feature has its own folder containing all related MVP components
  - `intro/`: Welcome, test, and result pages
  - `dashboard/`: Dashboard functionality
- **Shared** (`src/shared/`): Components and utilities shared across multiple features
  - Global components like footer that appear on all pages
- **Global Resources** (`src/`): Core application resources
  - `utils/`: Utility functions and helpers
  - `assets/`: Reusable assets like icons
  - `styles/`: Global CSS styles
  - `config/`: Application configuration

### Import Strategy
- Features export their components through `index.js` files for clean imports
- Global utilities are imported directly from their respective folders
- Feature-specific styles are co-located with their features

## Project Structure

```
src/
├── assets/          # Reusable assets
│   └── MicrophoneIcon.js
├── config/          # Application configuration
│   └── AppConfig.js
├── features/        # Feature-based organization
│   ├── intro/       # Introduction flow (welcome, test, result)
│   │   ├── models/
│   │   │   └── IntroModel.js
│   │   ├── presenters/
│   │   │   ├── WelcomePresenter.js
│   │   │   ├── TestPresenter.js
│   │   │   └── ResultPresenter.js
│   │   ├── views/
│   │   │   ├── WelcomeView.js
│   │   │   ├── TestView.js
│   │   │   └── ResultView.js
│   │   ├── styles/  # Feature-specific styles (if needed)
│   │   └── index.js # Feature exports
│   ├── dashboard/   # Dashboard feature
│   │   ├── models/
│   │   │   └── DashboardModel.js
│   │   ├── presenters/
│   │   │   └── DashboardPresenter.js
│   │   ├── views/
│   │   │   └── DashboardView.js
│   │   ├── styles/
│   │   │   ├── dashboard-base.css
│   │   │   ├── dashboard-navigation.css
│   │   │   ├── dashboard-cards.css
│   │   │   ├── dashboard-chart.css
│   │   │   ├── dashboard-categories.css
│   │   │   └── index.css
│   │   └── index.js # Feature exports
│   └── index.js     # Main feature exports
├── shared/          # Components shared across features
│   ├── models/
│   │   └── FooterModel.js
│   ├── presenters/
│   │   └── FooterPresenter.js
│   ├── views/
│   │   └── FooterView.js
│   └── index.js     # Shared exports
├── styles/          # Global CSS modules
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   ├── transitions.css
│   ├── responsive.css
│   └── footer/
│       ├── footer-base.css
│       ├── footer-content.css
│       ├── footer-bottom.css
│       └── index.css
├── utils/           # Utility functions and helpers
│   ├── router.js
│   ├── AudioRecorder.js
│   ├── RecordingManager.js
│   ├── RecordingStorage.js
│   ├── ViewTransitionHelper.js
│   └── AccentDetectionService.js
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
- Automatically processes recording and navigates to results

### Result Page (`/result`)
- Displays US accent confidence percentage
- Shows descriptive feedback based on confidence level
- Includes "Try Again" button to return to welcome page
- Receives data from accent detection API

## Configuration

### AI Model Configuration
The application supports both real AI model and demo mode:

- **Use Real AI Model**: Set `USE_REAL_MODEL: true` in `src/config/AppConfig.js`
- **Use Demo Mode**: Set `USE_REAL_MODEL: false` for development/testing
- **Demo Settings**: Customize delay and confidence ranges in AppConfig

### API Configuration
- **Endpoint**: Configure API endpoint in AppConfig
- **Format**: API expects POST requests with .wav files
- **Response**: Should return `{ us_confidence: number }`

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
- **Result**: `http://localhost:5173/#/result`

## Styling Approach

This project uses a modular CSS approach with organized CSS files for different concerns. This provides:

- Clear separation of styling concerns
- Maintainable and organized CSS structure
- Efficient browser caching of individual CSS modules
- Easy maintenance and updates

## Technologies Used

- **Vite**: Fast build tool and development server
- **Vanilla JavaScript**: No framework dependencies
- **Modular CSS**: Organized CSS structure with separate modules
- **Google Fonts**: Inter font family for typography
- **SVG Icons**: Inline SVG microphone icon

## Browser Support

Modern browsers that support ES6 modules and CSS custom properties.
