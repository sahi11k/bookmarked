(() => {
  let booksToRead = getBooksFromLocalStorage();

  // book list wrapper element
  const $bookList = document.querySelector("#book-list");

  // modal elements
  const $modal = document.querySelector("#modal");
  const $showModalButtonPrimary = document.querySelector(
    "#show-modal-btn-primary"
  );
  const $showModalButtonSecondary = document.querySelector(
    "#show-modal-btn-secondary"
  );
  const $modalBackdrop = document.querySelector(".modal-backdrop");

  // form elements
  const $form = document.querySelector("#add-book-form");

  $form.addEventListener("submit", (e) => {
    console.log(e);
  });

  class Book {
    constructor(title, author, status = false) {
      this.title = title;
      this.author = author;
      this.status = status;
      this.id = generateId();
    }
  }

  // modal functions
  function openModal() {
    $modal.showModal();
    $modalBackdrop.style.display = "block";
  }

  function closeModal() {
    $form.reset();
    $modal.close();
    $modalBackdrop.style.display = "none";
  }

  init();

  function formSubmitHandler() {
    const formData = new FormData($form);
    const title = formData.get("book-title");
    const author = formData.get("book-author");
    addBookToLibrary(title, author);
    closeModal();
  }

  function modalActionsHandler(e) {
    const classList = e.target.classList;
    if (classList.contains("ok-btn")) {
      formSubmitHandler();
    } else if (classList.contains("cancel-btn")) {
      closeModal();
    }
  }

  function init() {
    $showModalButtonPrimary.addEventListener("click", openModal);
    $showModalButtonSecondary.addEventListener("click", openModal);
    $modal.addEventListener("click", modalActionsHandler);
    document.getElementById("current-year").textContent =
      new Date().getFullYear();
    displayBooks();
  }

  function addBookToLibrary(title, author) {
    const book = new Book(title, author, false);
    booksToRead.push(book);
    const bookCard = createBookCard(book);
    $bookList.appendChild(bookCard);
    showEmptyBookList();
    addBooksToLocalStorage(booksToRead);
  }

  function displayBooks() {
    const fragment = document.createDocumentFragment();
    booksToRead.forEach((book) => {
      const bookCard = createBookCard(book);
      fragment.appendChild(bookCard);
    });
    $bookList.appendChild(fragment);
    showEmptyBookList();
  }

  function createBookCard(book) {
    const card = document.createElement("div");
    card.id = book.id;
    card.className = "card";

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.innerHTML = `
    <div class="book-title-wrapper">
      <h3 class="book-title" title="${book.title}">${truncateString(
      book.title,
      50
    )}</h3>
      <div class="book-status-icon ${book.status ? "active" : ""}">
        <img src="/assets/check-outlined.svg" alt="check-circle" />
      </div>
    </div>
    <div class="book-author" title="${book.author}">${truncateString(
      book.author,
      25
    )}</div>
    `;

    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";

    const readBtn = document.createElement("button");
    readBtn.className = "secondary-btn read-btn";
    readBtn.textContent = book.status ? "Mark Unread" : "Mark Read";
    readBtn.addEventListener("click", changeBookStatus);

    const removeBtn = document.createElement("button");
    removeBtn.className = "secondary-btn remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", removeBook);

    cardFooter.append(readBtn, removeBtn);
    card.append(cardContent, cardFooter);
    return card;
  }

  function changeBookStatus(e) {
    const card = e.target.closest(".card");
    if (!card) return;

    let newBookStatus = null;
    booksToRead = booksToRead.map((book) => {
      if (book.id === card.id) {
        newBookStatus = !book.status;
        book.status = newBookStatus;
      }
      return book;
    });

    card.querySelector(".book-status-icon").classList.toggle("active");

    card.querySelector(".read-btn").textContent = newBookStatus
      ? "Mark Unread"
      : "Mark Read";
    addBooksToLocalStorage(booksToRead);
  }

  function removeBook(e) {
    const card = e.target.closest(".card");
    if (!card) return;
    booksToRead = booksToRead.filter((book) => book.id !== card.id);
    card.remove();
    showEmptyBookList();
    addBooksToLocalStorage(booksToRead);
  }

  function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  function generateId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function showEmptyBookList() {
    const $bookListEmpty = document.querySelector("#book-list-empty");
    if (booksToRead.length === 0) {
      $bookListEmpty.style.display = "flex";
    } else {
      $bookListEmpty.style.display = "none";
    }
  }
  function addBooksToLocalStorage(books) {
    localStorage.setItem("booksToRead", JSON.stringify(books));
  }

  function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("booksToRead")) || [];
  }
})();
