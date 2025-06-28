import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit,
  Save,
  X,
  LogOut,
  Home,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Info,
  User,
} from "lucide-react"; // Import necessary icons

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // success, error, info

  // State for orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // Memoized navigate to prevent unnecessary re-renders of useEffect
  const memoizedNavigate = useCallback(navigate, []);

  // Fetch User Profile
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          text: "Authentication required. Redirecting to login.",
          type: "error",
        });
        // Use memoized navigate
        setTimeout(() => memoizedNavigate("/login"), 2000);
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/user/profile", {
          headers: { "x-auth-token": token },
        });
        setUserData(res.data);
        setFormData(res.data);
        setMessage({ text: "", type: "" }); // Clear any previous messages
      } catch (err) {
        console.error(
          "Auth error fetching user",
          err.response?.data || err.message
        );
        setMessage({
          text: "Failed to fetch user profile. Please log in again.",
          type: "error",
        });
        localStorage.removeItem("token"); // Clear potentially invalid token
        // Use memoized navigate
        setTimeout(() => memoizedNavigate("/login"), 2500);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [memoizedNavigate]); // Dependency on memoizedNavigate

  // Fetch User Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setOrdersError("Not authenticated to fetch orders.");
        setLoadingOrders(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/orders/my", {
          headers: { "x-auth-token": token },
        });
        // Ensure res.data is an array, default to empty array if not
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "Error fetching orders",
          err.response?.data || err.message
        );
        setOrdersError("Could not load your orders. Please try again later.");
      } finally {
        setLoadingOrders(false);
      }
    };

    // Only fetch orders if a token exists
    if (localStorage.getItem("token")) {
      fetchOrders();
    } else {
      setLoadingOrders(false); // Ensure loading state is cleared if no token
    }
  }, []); // No dependency needed here as we check localStorage directly and don't rely on props/state that change often.

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        text: "Authentication token missing. Please log in.",
        type: "error",
      });
      navigate("/login"); // Direct navigate is fine here as it's user-initiated
      return;
    }

    if (!formData.name || !formData.email) {
      setMessage({ text: "Name and Email are required.", type: "error" });
      return;
    }

    setMessage({ text: "Updating profile...", type: "info" });
    try {
      const res = await axios.put(
        "http://localhost:3000/user/profile",
        formData,
        { headers: { "x-auth-token": token } }
      );
      setUserData(res.data);
      setFormData(res.data);
      setEditing(false);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error("Update failed", err.response?.data || err.message);
      setMessage({
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setOrders([]);
    setMessage({ text: "Logged out successfully.", type: "info" });
    navigate("/"); // Direct navigate is fine here
  };

  const handleGoHome = () => navigate("/"); // Direct navigate is fine here

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset formData to the last fetched userData
    setFormData(userData);
    setMessage({ text: "", type: "" }); // Clear messages on cancel
  };

  // Render loading state early
  if (loadingUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="flex items-center text-lg font-medium text-gray-600">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            ></path>
          </svg>
          Loading your profile...
        </div>
        {/* Optional: Display a message if loading takes too long or seems stuck */}
        {/* <p className="mt-2 text-sm text-gray-500">If this takes too long, please check your connection or try logging in again.</p> */}
      </div>
    );
  }

  // Render authentication error state
  if (!userData && !loadingUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            Authentication Required
          </h2>
          {message.text && (
            <p className={`text-sm text-red-500 mb-4`}>{message.text}</p>
          )}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 shadow-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Define profile fields
  const profileFields = [
    { key: "name", label: "Full Name", type: "text", editable: true },
    { key: "email", label: "Email Address", type: "email", editable: false },
    { key: "phone", label: "Phone Number", type: "tel", editable: true },
    { key: "address", label: "Address", type: "text", editable: true },
    { key: "bio", label: "Bio", type: "textarea", editable: true },
    { key: "avatarUrl", label: "Avatar URL", type: "url", editable: true },
  ];

  // Render main profile content
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Top Bar for Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 transition duration-150 flex items-center shadow-sm"
            title="Back to Home"
          >
            <Home size={18} className="mr-1" />
            Home
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-150 flex items-center shadow-sm"
            title="Logout"
          >
            <LogOut size={18} className="mr-1" />
            Logout
          </button>
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center justify-center">
            <User size={36} className="mr-3 text-indigo-600" />
            User Dashboard
          </h1>
          {userData && (
            <p className="text-lg text-gray-600 mt-2">
              Welcome back, {userData.name}!
            </p>
          )}
        </header>

        {/* Message Area */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md text-sm flex items-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
            role="alert"
          >
            <span className="mr-3">
              {message.type === "success" && <CheckCircle size={20} />}
              {message.type === "error" && <AlertCircle size={20} />}
              {message.type === "info" && <Info size={20} />}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Information Card */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-indigo-500 shadow-sm"
                src={
                  formData.avatarUrl ||
                  userData.avatarUrl ||
                  "https://placehold.co/128x128/E0E0E0/777777?text=User" // Default placeholder
                }
                alt={`${userData.name}'s avatar`}
                onError={(e) => {
                  // Fallback on error
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/128x128/E0E0E0/777777?text=Error";
                }}
              />
            </div>

            {/* Profile Details/Form Section */}
            <div className="flex-grow w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Profile Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMessage({ text: "", type: "" }); // Clear messages when starting edit
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-150 flex items-center shadow-sm"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {profileFields.map(({ key, label, type, editable }) => (
                  <div
                    key={key}
                    className={
                      type === "textarea" || key === "address"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      {label}
                    </label>
                    {editing && editable ? (
                      type === "textarea" ? (
                        <textarea
                          id={key}
                          name={key}
                          value={formData[key] || ""}
                          onChange={handleChange}
                          rows="3"
                          className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={`Your ${label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          id={key}
                          type={type}
                          name={key}
                          value={formData[key] || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={`Your ${label.toLowerCase()}`}
                          disabled={key === "email"} // Prevent email editing
                        />
                      )
                    ) : (
                      <p className="text-gray-800 text-sm break-words bg-gray-50 p-2 rounded-md min-h-[38px] flex items-center">
                        {userData[key] || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Edit Action Buttons */}
              {editing && (
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                  <button
                    onClick={handleUpdate}
                    className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 flex items-center justify-center shadow-sm"
                  >
                    <Save size={18} className="mr-1" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 flex items-center justify-center shadow-sm"
                  >
                    <X size={18} className="mr-1" />
                    Cancel
                  </button>
                </div>
              )}

              <p className="text-gray-500 text-xs mt-6 text-center md:text-left">
                Member since:{" "}
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* My Orders Section Card */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
            <ShoppingBag size={24} className="mr-2 text-indigo-600" />
            My Orders
          </h2>
          {loadingOrders && (
            <div className="flex items-center text-gray-600">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
                ></path>
              </svg>
              Loading your orders...
            </div>
          )}
          {ordersError && (
            <p className="text-red-500 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {ordersError}
            </p>
          )}
          {!loadingOrders && !ordersError && orders.length === 0 && (
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          )}
          {!loadingOrders && !ordersError && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <p className="text-sm font-medium text-gray-800">
                      Order ID:{" "}
                      <span className="font-normal text-gray-600 break-all">
                        {order._id}
                      </span>
                    </p>
                    {/* Optional Status Display */}
                    {/* {order.status && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {order.status}
                        </span>
                    )} */}
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <p>
                      Date:{" "}
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </p>
                    <p>
                      Total:{" "}
                      <span className="font-semibold text-gray-800">
                        $
                        {typeof order.totalAmount === "number"
                          ? order.totalAmount.toFixed(2)
                          : "N/A"}
                      </span>
                    </p>
                    <p>
                      Items:{" "}
                      <span className="font-normal">
                        {order.items ? order.items.length : 0}
                      </span>
                    </p>
                    <p>
                      Payment Method:{" "}
                      <span className="font-normal">
                        {order.paymentMethod || "N/A"}
                      </span>
                    </p>
                  </div>
                  {/* Consider adding a link/button to view full order details */}
                  {/* <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 mt-3 inline-flex items-center"
                    >
                        View Details <span className="ml-1">&rarr;</span>
                    </button> */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom space/padding - removed the bottom buttons */}
        <div className="mb-10"></div>
      </div>
    </div>
  );
};

export default UserProfile;
