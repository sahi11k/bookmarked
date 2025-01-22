(() => {
  const booksToRead = [];
  const $bookList = document.getElementById("book-list");

  function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }

  function addBookToLibrary(name, author, pages) {
    const book = new Book(name, author, pages, false);
    booksToRead.push(book);
  }

  function displayBooks() {
    booksToRead.forEach((book, i) => {
      const bookCard = createBookCard(book, i);
      $bookList.appendChild(bookCard);
    });
  }

  function createBookCard(book, index) {
    const card = document.createElement("div");
    const cardId = `book-${index}`;
    card.id = cardId;
    card.className = "card";

    const cardContent = document.createElement("div");
    cardContent.innerHTML = `
      <h3 class="card-title">${book.title}</h3>
      <span class="card-author">${book.author}</span>
    `;

    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";

    const readBtn = document.createElement("button");
    readBtn.className = "secondary-btn read-btn";
    readBtn.textContent = book.status ? "Completed" : "Mark Completed";
    readBtn.addEventListener("click", markAsRead);

    const removeBtn = document.createElement("button");
    removeBtn.className = "secondary-btn remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", removeBook);

    cardFooter.append(readBtn, removeBtn);
    card.append(cardContent, cardFooter);
    return card;
  }

  function markAsRead(e) {}

  function removeBook(e) {}

  addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180);
  addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281);
  addBookToLibrary("1984", "George Orwell", 328);
  addBookToLibrary("Pride and Prejudice", "Jane Austen", 279);
  addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 224);

  displayBooks();
})();
