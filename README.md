# Book Directory API

This is a simple Node.js API for managing a book directory. It allows users to perform CRUD operations (Create, Read, Update, and Delete) using the built-in `http` module. The API handles JSON data exchange and supports the following HTTP methods: GET, POST, PUT, PATCH, and DELETE.

## Features
- Add a new book to the directory
- Retrieve a list of all books or a specific book by ID
- Update book details
- Partially update book details
- Delete a book from the directory

## Requirements
Each book entry should include the following fields:
- **Title** (string)
- **Author** (string)
- **Publisher** (string)
- **Published Date** (string, ISO format recommended)
- **ISBN** (string)

## Prerequisites
- [Node.js](https://nodejs.org/) installed on your system

## Installation
1. Clone this repository:
   ```bash
   https://github.com/AlsonAfrica/Node.js-Books-Directory.git
   ```
2. Navigate to the project directory:
   ```bash
   cd book-directory-api
   ```
3. Run the application:
   ```bash
   node server.js
   ```

## API Endpoints

### 1. Get All Books
**GET** `/books`
- Retrieves a list of all books in the directory.

### 2. Get a Specific Book
**GET** `/books/:id`
- Retrieves details of a specific book by its ID.

### 3. Add a New Book
**POST** `/books`
- Adds a new book to the directory.
- **Request Body** (JSON):
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "publisher": "Publisher Name",
    "publishedDate": "2023-01-01",
    "isbn": "1234567890"
  }
  ```

### 4. Update a Book
**PUT** `/books/:id`
- Updates the entire details of a book.
- **Request Body** (JSON):
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author",
    "publisher": "Updated Publisher",
    "publishedDate": "2023-01-01",
    "isbn": "0987654321"
  }
  ```

### 5. Partially Update a Book
**PATCH** `/books/:id`
- Updates specific fields of a book.
- **Request Body** (JSON):
  ```json
  {
    "title": "Partially Updated Title"
  }
  ```

### 6. Delete a Book
**DELETE** `/books/:id`
- Deletes a book from the directory by its ID.

## Implementation Details
- The API uses the built-in `http` module to manage requests and responses.
- JSON data is parsed and handled using `JSON.parse()` and `JSON.stringify()`.
- Data is stored in-memory (no database used for simplicity).

## Example Usage
1. Start the server:
   ```bash
   node server.js
   ```
2. Use tools like [Postman](https://www.postman.com/) or `curl` to interact with the API:
   - Example to add a book:
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"title":"Sample Book","author":"John Doe","publisher":"XYZ","publishedDate":"2023-01-01","isbn":"1234567890"}' http://localhost:3000/books
     ```
   - Example to retrieve all books:
     ```bash
     curl http://localhost:3000/books
     ```

## Notes
- This API is for demonstration purposes and uses in-memory data storage, which means all data will be lost when the server restarts.
- For production use, consider integrating a database like MongoDB or PostgreSQL.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

