# Utils

## Overall

The `utils` directory contains a collection of globally accessible helper modules and services that provide essential functionalities across the entire application. These utilities are designed to be reusable and to encapsulate specific concerns, suchs as routing, audio recording, and API interactions. This modular approach helps to keep the feature-specific code clean and focused on its primary responsibilities.

### `AccentDetectionService.js`

This service is responsible for interacting with the backend API to analyze a user's accent.

- **Purpose**: To take an audio recording, send it to the accent detection model, and return the confidence score.
- **How it works**: 
    - It can operate in two modes: `real` and `demo`. In `real` mode, it sends the audio blob to the production API endpoint. In `demo` mode, it returns a randomized mock score, allowing for frontend development without a live backend.
    - It includes a helper function, `processRecordingAndShowResult`, which orchestrates the process of analyzing a recording and navigating the user to the results page.

### `appEvents.js`

This module sets up global event listeners to handle application-wide concerns, particularly related to resource cleanup.

- **Purpose**: To ensure that critical resources, like audio recordings, are properly terminated when the user navigates away from the page or closes the tab.
- **How it works**: It adds event listeners for `beforeunload`, `pagehide`, and `visibilitychange` to call the `forceStop` method of the `RecordingManager`, preventing the microphone from remaining active in the background.

### `appHelpers.js`

This file contains a set of miscellaneous helper functions that are used throughout the application.

- **Purpose**: To provide simple, reusable functions for common tasks.
- **Key Functions**:
    - `categoryRouteMap`: A mapping from URL-friendly route names (kebab-case) to the internal category IDs used by the models.
    - `scrollToTop`: A simple utility to scroll the window to the top of the page.
    - `hasCompletedIntro` & `setCompletedIntro`: Functions to check and set a flag in `localStorage` to determine if the user has gone through the initial intro flow.

### `appRouter.js`

This is the main router for the application, handling all navigation that occurs after the initial intro flow.

- **Purpose**: To manage the application's routes, mapping URL paths to specific handler functions (e.g., rendering a view).
- **How it works**:
    - It supports both hash-based and pathname-based routing.
    - It allows for dynamic routes with parameters (e.g., `/category/:id`).
    - It provides methods for navigating programmatically (`navigate`), going back (`goBack`), and handling routing errors.
    - It is implemented as a singleton, ensuring that there is only one instance of the router throughout the application's lifecycle.

### `AudioRecorder.js`

This class provides a low-level interface for recording audio from the user's microphone.

- **Purpose**: To handle the complexities of accessing the microphone, recording audio, and converting it to a usable format (WAV).
- **How it works**:
    - It uses the `MediaDevices` API to get access to the user's microphone.
    - It leverages the `MediaRecorder` API to capture audio chunks.
    - It includes logic to convert the recorded audio into a WAV file, which is the required format for the accent detection API.
    - It also integrates the `SpeechRecognition` API to provide real-time speech-to-text transcription of the user's recording.

### `errorHandler.js`

This module provides a centralized function for displaying error messages to the user.

- **Purpose**: To offer a consistent way to show errors, whether they come from API calls, routing issues, or other parts of the application.
- **How it works**: The `showError` function takes an error message and a title, and it renders a simple error screen within the main application container, allowing the user to go back to the previous page.

### `introRouter.js`

This is a specialized router that handles the initial introductory flow of the application.

- **Purpose**: To manage the sequence of screens that a new user sees, from the splash screen to the welcome message, the accent test, and the result.
- **How it works**:
    - It is a hash-based router that is specifically designed for the intro sequence.
    - It includes logic to check if the user has already completed the intro, and if so, it redirects them to the main dashboard.
    - It uses the View Transition API to create smooth, animated transitions between the different intro screens.

### `RecordingManager.js`

This is a high-level service that manages the entire audio recording lifecycle, acting as a facade over the `AudioRecorder`.

- **Purpose**: To provide a simple and safe interface for starting, stopping, and managing audio recordings without needing to interact with the low-level `AudioRecorder` directly.
- **How it works**:
    - It maintains the state of the recording (e.g., `isRecording`, `isInitialized`).
    - It creates and destroys `AudioRecorder` instances as needed, ensuring that microphone resources are properly managed and cleaned up.
    - It provides an event-based system for notifying other parts of the application about recording state changes (e.g., `recordingStart`, `recordingStop`).
    - It includes a `forceStop` method to ensure that recordings are terminated in edge cases, such as when the user leaves the page.

### `routerSetup.js`

This module is responsible for initializing and configuring the application's routers.

- **Purpose**: To centralize the route definitions for both the main application and the intro flow.
- **How it works**: It provides two functions, `setupMainRoutes` and `setupIntroRoutes`, which are called during the application's startup process to add all the necessary routes to their respective routers.

### `routes.js`

This file defines all the route paths used in the application as constants.

- **Purpose**: To provide a single source of truth for all URL paths, making it easier to manage and update routes.
- **Key Exports**:
    - `ROUTES`: An object containing all the static route paths.
    - `generateRoute`: A helper function to create a URL path with parameters.
    - `getRouteParams`: A utility to extract parameters from a URL path.

### `ViewTransitionHelper.js`

This utility is a wrapper around the browser's View Transition API.

- **Purpose**: To simplify the creation of animated transitions between different views and to provide a fallback for browsers that do not support the API.
- **How it works**:
    - It checks for browser support for the View Transition API.
    - It provides a `createTransition` method that either uses the native `document.startViewTransition` or falls back to a simple callback execution.
    - It includes helper methods for setting and removing transition names on elements, which is a key part of how the View Transition API works.
