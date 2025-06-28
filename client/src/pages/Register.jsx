import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Functional component for the Registration Form
const RegisterForm = () => {
  // State variables for form inputs and validation errors
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // State variables for validation error messages
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  // Helper function for email format validation
  const validateEmail = (email) => {
    // Basic regex for email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function for phone number validation (only numbers and 10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneRegex.test(phone);
  };

  // Helper function for full name validation (only letters and spaces)
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  // Handler for password input changes and validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Basic password validation: minimum 6 characters
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError(""); // Clear error if validation passes
    }

    // Also validate confirm password if it has a value
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handler for confirm password input changes and validation
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password && newConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handler for name input changes and validation
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!validateName(newName)) {
      setNameError("Full name can only contain letters and spaces.");
    } else {
      setNameError("");
    }
  };

  // Handler for email input changes and validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Handler for phone input changes and validation
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    // Allow empty input initially, but validate if there's a value
    if (newPhone && !validatePhone(newPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
    } else {
      setPhoneError("");
    }
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission

    // Perform all validations before submitting
    let isValid = true;

    if (!validateName(name)) {
      setNameError("Full name can only contain letters and spaces.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Only validate phone if it has a value
    if (phone && !validatePhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (isValid) {
      axios
        .post("http://localhost:3000/auth/register", {
          name,
          email,
          password,
          phone,
          address,
        })
        .then((res) => {
          console.log("Success:", res.data);
          navigate("/login");
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  };

  return (
    // Main container for centering and background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Registration form container */}
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-lg">
        {" "}
        {/* Reduced space-y for more fields */}
        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a Bookstore Account
          </h2>
        </div>
        {/* Registration Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {" "}
          {/* Reduced space-y for more fields */}
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                nameError ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Full Name"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>
          {/* Email Input */}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
                autoComplete="new-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  passwordError || confirmPasswordError
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {/* Password visibility toggle button */}
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* Basic eye icon SVG - replace with an icon library if desired */}
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.75c-.18-.14-.357-.28-.534-.422A10.07 10.07 0 012 12c0 5.523 4.477 10 10 10 2.057 0 3.96-.604 5.546-1.645zm-9.06-3.173A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.07 10.07 0 01-1.563 2.75c.18.14.357.28.534.422A10.07 10.07 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.725.47 3.351 1.307 4.752z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </div>
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"} // Toggle type based on showConfirmPassword state
                autoComplete="new-password" // Use new-password for confirm as well
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {/* Confirm Password visibility toggle button */}
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {/* Basic eye icon SVG - replace with an icon library if desired */}
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.75c-.18-.14-.357-.28-.534-.422A10.07 10.07 0 012 12c0 5.523 4.477 10 10 10 2.057 0 3.96-.604 5.546-1.645zm-9.06-3.173A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.07 10.07 0 01-1.563 2.75c.18.14.357.28.534.422A10.07 10.07 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.725.47 3.351 1.307 4.752z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </div>
            </div>
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">
                {confirmPasswordError}
              </p>
            )}
          </div>
          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel" // Use tel for phone number input
              autoComplete="tel"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                phoneError ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="Phone Number (e.g., 1234567890)"
              value={phone}
              onChange={handlePhoneChange}
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-600">{phoneError}</p>
            )}
          </div>
          {/* Address Input */}
          <div>
            <label htmlFor="address" className="sr-only">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {/* Add validation for address if needed */}
          </div>
          {/* Sign Up Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* Social Sign Up Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="mt-6 space-y-4">
            {/* Google Sign Up Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {/* Google icon - using a placeholder image */}
              <img
                className="h-5 w-5 mr-2"
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/20x20/cccccc/ffffff?text=G";
                }}
              />
              Sign up with Google
            </button>
          </div>
        </div>
        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in now
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
