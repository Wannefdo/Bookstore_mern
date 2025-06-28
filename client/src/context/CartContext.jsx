// src/context/CartContext.jsx (or .js)

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (book, priceValue) => {
    // Accept priceValue
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === book.id
      );

      if (existingItemIndex > -1) {
        // If exists, increase quantity
        const updatedCart = [...prevItems];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // If not, add the book with quantity 1 and priceValue
        return [...prevItems, { ...book, priceValue: priceValue, quantity: 1 }];
      }
    });
    openCart(); // Open cart after adding
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const increaseQuantity = (bookId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (bookId) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.id === bookId
              ? { ...item, quantity: Math.max(0, item.quantity - 1) } // Don't go below 0 temporarily
              : item
          )
          .filter((item) => item.quantity > 0) // Remove item if quantity drops to 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        // Ensure priceValue is a number and quantity is a number
        const price = parseFloat(item.priceValue) || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity, // Provide new functions
        decreaseQuantity, // Provide new functions
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        calculateTotal, // Provide total calculation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Remember to wrap your root component (like App.js) with <CartProvider>
