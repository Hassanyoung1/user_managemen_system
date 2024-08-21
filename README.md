# User Management API Documentation

## Description
This User Management API provides a robust set of endpoints for managing user data in a MongoDB database. It offers functionality for creating, retrieving, updating, and deleting user records. The API is built using Express.js and follows RESTful principles, making it easy to integrate with various front-end applications or other services.

### Key Features Include:
- **User creation** with name, username, and password.
- **Flexible user retrieval** by ID, name, or all users.
- **User name updates** to modify existing user records.
- **User deletion** by ID or name.
- **Application status and statistics endpoints** for monitoring the application.
- **Comprehensive error handling** to provide meaningful feedback for failed requests.

This API is designed to be scalable and can serve as a foundation for more complex user management systems. It includes unit tests to ensure reliability and maintainability.

## Base URL
```
http://localhost:<PORT>
```

## Authentication
This API currently does not implement authentication. All endpoints are publicly accessible.

## Error Handling
All errors are returned in the following format:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Endpoints

### Application Status

#### Get Status
- **URL:** `/status`
- **Method:** `GET`
- **Description:** Check the status of the application.
- **Response:** Returns the current status of the application.

#### Get Stats
- **URL:** `/stats`
- **Method:** `GET`
- **Description:** Retrieve application statistics.
- **Response:** Returns statistics about the application.

### User Management

#### Create User
- **URL:** `/user/create`
- **Method:** `POST`
- **Description:** Create a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "id": "user_id",
      "name": "John Doe",
      "username": "johndoe"
    }
    ```
- **Error Responses:**
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "Name is missing"}`
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "username is missing"}`
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "password is missing"}`
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "user already exist"}`
  - **Code:** `500 Internal Server Error`
    - **Content:** `{"success": false, "message": "Failed to create user"}`

#### Retrieve User(s)
- **URL:** `/user/retrieve/:id?`
- **Method:** `GET`
- **Description:** Retrieve user(s) by ID, name, or all users.
- **URL Parameters:**
  - `id` (optional): User ID
- **Query Parameters:**
  - `name` (optional): User name
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    [
      {
        "id": "user_id",
        "name": "John Doe",
        "username": "johndoe"
      }
    ]
    ```
- **Error Responses:**
  - **Code:** `404 Not Found`
    - **Content:** `{"success": false, "message": "User not found"}`
  - **Code:** `500 Internal Server Error`
    - **Content:** `{"success": false, "message": "Database error"}`

#### Update User
- **URL:** `/user/update/:id?`
- **Method:** `PUT`
- **Description:** Update a user's name.
- **URL Parameters:**
  - `id` (optional): User ID
- **Query Parameters:**
  - `oldName` (optional): Current user name
- **Request Body:**
  ```json
  {
    "newName": "Jane Doe"
  }
  ```
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "id": "user_id",
      "name": "Jane Doe",
      "username": "johndoe"
    }
    ```
- **Error Responses:**
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "oldName query and newName json are missing"}`
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "id and newName json are missing"}`
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "oldName and newName are the same"}`
  - **Code:** `404 Not Found`
    - **Content:** `{"success": false, "message": "User not found"}`
  - **Code:** `500 Internal Server Error`
    - **Content:** `{"success": false, "message": "Database error"}`

#### Delete User
- **URL:** `/user/delete/:id?`
- **Method:** `DELETE`
- **Description:** Delete a user by ID or name.
- **URL Parameters:**
  - `id` (optional): User ID
- **Query Parameters:**
  - `name` (optional): User name
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `"user deleted"`
- **Error Responses:**
  - **Code:** `400 Bad Request`
    - **Content:** `{"success": false, "message": "name or id query is missing"}`
  - **Code:** `500 Internal Server Error`
    - **Content:** `{"success": false, "message": "Database error"}`

## Database
The API uses MongoDB as its database, with the connection established using Mongoose.

## Testing
Unit tests are provided for the UserController using Jest. The tests cover various scenarios for creating, retrieving, updating, and deleting users.