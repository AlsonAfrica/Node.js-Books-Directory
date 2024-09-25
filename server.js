const fs = require("fs");
const path = require("path");
const http = require('http');

// Define the directory and file paths
const dirPath = path.join(__dirname, "Book Directory");
const filePath = path.join(dirPath, "Book-List.js");

// Function to auto-generate an ISBN number
function generateISBN() {
  const prefix = "978";
  const randomPart = Math.floor(Math.random() * 1000000000000).toString().padStart(10, '0');
  const isbn = `${prefix}-${randomPart}`;
  return isbn;
}

// Sample book data
const bookObject = [{
  "Book-Title": "Critical Thinking For Lazy Developers",
  Author: "Alson NR",
  Publisher: "Central Journals",
  "Published-Date": "2024",
  ISBN: "978-3-16-148410-0"
}, {
  "Book-Title": "How To Thrive",
  Author: "Alson NR",
  Publisher: "Central Journals",
  "Published-Date": "2019",
  ISBN: generateISBN()
}];

// Stringify the object for writing to the file
const bookData = JSON.stringify(bookObject, null, 2);

// Create a directory and write book data to a file
fs.mkdir(dirPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Book Directory created successfully!");

  fs.writeFile(filePath, bookData, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("file created successfully");
  });
});

// Helper function to read books from the file
function readBooks(callback) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return callback([]);
    }
    const books = JSON.parse(data || '[]');
    callback(books);
  });
}

// Helper function to write books to the file
function writeBooks(books, callback) {
  fs.writeFile(filePath, JSON.stringify(books, null, 2), callback);
}

// HTTP server to manage books
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Handle GET request for retrieving all books or a specific book by ISBN
  if (method === 'GET') {
    if (url === '/books') {
      readBooks((books) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books));
      });
    } else if (url.startsWith('/books/')) {
      const isbn = url.split('/')[2];
      readBooks((books) => {
        const book = books.find((b) => b.ISBN === isbn);
        if (book) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(book));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Book not found' }));
        }
      });
    }
  }

  // Handle POST request for adding a new book
  else if (method === 'POST' && url === '/books') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newBook = JSON.parse(body);

      // Generate ISBN if not provided
      if (!newBook.ISBN) {
        newBook.ISBN = generateISBN();
      }

      readBooks((books) => {
        books.push(newBook);
        writeBooks(books, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to save book' }));
          } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook));
          }
        });
      });
    });
  }

  // Handle PUT/PATCH request for updating an existing book by ISBN
  else if ((method === 'PUT' || method === 'PATCH') && url.startsWith('/books/')) {
    const isbn = url.split('/')[2];
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedBook = JSON.parse(body);

      readBooks((books) => {
        const bookIndex = books.findIndex((b) => b.ISBN === isbn);
        if (bookIndex !== -1) {
          books[bookIndex] = { ...books[bookIndex], ...updatedBook };
          writeBooks(books, (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Failed to update book' }));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(books[bookIndex]));
            }
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Book not found' }));
        }
      });
    });
  }

  // Handle DELETE request for removing a book by ISBN
  else if (method === 'DELETE' && url.startsWith('/books/')) {
    const isbn = url.split('/')[2];

    readBooks((books) => {
      const updatedBooks = books.filter((b) => b.ISBN !== isbn);
      if (updatedBooks.length !== books.length) {
        writeBooks(updatedBooks, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to delete book' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Book deleted successfully' }));
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Book not found' }));
      }
    });
  }

  // Handle unknown routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



