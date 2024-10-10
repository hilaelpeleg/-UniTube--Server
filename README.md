![unitube logo](<assets/unitube logo for README.png>)

# UniTube Backend Server 🎬

## Overview
This project provides the backend server for the UniTube application, a web-based video sharing platform similar to YouTube. The server is built using Node.js and Express, with MongoDB for database management and Multer for handling file uploads. It manages key functionalities such as user registration, video uploads, and commenting, ensuring secure and efficient data handling and storage.

## Technologies Used
- **Node.js**: Server-side runtime environment for building scalable network applications.
- **Express.js**: Web framework for building API routes and handling HTTP requests.
- **MongoDB**: NoSQL database for storing and retrieving user data, videos, and comments.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Multer**: Middleware for handling file uploads (profile images, video files).
- **JWT (JSON Web Tokens)**: Used for authentication and protecting routes.

## Features
- **User Authentication**: Users can register and log in. JWT is used for secure authentication.
- **Profile Management**: Users can upload profile pictures, update their details, and manage their accounts.
- **Video Management**: Users can upload, edit, and delete videos, as well as view video details and other related metadata.
- **Comments**: Users can comment on videos, edit or delete their comments, and view others’ comments.
- **File Uploads**: Users can upload profile pictures and video files, which are handled by Multer and stored on the server.
- **Update & Delete**: Users can update or delete their profiles, videos, and comments, ensuring full control over their content.


## Installation and Setup

### Prerequisites
Before running the server, ensure you have the following installed:
- **Node.js** (v12 or higher)
- **MongoDB** (local or cloud instance, such as MongoDB Atlas)

### Installation
1. Clone the repository:
    ```bash
    git clone https://https://github.com/hilaelpeleg/-UniTube--Server.git
    ```

2. Navigate into the project directory:
    ```bash
    cd -UniTube--Server
    ```

3. Install all dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory with the following variables:
    ```env
    MONGO_URI=your_mongodb_uri
    PORT=your_preferred_port
    JWT_SECRET=your_jwt_secret
    ```

### Running the Server
Once you have set up your environment variables, you can start the server with:
```bash
npm start
```

By default, the server will be accessible at `http://localhost:your_port`.

## Default Data
When the server is first run, it populates the MongoDB database with default users, videos, and comments. These default records are useful for initial testing and allow the UniTube app to be demonstrated with existing content. The default data is inserted via a script and includes:

- **Sample Users**: Pre-defined user accounts for testing login and profile management.
- **Sample Videos**: Videos with metadata (title, description, uploader details) stored in MongoDB, with the actual files stored on the server.
- **Sample Comments**: Pre-existing comments on the sample videos, associated with specific users, to simulate interaction and engagement on the platform.


## Project Architecture
The server follows the MVC (Model-View-Controller) architecture to ensure modular and scalable development:

### Models
- **User**: Stores user information like first and last name, username, profile picture, and password.
- **Video**: Stores video information such as title, description, file path, and associated username.
- **Comment**: Manages comments for each video, storing the user who made the comment and the comment text.

### Controllers
Handle incoming HTTP requests, process the data, and return responses to the client. These contain the business logic for operations such as creating a user, uploading a video, or adding a comment and more features as update and delete.

### Services
The service layer handles the business logic and data manipulation, interacting with MongoDB via Mongoose.

### Routes
Defines the API endpoints that the client app interacts with. Routes are divided into:
- `/api/users`: For user registration, login, fetching user profile details, updating profile (with profile picture), and deleting user accounts.
                Users can also upload and manage their videos via this route (create, edit, delete videos).
- `/api/videos`: For fetching all videos, managing individual videos (including uploading, editing, and deleting videos), and updating video metadata such as likes, dislikes, and views.
- `/api/comments`: For managing comments on videos. Users can add, edit, and delete comments on specific videos.

## File Upload Handling with Multer
Multer is used to manage file uploads, including:
- **Profile Pictures**: Users can upload or update their profile pictures. These images are stored locally on the server, and their file paths are saved in MongoDB for later retrieval.
- **Videos**: When users upload video files, they are also stored on the server, and the metadata is saved in MongoDB for efficient querying and access.

### Storage
Uploaded files are stored on the server in designated directories:
- **Profile Pictures**: Stored in `/uploads/profile_pictures`.
- **Videos**: Stored in `/uploads/videos`.
The file paths for these uploaded files are then stored in the database to be referenced when displaying user profiles or videos within the app.


## Additional Packages
The following key packages are used in the project:

- **Express**: Web framework for Node.js.
- **Mongoose**: ODM for MongoDB interactions.
- **Multer**: Middleware for handling file uploads.
- **custom-env**: Used to load environment variables based on the current environment (e.g., local, production).
- **CORS**: Enables Cross-Origin Resource Sharing.
- **body-parser**: Parses incoming request bodies.

Make sure to install the necessary dependencies for the project, which you can do all at once using the command:
```bash
 npm install express mongoose multer cors body-parser custom-env.
 ```
 

## License
This project is licensed under the MIT License. See the LICENSE file for more details.