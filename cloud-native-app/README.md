# EduCast - Cloud Native Application
## COM6681 Coursework 2

### Student Details
**Name:** MD Tazimul Hasan
**ID:** 10352967

### Project Overview
EduCast is a cloud-native social media platform built with Node.js and Express. It features user authentication, multimedia content sharing (Posts, PDFs), and a responsive UI. The application is fully integrated with **Azure Cloud Services**.

### Cloud Architecture
The application adheres to cloud-native principles by using:
1.  **Azure Cosmos DB (SQL API)**: Stores all structured data (Users, Profiles, Post Metadata).
    *   Database: `EduCastDB`
    *   Containers: `Users`, `Posts`
2.  **Azure Blob Storage**: Stores massive binary files (User Avatars, PDF Uploads).
    *   Container: `uploads` (Private access)

### Setup & Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Configuration:**
    Create a `.env` file in the root directory (already included in submission, but do not share publicly).
    ```ini
    PORT=3001
    COSMOS_CONNECTION_STRING=<Your_Cosmos_DB_Key>
    AZURE_STORAGE_CONNECTION_STRING=<Your_Storage_Account_Key>
    ```

3.  **Run the Application:**
    ```bash
    node server.js
    ```
    Access the app at: `http://localhost:3001`

### Key Features
*   **Sign Up / Login**: User authentication with secure session handling.
*   **Media Upload**: Upload images (Avatar) and documents (PDFs) directly to Azure Blob Storage.
*   **Feed**: View posts from all users, fetched dynamically from Cosmos DB.
*   **Admin Dashboard**: Manage content (Delete posts).
*   **Search**: Filter posts by username or content.

### File Structure
*   `/controllers`: Backend logic for Auth and Content.
*   `/routes`: API route definitions.
*   `/utils`: Database (`db.js`) and Storage (`blobStorage.js`) connection utilities.
*   `/public`: Frontend static files (HTML, CSS, JS).

---
*Developed for Module COM6681 - Cloud Native Development*
