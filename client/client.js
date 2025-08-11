const booklist = document.getElementById("booklist");
const addBookForm = document.getElementById("addBookForm");
const updateBookForm = document.getElementById("updateBookForm");

// async function to fetch books from the server
async function fetchBooks() {
  booklist.innerHTML = "Loading Books...";
  try {
    const res = await fetch("/api/library");
    if (!res.ok) {
      throw new Error("Network Error: " + res.statusText);
    }
    const books = await res.json();
    booklist.innerHTML = "";

    if (books.length === 0) {
      booklist.innerHTML = "No Books Available";
    } else {
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = `${book.title} by ${book.author} (${book.copies} copies)`;
        li.dataset.id = book._id;
        booklist.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error fetching books: ", error);
    booklist.innerHTML = "Error fetching books.";
  }
}

// event listener for adding a book
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addBookForm);
  const bookData = {
    title: formData.get("title"),
    author: formData.get("author"),
    copies: parseInt(formData.get("copies")),
  };
  try {
    const res = await fetch("/api/library", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error("Network Error: " + errorData.message);
    }
    const newBook = await res.json();
    const li = document.createElement("li");
    li.textContent = `${newBook.book.title} by ${newBook.book.author} (${newBook.book.copies} copies)`;
    li.dataset.id = newBook.book._id;
    booklist.appendChild(li);
    addBookForm.reset();
    alert("Book Added Successfully!");
    fetchBooks();
  } catch (error) {
    console.error("Error adding book: ", error);
  }
});

// event listener for updating a book
updateBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(updateBookForm);
  const bookId = formData.get("bookId");
  const bookData = {
    title: formData.get("title"),
    author: formData.get("author"),
    copies: parseInt(formData.get("copies")),
  };
  try {
    const res = await fetch(`/api/library/${bookId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error("Network Error: " + errorData.message);
    }
    const updatedBook = await res.json();
    const li = document.querySelector(`li[data-id="${bookId}"]`);
    if (li) {
      li.textcontent = `${updatedBook.book.title} by ${updatedBook.book.author} (${updatedBook.book.copies} copies)`;
      alert("Book Updated Successfully!");
    } else {
      alert("Book not found in the Library");
    }
    updateBookForm.reset();
    fetchBooks();
  } catch (error) {
    console.error("error updating book: ", error);
  }
});

// fetch all books on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});
