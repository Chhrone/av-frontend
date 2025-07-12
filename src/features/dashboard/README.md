# Dashboard Feature

## Overall

The Dashboard feature serves as the main hub for users after they log in. It provides a comprehensive overview of their progress, including key statistics, a chart visualizing their accent score improvement over time, and quick access to practice categories. The dashboard is designed to motivate users by highlighting their achievements and offering clear, actionable recommendations for further practice.

## Models

### `DashboardModel.js`

The `DashboardModel` is responsible for managing all data related to the user's dashboard.

- **Responsibilities**:
    - Fetches and processes user statistics from IndexedDB, such as total practice sessions, session duration, and accent scores.
    - Calculates derived stats like the number of exercises completed today, total training time, and categories that need more practice.
    - Retrieves and formats progress data for the accent score chart, showing a week-by-week comparison.
    - Computes the user's score improvement from the previous week to the current one.
    - Provides mock data as a fallback if no real data is available, ensuring the dashboard remains functional for new users.
    - Offers recommendations for practice based on the user's current stats.

## Presenters

### `DashboardPresenter.js`

The `DashboardPresenter` acts as the intermediary between the `DashboardModel` and the `DashboardView`.

- **Responsibilities**:
    - Initializes the dashboard by fetching all necessary data from the model (user stats, progress data, etc.).
    - Renders the main dashboard view and injects the dynamic data into it.
    - Initializes and manages the lifecycle of the progress chart (using Chart.js), feeding it data from the model.
    - Handles user interactions, such as clicking the "Start Training" button or selecting a practice category, and navigates the user to the appropriate page.
    - Manages the lifecycle of the navbar and footer presenters, ensuring they are correctly displayed within the dashboard layout.
    - Cleans up resources, such as destroying the chart instance and removing event listeners, when the dashboard is no longer active.

## Views

### `DashboardView.js`

The `DashboardView` is responsible for rendering the entire dashboard UI.

- **Responsibilities**:
    - Creates the HTML structure for the dashboard, including the main layout, header, statistics cards, progress chart canvas, and category selection grid.
    - Provides methods to dynamically update the UI with data, such as populating the user's accent score, completed exercises, and other stats.
    - Binds event listeners for all interactive elements on the page (e.g., buttons, links) and delegates the handling of these events to the presenter.
    - Manages the mounting and unmounting of the view from the DOM, ensuring a clean and efficient lifecycle.
    - Dynamically loads and mounts the footer component.

## Utils

The Dashboard feature does not have its own dedicated `utils` folder but relies on global utilities for core functionalities:

- **`aureaVoiceDB.js`**: Used to fetch all practice session data from IndexedDB, which is then processed by the `DashboardModel` to generate user statistics and progress charts.
- **`appRouter.js`**: Used by the `DashboardPresenter` to handle navigation when a user clicks on a practice category or the "Start Training" button.
- **Shared Presenters (`NavbarPresenter`, `FooterPresenter`)**: The `DashboardPresenter` initializes and manages the shared navbar and footer, ensuring a consistent look and feel across the application.
