# LexPage - Modern Document Editor

LexPage is a powerful, web-based document editor built with Next.js, designed to provide a seamless and premium writing experience similar to Google Docs. It features a rich text editor, document management dashboard, and robust export capabilities.

## Features

-   **Rich Text Editing**: Full-featured editor with formatting options (bold, italic, lists, alignment, etc.).
-   **Document Management**: Create, rename, duplicate, and delete documents from a central dashboard.
-   **Page Setup**: Customize page margins (top, bottom, left, right) and orientation.
-   **Export Options**:
    -   **PDF**: High-quality PDF export with proper pagination and layout preservation.
    -   **DOCX**: Export documents to Microsoft Word format.
-   **Dark Mode**: Fully supported dark mode for a comfortable writing experience in low-light environments.
-   **Responsive Design**: Works beautifully on desktop and tablet devices.
-   **Local Storage**: Documents are automatically saved to your browser's local storage, ensuring your data is persistent.

## Installation & Usage

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd lexpage
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Project Structure

-   `src/app`: Next.js App Router pages and layouts.
-   `src/components`: Reusable UI components and editor-specific components.
-   `src/hooks`: Custom React hooks (e.g., `useDocuments` for state management).
-   `src/lib`: Utility functions.

## License

MIT
