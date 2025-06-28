import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Functional component for the Login Form
const Login = () => {
  const navigate = useNavigate();

  // State variables for email, password, remember me, and validation errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // State variables for validation error messages
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Helper function for email format validation
  const validateEmail = (email) => {
    // Basic regex for email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // useEffect hook to load saved credentials from local storage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberedRememberMe");

    // Check if remember me was previously checked and credentials exist
    if (savedRememberMe === "true" && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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

  // Handler for password input changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Basic password validation: minimum 6 characters
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError(""); // Clear error if validation passes
    }
  };

  // Handler for remember me checkbox changes
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    // Made the function async to use await with axios
    e.preventDefault(); // Prevent default browser form submission

    // Perform all validations before submitting
    let isValid = true;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // If all validations pass, proceed with login
    if (isValid) {
      // If remember me is checked, save credentials to local storage
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password); // Consider encrypting or not storing password directly
        localStorage.setItem("rememberedRememberMe", true);
      } else {
        // Otherwise, remove them from local storage
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberedRememberMe");
      }

      // --- Your login logic using Axios ---
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          email,
          password,
        });

        // Handle successful login (e.g., store token, redirect)
        console.log("Login successful:", response.data);
        // Example: Store JWT token if returned
        localStorage.setItem("token", response.data.token);
        // Redirect to dashboard or home page
        navigate("/"); // Assuming you are using react-router-dom
      } catch (error) {
        // Handle login errors (e.g., display error message from backend)
        console.error(
          "Login failed:",
          error.response?.data?.message || "An error occurred during login."
        );
        setLoginError(
          error.response?.data?.message || "An error occurred during login."
        ); // Display backend error or a generic message
      }
      // -----------------------------------
    }
  };

  return (
    // Main container for centering and background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Login form container */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Title */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your Bookstore Account
          </h2>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Hidden input for remember me (can be useful for some backend frameworks) */}
          <input type="hidden" name="remember" value="true" />

          {/* Input fields container */}
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email/Username Input */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address or Username
              </label>
              <input
                id="email-address"
                name="email"
                type="text" // Use text for either email or username
                autoComplete="email" // or "username" based on your backend
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address or Username"
                value={email}
                onChange={handleEmailChange} // Use the new handler
              />
            </div>
            {/* Email validation error message */}
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}

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
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
            </div>
          </div>

          {/* Password validation error message */}
          {passwordError && (
            <p className="mt-2 text-sm text-red-600">{passwordError}</p>
          )}

          {/* Remember Me and Forgot Password section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Social Login Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 space-y-4">
            {/* Google Login Button */}
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
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register" // Link to your registration page route
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
