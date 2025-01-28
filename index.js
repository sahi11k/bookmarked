(() => {
  // book class
  class Book {
    constructor(title, author, status = false) {
      this.title = title;
      this.author = author;
      this.status = status;
      this.id = generateId();
    }
  }

  // book state
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
  const $modalOkBtn = document.querySelector(".ok-btn");

  // form elements
  const $form = document.querySelector("#add-book-form");
  const $bookTitleInput = document.querySelector("#book-title");
  const $bookAuthorInput = document.querySelector("#book-author");
  const $titleError = document.querySelector(".title-error-msg");
  const $authorError = document.querySelector(".author-error-msg");

  function setupListeners() {
    $showModalButtonPrimary.addEventListener("click", openModal);
    $showModalButtonSecondary.addEventListener("click", openModal);
    $modal.addEventListener("click", modalActionsHandler);
    $bookTitleInput.addEventListener("input", ({ target: { value } }) => {
      validateInput({
        inputValue: value,
        errorNode: $titleError,
        fieldLabel: "Book Title",
      });
    });

    $bookAuthorInput.addEventListener("input", ({ target: { value } }) => {
      validateInput({
        inputValue: value,
        errorNode: $authorError,
        fieldLabel: "Book Author",
      });
    });
  }

  function validateInput({ inputValue, errorNode, fieldLabel }) {
    if (isEmpty(inputValue)) {
      errorNode.textContent = `${fieldLabel} is required`;
      $modalOkBtn.disabled = true;
    } else {
      errorNode.textContent = "";
      $modalOkBtn.disabled = false;
    }
  }

  // modal functions
  function openModal() {
    $modal.showModal();
    $modalBackdrop.style.display = "block";
    $modalOkBtn.disabled = true;
  }

  function resetForm() {
    $form.reset();
    $titleError.textContent = "";
    $authorError.textContent = "";
  }

  function closeModal() {
    resetForm();
    $modal.close();
    $modalBackdrop.style.display = "none";
  }

  function init() {
    setupListeners();
    document.getElementById("current-year").textContent =
      new Date().getFullYear();
    displayBooks();
  }

  function validateForm({ title, author }) {
    validateInput({
      inputValue: title,
      errorNode: $titleError,
      fieldLabel: "Book Title",
    });
    validateInput({
      inputValue: author,
      errorNode: $authorError,
      fieldLabel: "Book Author",
    });
    if (isEmpty(title) || isEmpty(author)) return false;
    return true;
  }

  function formSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData($form);
    const title = formData.get("book-title");
    const author = formData.get("book-author");

    if (!validateForm({ title, author })) return;

    addBookToLibrary(title, author);
    closeModal();
  }

  function modalActionsHandler(e) {
    const classList = e.target.classList;
    if (classList.contains("ok-btn")) {
      formSubmitHandler(e);
    } else if (classList.contains("cancel-btn")) {
      closeModal();
    }
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

  function showEmptyBookList() {
    const $bookListEmpty = document.querySelector("#book-list-empty");
    if (booksToRead.length === 0) {
      $bookListEmpty.style.display = "flex";
    } else {
      $bookListEmpty.style.display = "none";
    }
  }

  init();
})();

// utility functions
function addBooksToLocalStorage(books) {
  localStorage.setItem("booksToRead", JSON.stringify(books));
}

function getBooksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("booksToRead")) || [];
}

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function truncateString(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

function isEmpty(value) {
  return !value || value?.trim().length === 0;
}
