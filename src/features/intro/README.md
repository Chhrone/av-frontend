# Intro Feature

## Overall

The Intro feature provides the initial user experience, guiding new users through a splash screen, a welcome message, and an initial accent evaluation test. This flow is designed to be engaging and to provide immediate feedback on the user's American English accent. The feature captures a baseline of the user's pronunciation, which helps in recommending specific practice areas.

## Models

### `IntroModel.js`

The `IntroModel` manages the state and content for the entire introductory flow.

- **Responsibilities**:
    - Stores and provides a random selection of text passages for the accent evaluation test.
    - Holds all UI text content, such as the welcome message and button labels, in a centralized place.
    - Contains the logic for generating descriptive feedback based on the user's accent confidence score.
    - Manages the current state of the intro flow (e.g., which page is active, whether recording is in progress).
    - Stores the result of the last accent test.

### `SplashModel.js`

The `SplashModel` is responsible for the content and behavior of the initial splash screen.

- **Responsibilities**:
    - Stores the application's brand name, tagline, and a brief description.
    - Defines the minimum display time for the splash screen to ensure a smooth and visually appealing loading experience.
    - Includes logic to determine whether the splash screen should be displayed.

## Presenters

### `SplashPresenter.js`

The `SplashPresenter` controls the splash screen's lifecycle and animations.

- **Responsibilities**:
    - Initializes and renders the `SplashView` with data from the `SplashModel`.
    - Manages the loading sequence, including a "jackpot" text animation effect.
    - Ensures the splash screen is displayed for a minimum duration before transitioning to the next screen.
    - Handles the fade-out animation and cleanup of the splash screen.
    - Manages the visibility of the footer, hiding it during the splash sequence and showing it afterward.

### `WelcomePresenter.js`

The `WelcomePresenter` manages the welcome screen, which prompts the user to start the accent test.

- **Responsibilities**:
    - Initializes and renders the `WelcomeView` with a welcome message from the `IntroModel`.
    - Handles the user's click on the microphone button.
    - Initiates the audio recording process via the `RecordingManager`.
    - Triggers a smooth view transition to the test screen once recording has started.

### `TestPresenter.js`

The `TestPresenter` orchestrates the accent evaluation test.

- **Responsibilities**:
    - Initializes and renders the `TestView` with a randomly selected text passage from the `IntroModel`.
    - Manages the recording process, including starting and stopping the recording timer and updating the UI accordingly.
    - Interacts with the `RecordingManager` to handle the technical aspects of audio recording.
    - Communicates with the `AccentDetectionService` to process the recorded audio and receive the analysis results.
    - Handles UI state changes (e.g., showing loading, recording, and processing states).
    - Implements cleanup logic to ensure that recording is stopped if the user navigates away from the page.

### `ResultPresenter.js`

The `ResultPresenter` is responsible for displaying the results of the accent test.

- **Responsibilities**:
    - Initializes and renders the `ResultView` with the accent analysis data.
    - Saves the user's initial accent score to `localStorage` for use in other parts of the application (like the dashboard).
    - Sets a token in `localStorage` to indicate that the user has completed the introductory flow.
    - Handles the user's click on the "Try Again" (or similar) button, which navigates them to the dashboard.

## Views

### `SplashView.js`

The `SplashView` renders the initial splash screen.

- **Responsibilities**:
    - Creates the HTML structure for the splash screen, including the brand name and tagline.
    - Implements a "jackpot" animation effect on the brand name for visual appeal.
    - Handles the fade-out animation when the splash screen is dismissed.

### `WelcomeView.js`

The `WelcomeView` displays the welcome message and the initial call to action.

- **Responsibilities**:
    - Renders the welcome text and a large microphone button.
    - Uses the View Transition API to ensure a smooth visual transition of the microphone button to the next screen.

### `TestView.js`

The `TestView` displays the text for the accent evaluation and the recording controls.

- **Responsibilities**:
    - Renders the text passage that the user needs to read.
    - Displays the microphone button, which changes its state to reflect the recording process (e.g., loading, recording, processing).
    - Shows a timer to indicate the duration of the recording.
    - Provides visual feedback to the user about the current state of the test.

### `ResultView.js`

The `ResultView` presents the user's accent analysis score and feedback.

- **Responsibilities**:
    - Renders the user's accent confidence score and a descriptive text that explains the score.
    - Displays a button that allows the user to proceed to the main application (dashboard).
    - Ensures that the result is displayed clearly and immediately without complex animations.

## Utils

The Intro feature relies on several global utilities:

- **`RecordingManager.js`**: Manages all aspects of audio recording, including starting, stopping, and saving recordings. It ensures that recording state is handled consistently.
- **`AccentDetectionService.js`**: A crucial service that takes a recorded audio file, sends it to a backend for analysis, and then navigates the user to the result page with the returned data.
- **`ViewTransitionHelper.js`**: A utility that simplifies the use of the browser's View Transition API, allowing for smooth and animated transitions between different views (e.g., from the welcome screen to the test screen).
- **`MicrophoneIcon.js`**: A reusable asset that provides the SVG for the microphone icon used across the intro views.
