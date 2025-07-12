# Database

## Architecture

The application utilizes **IndexedDB**, a client-side database built into modern web browsers, to store persistent data. This choice of technology allows the application to function offline and to maintain user data across sessions without relying on a server-side database for core content.

The database, named `AureaVoiceDB`, is structured into three main object stores:

1.  **`categories`**: This store holds the primary information for each practice category, such as its ID and title.
2.  **`practices`**: This store contains the individual practice items. Each item is linked to a category and includes the specific sentences or words for the user to practice.
3.  **`practice_sessions`**: This store logs the results of each user's practice sessions, including the practice ID, category, average score, and the date of the session.

This architecture ensures a clear separation of data, making it easy to manage and query the information needed for different parts of the application.

## Data Operations

All interactions with the IndexedDB are handled by the `aureaVoiceDB.js` module, which provides a set of asynchronous functions for reading and writing data.

### Read Operations

-   **`getCategories()`**: Retrieves all practice categories from the `categories` store.
-   **`getPracticesByCategory(id_kategori)`**: Fetches all practice items for a specific category from the `practices` store using an index on the category ID.
-   **`getAllPracticeSessions()`**: Retrieves all saved practice session results, which is used by the dashboard to calculate user statistics.

### Write Operations

-   **`saveCategories(categories)`**: Saves an array of category objects to the `categories` store.
-   **`savePractices(practices)`**: Saves an array of practice items to the `practices` store.
-   **`savePracticeSession({ ... })`**: Adds a new record to the `practice_sessions` store, logging the details of a completed practice session.

## Integration with the Codebase

The database is primarily integrated through a seeding process and by the feature models that require persistent data.

### Seeding the Database

-   **`seedDB.js`**: This module is responsible for populating the database with initial data if it's empty. It checks if categories and practices exist, and if not, it uses `practiceDataSeed.js` to fill the database.
-   **`practiceDataSeed.js`**: This file contains the raw data for all the practice exercises, structured as an array of JavaScript objects. This data is used by `seedDB.js` to populate the `practices` store.

### Feature Integration

-   **`CategoryModel.js`**: This model interacts with the database to fetch the details of a specific practice category.
-   **`DashboardModel.js`**: This model heavily relies on the database to get all practice session data, which it then processes to generate the user's statistics and progress chart.
-   **`PracticePresenter.js`**: After a user completes a 4-session practice, the presenter calls `savePracticeSession` to log the average score and other relevant data to the database.

By centralizing all database operations in `aureaVoiceDB.js` and using a clear seeding mechanism, the application ensures consistent and reliable data management, allowing the feature components to remain focused on their specific logic without being tightly coupled to the database implementation.
