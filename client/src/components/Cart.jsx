import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaCreditCard,
  FaShoppingBag,
} from "react-icons/fa";

const Cart = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity, // Get new functions
    decreaseQuantity, // Get new functions
    clearCart,
    calculateTotal,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null; // Don't render if not open

  // Prevent modal closing when clicking inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto"
      onClick={closeCart} // Close modal when clicking outside
    >
      {/* Added max-h-[90vh] to limit modal height and enable internal scrolling */}
      <div
        className="relative bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          {" "}
          {/* Added sticky header */}
          <h2 className="text-2xl font-bold text-gray-900">
            Your Cart ({cartItems.length})
          </h2>
          {/* Close Button */}
          <button
            onClick={closeCart}
            className="text-gray-600 hover:text-gray-900 text-xl transition-colors duration-200"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>
        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto -mr-6 pr-6">
          {" "}
          {/* Added padding and margin for scrollbar space */}
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Your cart is empty.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={
                    item.id ||
                    item.volumeInfo?.title +
                      item.volumeInfo?.publishedDate +
                      item.quantity +
                      Math.random()
                  }
                  className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  {/* Item Image and Title */}
                  <div className="flex items-center gap-3 flex-grow">
                    <img
                      src={
                        item.volumeInfo?.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/60x90.png?text=No+Image"
                      }
                      alt={item.volumeInfo?.title || "Book cover"}
                      className="h-16 w-auto object-contain rounded flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/60x90.png?text=No+Image";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {item.volumeInfo?.title || "Untitled"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.volumeInfo?.authors?.join(", ") ||
                          "Unknown Author"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity, Price, and Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto flex-shrink-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={item.quantity <= 1} // Disable if quantity is 1 (will be removed by decrement logic)
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 text-gray-800 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-r-md transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Price */}
                    {/* Ensure item.priceValue is available - passed from Home.jsx addToCart */}
                    <p className="text-green-600 font-bold text-lg">
                      ${item.priceValue || "N/A"}
                    </p>

                    {/* Remove Button (Icon) */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-xl transition-colors duration-200 ml-2"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>{" "}
        {/* End of scrollable area */}
        {/* Total Section */}
        {cartItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white z-10">
            {" "}
            {/* Added sticky footer */}
            <div className="text-xl font-bold text-gray-800">Total:</div>
            <div className="text-xl font-bold text-green-700">
              ${calculateTotal()}
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div
          className={`mt-6 flex flex-col gap-3 ${
            cartItems.length === 0 ? "hidden" : "flex"
          }`}
        >
          {" "}
          {/* Hide buttons if cart is empty */}
          {/* Continue Shopping Button */}
          <button
            onClick={closeCart} // Simply close the modal
            className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </button>
          {/* Checkout Button */}
          <button
            onClick={() => {
              console.log("Proceeding to checkout with:", cartItems);
              closeCart(); // Close the cart modal
              // Navigate to the checkout page
              navigate("/checkout"); // Use navigate here
            }}
            className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out"
          >
            <FaCreditCard className="mr-2" /> Proceed to Checkout
          </button>
          {/* Clear Cart Button */}
          <button
            onClick={() => {
              clearCart(); // Clear the cart state
              // No need to close the modal immediately, user might clear by mistake
              // or might want to see the empty cart state.
              // You could add a confirmation modal here.
            }}
            className="flex items-center justify-center w-full border border-red-500 text-red-600 hover:bg-red-50 text-sm py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            <FaTrash className="mr-2" /> Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
