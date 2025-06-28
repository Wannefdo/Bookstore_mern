import React from "react";
import { getDummyPrice } from "../utils/priceHelpers";

const BookCard = ({ book, onAddToCart, onViewDetails }) => {
  const info = book.volumeInfo || {};
  const saleInfo = book.saleInfo || {};
  const thumbnail =
    info.imageLinks?.thumbnail ||
    "https://via.placeholder.com/128x190.png?text=No+Image";

  // Determine the final price
  const isForSale =
    saleInfo.saleability === "FOR_SALE" && saleInfo.retailPrice?.amount;
  const price = isForSale
    ? `${saleInfo.retailPrice.amount.toFixed(2)} ${
        saleInfo.retailPrice.currencyCode || "USD"
      }`
    : `${getDummyPrice(book)} USD`;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="flex-shrink-0 flex justify-center items-center bg-gray-100 p-4">
        <img
          src={thumbnail}
          alt={info.title || "Book cover"}
          className="h-48 w-auto object-contain" // Adjusted for aspect ratio
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/128x190.png?text=No+Image";
          }} // Handle broken images
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-bold mb-1 line-clamp-2 text-gray-800">
            {info.title || "Untitled Book"}
          </h3>
          <p className="text-sm text-gray-600 mb-1 italic">
            {info.authors ? info.authors.join(", ") : "Unknown Author"}
          </p>
          {info.averageRating && (
            <p className="text-yellow-500 text-sm mb-1">
              <span className="font-semibold">Rating:</span> ⭐{" "}
              {info.averageRating.toFixed(1)} / 5
            </p>
          )}
          {info.publishedDate && (
            <p className="text-sm text-gray-500 mb-2">
              Published: {new Date(info.publishedDate).getFullYear()}
            </p>
          )}
          <p className="text-green-600 font-extrabold text-lg">${price}</p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
          <button
            onClick={onAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition duration-200 ease-in-out"
          >
            Add to Cart
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-3 rounded-md transition duration-200 ease-in-out"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
