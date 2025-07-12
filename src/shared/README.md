# Shared Components

## Overall

The `shared` directory contains reusable UI components that are used across multiple features of the application. These components, such as the navbar and footer, have their own MVP (Model-View-Presenter) structure, ensuring they are self-contained and easy to maintain. This approach promotes code reuse and a consistent user experience throughout the application.

## Models

### `NavbarModel.js`

The `NavbarModel` is responsible for managing the data and state for the application's navigation bar.

- **Responsibilities**:
    - Stores the application's brand name.
    - Defines the navigation links that should be displayed in the navbar, including their text and destination URLs.
    - Provides the brand name split into two parts (`Aurea` and `Voice`) for styling purposes.

### `FooterModel.js`

The `FooterModel` manages the content and data for the application's footer.

- **Responsibilities**:
    - Stores the application's brand name and a brief description.
    - Defines the various link sections in the footer, such as internal links, community links, and resources.
    - Generates the copyright text, automatically updating the year.
    - Stores a background text element (`AUREAVOICE`) that is used for decorative styling in the footer.

## Presenters

### `NavbarPresenter.js`

The `NavbarPresenter` acts as the controller for the navigation bar.

- **Responsibilities**:
    - Initializes the `NavbarView` with data from the `NavbarModel`.
    - Manages the lifecycle of the navbar, including mounting and unmounting it from the DOM.
    - Ensures that the navbar is rendered correctly and that its data is up-to-date.

### `FooterPresenter.js`

The `FooterPresenter` is the controller for the application's footer.

- **Responsibilities**:
    - Initializes the `FooterView` with data from the `FooterModel`.
    - Manages the mounting and unmounting of the footer.
    - Provides methods to update the footer's content dynamically, such as changing the brand name or description.

## Views

### `NavbarView.js`

The `NavbarView` is responsible for rendering the HTML for the navigation bar.

- **Responsibilities**:
    - Creates the HTML structure for the navbar, including the logo and navigation buttons.
    - Binds a scroll event listener to the window to add a `scrolled` class to the navbar when the user scrolls down, allowing for dynamic styling (e.g., a transparent-to-solid background transition).
    - Handles clicks on the navigation links, delegating the navigation action to the browser's default behavior for route changes.

### `FooterView.js`

The `FooterView` renders the HTML for the application's footer.

- **Responsibilities**:
    - Creates the complete HTML structure for the footer, including the brand information, link columns, and copyright notice.
    - Provides methods to update specific parts of the footer's content, such as the brand name or description, without needing to re-render the entire component.
