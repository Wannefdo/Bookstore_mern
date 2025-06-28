// src/components/Navbar.jsx

import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Import the useCart hook
// import { Link } from 'react-router-dom';
// Optional: Import a cart icon from react-icons if you prefer over SVG
// import { FaShoppingCart } from 'react-icons/fa';

// Functional component for the Navbar
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use the useCart hook to get cart data and functions
  const { cartItems, openCart } = useCart();

  // Calculate the total number of items in the cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Note: If your quantity is always 1 per unique item, you can just use cartItems.length

  // Function to toggle the mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-20">
      {" "}
      {/* Added sticky and z-index */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Site Title */}
        <div className="flex items-center">
          {/* Replace with your logo or app name */}
          <a
            href="/"
            className="text-xl font-bold text-indigo-400 hover:text-indigo-300"
          >
            Bookstore
          </a>
        </div>

        {/* Primary Navigation Links (Hidden on Mobile initially) */}
        <div className="hidden md:flex space-x-6"></div>

        {/* Search Bar, User Icon, Cart Icon */}
        <div className="flex items-center space-x-4">
          {/* Search Input (Optional: can be a modal or separate page) */}
          {/* You might integrate search functionality from Home here later */}
          <div className="relative hidden sm:block">
            {" "}
            {/* Hide search on extra small screens */}
            <input
              type="text"
              placeholder="Search books..."
              className="px-3 py-1 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              // Add value and onChange handlers if you connect this to state/search logic
            />
            {/* Basic Search Icon */}
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          {/* User Icon (Link to Login/Profile) */}
          {/* Using <a> tags here for simplicity, consider <Link> if using react-router-dom */}
          <a
            href="/userprofile"
            className="hover:text-indigo-300 transition-colors duration-200"
            aria-label="Login or Register"
          >
            {/* Basic User Icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </a>

          {/* Cart Icon Button - Triggers the Modal */}
          {/* Replaced <a> with <button> */}
          <button
            onClick={openCart} // Call the openCart function from context
            className="hover:text-indigo-300 relative focus:outline-none transition-colors duration-200"
            aria-label={`View cart with ${itemCount} items`} // Add aria-label for accessibility
          >
            {/* Basic Shopping Cart Icon (or use react-icons FaShoppingCart) */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            {/* Optional: Using react-icons */}
            {/* <FaShoppingCart className="h-6 w-6" /> */}

            {/* Cart item count badge - Show only if count > 0 */}
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {itemCount} {/* Display the calculated item count */}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label={
              isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
            }
          >
            {/* Hamburger icon */}
            {/* You could also use a close icon here when menu is open */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu (Shown/Hidden based on state) */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 pb-3 border-t border-gray-700">
          {" "}
          {/* Added top border */}
          {/* Using <a> tags here for simplicity, consider <Link> if using react-router-dom */}
          <a
            href="/"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="/books"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            Books
          </a>
          <a
            href="/categories"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            Categories
          </a>
          <a
            href="/about"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            Contact
          </a>
          {/* Add mobile links for User and Cart if needed, or handle differently */}
          {/* The cart icon is already in the main flex container,
               so just adding a link here is redundant if the icon is always visible */}
          <a
            href="/login"
            className="block hover:text-indigo-300 transition-colors duration-200"
          >
            Login/Register
          </a>
          {/* If you want a dedicated "View Cart" text link in the mobile menu: */}
          {/* <button onClick={openCart} className="block w-full text-left hover:text-indigo-300 transition-colors duration-200">
               View Cart ({itemCount})
           </button> */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
