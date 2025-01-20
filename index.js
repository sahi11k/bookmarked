const booksToRead = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(name, author, pages) {
  const book = new Book(name, author, pages, false);
  booksToRead.push(book);
}

function displayBooks() {}

addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180);
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281);
addBookToLibrary("1984", "George Orwell", 328);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 279);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 224);

console.log(booksToRead);
