const booksListDiv = document.querySelector("#booksList");
const fetchBooksButton = document.querySelector("#fetchBooksButton");
const messageDiv = document.querySelector("#message");
const apiBaseUrl = "http://localhost:3000";

async function fetchBooks() {
    try {
        booksListDiv.innerHTML = "Loading books...";
        messageDiv.innerText = "";

        const response = await fetch(`${apiBaseUrl}/books`);
        if (!response.ok) {
            const errorBody = response.headers.get("content-type")?.includes("application/json")
                ? await response.json()
                : { message: response.statusText };
            throw new Error(`HTTP Error! Status: ${response.status}, message: ${errorBody.message}`);
        }

        const books = await response.json();
        if (books.length == 0) {
            booksListDiv.innerHTML = `<p>No books found.</p>`;
        } else {
            books.forEach((book) => {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-item");
                bookElement.setAttribute("data-book-id", book.id);
                bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ID: ${book.id}</p>
                    <button onclick="viewBookDetails(${book.id})">View Details</button>
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button class="delete-btn" data-id="${book.id}">Delete</button>
                    `;
                booksListDiv.appendChild(bookElement);
            });
        }

        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", handleDeleteClick);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        booksListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
    }
}

function viewBookDetails(bookId) {
    console.log("View details for book ID:", bookId);
    alert(`View details for book ID: ${bookId} (Not implemented yet)`);
}

function editBook(bookId) {
    console.log("Edit book with ID:", bookId);
    window.location.href = `edit.html?id=${bookId}`;
}

async function handleDeleteClick(event) {
    const bookID = event.target.getAttribute("data-id");
    try {
        const response = await fetch(`${apiBaseUrl}/books/${bookID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseBody = response.headers.get("content-type")?.includes("application/json")
            ? await response.json()
            : { message: response.statusText };

        if (response.status == 204) {
            messageDiv.textContent = `Book successfully deleted`;
            messageDiv.style.color = "green";
            console.log(event.target.parentElement.remove());
        } else if (response.status == 404) {
            messageDiv.textContent = `Not found Error: ${responseBody.message}`;
            messageDiv.style.color = "red";
            console.error("Not found Error:", responseBody);
        } else {
            throw new Error(`API error! status: ${response.status}, message: ${responseBody.message}`);
        }
    } catch (error) {}
    // TODO: Implement the fetch DELETE request here
    // TODO: Handle success (204) and error responses (404, 500)
    // TODO: On successful deletion, remove the book element from the DOM
    // --- End of code for learners to complete ---
}

fetchBooksButton.addEventListener("click", fetchBooks);
