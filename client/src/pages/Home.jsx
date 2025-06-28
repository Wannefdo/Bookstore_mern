import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { useCart } from "../context/CartContext"; // Import the useCart hook
import Cart from "../components/Cart";
import { getDummyPrice } from "../utils/priceHelpers";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null); // Still used for Book Details modal
  const [filters, setFilters] = useState({
    printType: "all",
    orderBy: "relevance",
    langRestrict: "",
    filter: "",
  });
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const maxResults = 12;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use the useCart hook to get cart functions and state
  const { addToCart, openCart } = useCart(); // Get addToCart and openCart
  const isUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  const fetchBooks = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    const params = new URLSearchParams();
    // Use "programming" only if query is empty AND it's the initial load
    params.append("q", query || "programming"); // Default query if empty

    if (filters.printType !== "all")
      params.append("printType", filters.printType);
    if (filters.orderBy) params.append("orderBy", filters.orderBy);
    if (filters.langRestrict)
      params.append("langRestrict", filters.langRestrict);
    if (filters.filter) params.append("filter", filters.filter);
    params.append("startIndex", startIndex);
    params.append("maxResults", maxResults);

    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?${params.toString()}`
      );
      // Check if res.data and res.data.items are valid before setting state
      setBooks(res.data && res.data.items ? res.data.items : []);
      setTotalItems(res.data ? res.data.totalItems || 0 : 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch books. Please try again later.");
      setBooks([]); // Clear books on error
      setTotalItems(0); // Reset total items on error
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    // Only fetch initially or when pagination/filters change.
    // Query changes trigger a fetch via handleSearch.
    // A simple check to prevent double-fetch on initial mount:
    // if (books.length === 0 && startIndex === 0 && query === "") {
    //   fetchBooks();
    // }
    // The current logic tied to startIndex and filters is mostly fine,
    // but ensure handleSearch also calls fetchBooks after resetting startIndex.
    fetchBooks(); // This useEffect now handles initial load and filter/pagination changes
  }, [startIndex, filters]); // Depend on startIndex and filters

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0); // Reset pagination on new search
    // The useEffect above listens for startIndex changes, which will trigger the fetch.
    // However, if query changes but startIndex remains 0, the useEffect won't trigger.
    // So, we need to manually trigger fetch here if the query actually changed,
    // OR refine the useEffect dependency.
    // Let's add 'query' to useEffect dependencies for simplicity and clarity,
    // and ensure handleSearch resets startIndex.
    fetchBooks(); // Call fetch immediately on search submission
  };

  // Refined useEffect dependencies
  useEffect(() => {
    fetchBooks();
  }, [startIndex, filters, query]); // Now depends on query too

  // Add to cart handler - calls context function and potentially opens cart modal
  const handleAddToCart = (book) => {
    if (!isUserLoggedIn()) {
      // If not logged in, redirect to login page
      navigate("/login");
      return; // Stop execution if not logged in
    }
    // Use saleInfo price if available and is FOR_SALE, otherwise use dummy price
    const priceValue =
      book.saleInfo?.saleability === "FOR_SALE" &&
      book.saleInfo?.retailPrice?.amount
        ? book.saleInfo.retailPrice.amount.toFixed(2)
        : getDummyPrice(book); // Assuming getDummyPrice is imported or available

    // Add the book to the cart with the determined price value
    // The context's addToCart now handles quantity and opening the modal
    addToCart(book, priceValue);

    // Keep closing the book details modal if it was open
    closeModal();
  };

  // Removed handleCheckout as it's now in Cart

  const handleViewDetails = (book) => {
    if (!isUserLoggedIn()) {
      // If not logged in, redirect to login page
      navigate("/login");
      return;
    }
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search & Filters */}
      <form
        onSubmit={handleSearch}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
      >
        <div>
          <label
            htmlFor="search-query"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Query
          </label>
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter book title, author, or keywords..."
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="print-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Print Type
            </label>
            <select
              id="print-type"
              value={filters.printType}
              onChange={(e) =>
                setFilters({ ...filters, printType: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="books">Books</option>
              <option value="magazines">Magazines</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="order-by"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order By
            </label>
            <select
              id="order-by"
              value={filters.orderBy}
              onChange={(e) =>
                setFilters({ ...filters, orderBy: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <select
              id="language"
              value={filters.langRestrict}
              onChange={(e) =>
                setFilters({ ...filters, langRestrict: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter
            </label>
            <select
              id="filter"
              value={filters.filter}
              onChange={(e) =>
                setFilters({ ...filters, filter: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Books</option>
              <option value="free-ebooks">Free eBooks</option>
              <option value="paid-ebooks">Paid eBooks</option>
              <option value="ebooks">All eBooks</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          Search
        </button>
      </form>
      {loading && <p className="text-center text-blue-600">Loading books...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && books.length === 0 && query !== "" && (
        <p className="text-center text-gray-600">
          No books found for "{query}".
        </p>
      )}
      {!loading && !error && books.length === 0 && query === "" && (
        <p className="text-center text-gray-600">
          Search for a book to get started!
        </p>
      )}
      {/* Book Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={
              book.id ||
              book.volumeInfo?.title + book.volumeInfo?.publishedDate ||
              Math.random()
            }
            book={book}
            onAddToCart={() => handleAddToCart(book)} // Use the updated handler
            onViewDetails={() => handleViewDetails(book)}
            // You might need to pass the calculated price to BookCard if Cart needs it
            // and it's not reliably in saleInfo. E.g., price={getDummyPrice(book)}
          />
        ))}
      </div>
      {/* Pagination */}
      {totalItems > maxResults && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            disabled={startIndex === 0 || loading}
            onClick={() =>
              setStartIndex((prev) => Math.max(0, prev - maxResults))
            }
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition duration-200 ease-in-out"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {Math.floor(startIndex / maxResults) + 1} of{" "}
            {Math.ceil(totalItems / maxResults)}
          </span>
          <button
            disabled={startIndex + maxResults >= totalItems || loading}
            onClick={() => setStartIndex((prev) => prev + maxResults)}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition duration-200 ease-in-out"
          >
            Next
          </button>
        </div>
      )}
      {/* Book Details Popup Modal (remains as is) */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 pr-6">
              {selectedBook.volumeInfo?.title || "Untitled Book"}
            </h2>
            <p className="text-md text-gray-700 mb-4 italic">
              {selectedBook.volumeInfo?.authors?.join(", ") || "Unknown Author"}
            </p>
            {selectedBook.volumeInfo?.imageLinks?.thumbnail && (
              <div className="flex justify-center mb-6">
                <img
                  src={selectedBook.volumeInfo.imageLinks.thumbnail}
                  alt={selectedBook.volumeInfo?.title || "Book cover"}
                  className="max-h-72 object-contain rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/128x190.png?text=No+Image";
                  }}
                />
              </div>
            )}
            <div className="mb-6 text-sm text-gray-700">
              {selectedBook.volumeInfo?.publisher && (
                <p className="mb-1">
                  <span className="font-semibold">Publisher:</span>{" "}
                  {selectedBook.volumeInfo.publisher}
                </p>
              )}
              {selectedBook.volumeInfo?.publishedDate && (
                <p className="mb-1">
                  <span className="font-semibold">Published Date:</span>{" "}
                  {selectedBook.volumeInfo.publishedDate}
                </p>
              )}
              {selectedBook.volumeInfo?.industryIdentifiers && (
                <p className="mb-1">
                  <span className="font-semibold">ISBN:</span>
                  {selectedBook.volumeInfo.industryIdentifiers
                    .map((id) => `${id.type}: ${id.identifier}`)
                    .join(", ")}
                </p>
              )}
              {selectedBook.volumeInfo?.pageCount && (
                <p className="mb-1">
                  <span className="font-semibold">Pages:</span>{" "}
                  {selectedBook.volumeInfo.pageCount}
                </p>
              )}
              {selectedBook.volumeInfo?.categories && (
                <p className="mb-1">
                  <span className="font-semibold">Subjects:</span>{" "}
                  {selectedBook.volumeInfo.categories.join(", ")}
                </p>
              )}
            </div>
            <div className="text-gray-800 text-sm leading-relaxed border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold mb-2">Description</h4>
              {selectedBook.volumeInfo?.description ? (
                <p>{selectedBook.volumeInfo.description}</p>
              ) : (
                "No description available."
              )}
            </div>
            {/* Buttons Section */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              {/* This button now calls handleAddToCart which uses context */}
              <button
                onClick={() => handleAddToCart(selectedBook)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
              >
                Add to Cart
              </button>
              {/* The checkout button from the book details modal can be removed or kept if it serves a different purpose */}
              {/* <button
                onClick={() => handleCheckout(selectedBook)} // Removed this handler
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
              >
                Checkout
              </button> */}
              {selectedBook.volumeInfo?.infoLink && (
                <a
                  href={selectedBook.volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
                >
                  More Info
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render the Cart component */}
      <Cart />
    </div>
  );
};

export default Home;
