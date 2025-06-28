// src/utils/priceHelpers.js

// This map needs to live outside the function
// so that generated prices are consistent for the same "book" ID/title.
const dummyPriceMap = {};

export function getDummyPrice(book) {
  // Use id if available, otherwise fallback to title or a random number
  // Using title ensures the price is consistent across sessions
  // if the book ID isn't reliable or present.
  const id = book.id || book.volumeInfo?.title || Math.random().toString();
  if (dummyPriceMap[id]) return dummyPriceMap[id];

  // Base price on title length or page count, add some variation
  const base =
    ((book.volumeInfo?.title?.length || 10) +
      (book.volumeInfo?.pageCount || 50) / 10) *
    0.5;
  const variation = Math.random() * 7; // Add a bit more variation
  // Ensure a minimum price
  const price = Math.max(base + variation, 5).toFixed(2);
  dummyPriceMap[id] = price;
  return price;
}

// You can add other price-related helpers here in the future
// export function formatPrice(amount, currencyCode = 'USD') { ... }
