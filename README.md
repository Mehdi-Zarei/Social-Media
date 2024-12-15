### Social-Media 💻📱🎶🔊 

Social-Media is a social networking project similar to Instagram, allowing users to register, post content, follow/unfollow others, save posts, like/dislike posts, and more.

## 🛠 Technologies Used

This project is built with the following technologies:

- **Node.js**: For server-side application development.
- **Express.js**: For handling routes and HTTP requests.
- **MongoDB**: As the NoSQL database.
- **JWT Authentication**: For user authentication and security.

## 🚀 Features

- **User Registration & Login**: Users can register, log in, and verify their accounts.
- **Post Creation**: Users can create posts with images, videos, and text descriptions.
- **Follow/Unfollow**: Users can follow and unfollow other users.
- **Like/Dislike**: Users can like or dislike posts.
- **Save Posts**: Users can save posts for easy access.
- **API Documentation**: API documentation is available via Swagger.

## ⚙️ Installation

Follow these steps to install and set up the project:

### 1. Clone the Repository

First, clone the project from GitHub:

```bash

git clone https://github.com/Mehdi-Zarei/Social-Media.git
```

### 2. Install Dependencies

After cloning the project, navigate to the project directory and install the dependencies using npm:

```bash
cd Social-Media
npm install
```

### 3. Run the Project

To run the project, use the following command:

```bash
 npm start
```

The project will be available at http://localhost:4000.

### Project Structure

The project is modular and organized into different folders for better maintainability. Some important directories and files include:

controllers: Controllers for handling each part of the application (like user management, posts, likes, etc.)

models: Models for interacting with the database (like User, Post, Like models, etc.)

routes: API routes for various endpoints.

middlewares: Middlewares for handling authentication and validation.

uploads: Uploaded files (post media, profile pictures, etc.).

### Authentication

The API uses JWT (JSON Web Token) for authentication. Every API request that requires authentication must include a valid JWT token in the Authorization header.

### API Documentation

## Introduction

This API allows users to interact with the Social-Media platform. Users can register, log in, create posts, like or dislike posts, save posts, and more. The API also provides various endpoints for user authentication and profile management.

http://localhost:4000/api-doc

### How to Use the API

The project includes several endpoints for performing various actions. Below are some of the actions and their corresponding endpoints:

### Endpoints:

## User Registration

URL: /users/register

Method: POST

Description: Registers a new user.

Body:

name: User's full name.

userName: Unique username.

email: User's email address.

password: User's password.

Response:

201: User successfully registered.

400: Missing or invalid data.

### User Login

URL: /users/login

Method: POST

Description: Logs a user in and returns a JWT token.

Body:

email: User's email.

password: User's password.

Response:

200: Successfully logged in, returns JWT token.

401: Invalid credentials.

### Create a Post

URL: /posts/

Method: POST

Description: Creates a new post.

Body:

media: Media file (image or video).

description: Text description for the post.

hashtags: List of hashtags (optional).

Response:

201: Post created successfully.

400: Invalid data.

401: Unauthorized.

### Like or Dislike a Post

URL: /posts/:postID/reaction

Method: POST

Description: Likes or dislikes a post.

Response:

200: Post liked or disliked successfully.

400: Invalid post ID or already liked/disliked.

401: Unauthorized.

### Save or Unsave a Post

URL: /posts/:postID/updatePostSaveStatus

Method: POST

Description: Saves or unsaves a post.

Response:

200: Post saved or unsaved successfully.

400: Invalid post ID.

401: Unauthorized.

### Get Saved Posts

URL: /posts/saves

Method: GET

Description: Retrieves all posts saved by the user.

Response:

200: Successfully fetched saved posts.

404: No saved posts found.

401: Unauthorized.

### Remove a Post

URL: /posts/:postID/remove

Method: DELETE

Description: Removes a post.

Response:

200: Post removed successfully.

400: Invalid post ID.

401: Unauthorized.

For detailed API information and request/response formats, please refer to the Swagger documentation.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/)
License.
