# Practice Feature

## Overall

The Practice feature is the core component of the application where users can actively train their American English accent. It provides a structured environment for users to complete practice sessions, receive immediate feedback on their pronunciation, and track their progress through a series of recordings. The feature is designed to be iterative, allowing users to repeat exercises and see their scores improve over time.

## Models

### `PracticeTestModel.js`

The `PracticeTestModel` is responsible for managing the data related to the practice tests.

- **Responsibilities**:
    - Fetches practice text from the database (`aureaVoiceDB.js`) based on the selected category and practice item.
    - Provides a random practice sentence if a specific one isn't chosen.
    - Stores the last used practice text for continuity.
    - Saves recordings and their corresponding scores for a given practice session.

### `PracticeResultModel.js`

The `PracticeResultModel` handles the data for the practice result screen.

- **Responsibilities**:
    - Stores the accent analysis data received after a recording is processed.
    - Retrieves and stores the speech-to-text transcript from the recording service.
    - Provides motivational descriptions based on the user's score, offering encouragement and guidance.

## Presenters

### `PracticePresenter.js`

The `PracticePresenter` is the central controller for the entire practice flow, managing the interactions between the models, views, and services.

- **Responsibilities**:
    - Initializes the practice session by fetching the practice text and rendering the initial test view.
    - Manages the state of the practice session, including the number of recordings taken and the maximum number of sessions.
    - Handles user interactions, such as starting and stopping recordings.
    - Orchestrates the process of recording audio, sending it for analysis, and receiving the results.
    - Saves the results of each practice session to the database.
    - Transitions between the test view and the result view, passing the necessary data.
    - Manages the overall flow of a 4-session practice, calculating the average score at the end.

## Services

The practice feature is broken down into several services, each with a specific responsibility, following a service-oriented architecture.

### `PracticeRecordingService.js`

This service encapsulates the logic for handling audio recordings during a practice session.

- **Responsibilities**:
    - Manages the state of the recording (e.g., `isRecording`).
    - Starts and stops the recording timer and updates the UI with the elapsed time.
    - Retrieves the speech-to-text transcript from the `RecordingManager`.
    - Logs the start and end times of each recording session.

### `PracticeResultService.js`

This service is responsible for processing and interpreting the results of a practice session.

- **Responsibilities**:
    - Extracts the accent confidence score from the analysis result.
    - Provides a motivational description based on the score by interacting with the `PracticeResultModel`.
    - Calculates the average score from a series of practice sessions.

### `PracticeViewService.js`

This service manages the UI transitions and updates for the practice views.

- **Responsibilities**:
    - Handles the animated transitions between the test view and the result view.
    - Renders the appropriate view with the necessary data.
    - Binds and unbinds event listeners for UI elements as needed.

## Views

### `PracticeTestView.js`

The `PracticeTestView` is the UI for the active practice session where the user records their speech.

- **Responsibilities**:
    - Renders the practice text for the user to read.
    - Displays a progress bar indicating the current session number.
    - Provides a record button that changes its state to reflect whether it's recording, processing, or idle.
    - Shows a timer to display the duration of the current recording.

### `PracticeResultView.js`

The `PracticeResultView` displays the feedback after a user completes a recording.

- **Responsibilities**:
    - Renders the user's accent score for the recording.
    - Displays a motivational message based on the score.
    - Shows the speech-to-text transcript of the user's recording.
    - Provides a button to compare the original text with the transcript.
    - Includes buttons to either continue to the next session or return to the category page after the final session.

## Utils

The Practice feature relies on several global utilities:

- **`RecordingManager.js`**: The core utility for managing audio recording, used by the `PracticeRecordingService`.
- **`AccentDetectionService.js`**: Used to send recorded audio for analysis and get the accent score.
- **`aureaVoiceDB.js`**: The database interface for fetching practice texts and saving session results.
- **`appRouter.js`**: Used for navigation, for example, to return to the category page.
- **`MicrophoneIcon.js`**: A reusable UI component for the microphone icon.
