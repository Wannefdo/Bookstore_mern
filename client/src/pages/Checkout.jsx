import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Adjust path as needed
// Assuming you have react-router-dom installed for actual navigation
import { useNavigate } from "react-router-dom";
import { FaPrint } from "react-icons/fa";
import axios from "axios";

const CheckoutPage = () => {
  // Access cart items and total calculation from context
  const { cartItems, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation

  // State for shipping information form
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    stateProvince: "",
    zipPostal: "",
    country: "",
    email: "",
    phone: "",
  });

  // State for selected payment method
  const [paymentMethod, setPaymentMethod] = useState(""); // e.g., 'credit_card', 'paypal'

  // State for simulating order details after placing order
  const [orderDetails, setOrderDetails] = useState(null);

  // Effect to check if cart is empty and redirect if necessary
  useEffect(() => {
    // If cart is empty and we are not on the confirmation step,
    // redirect the user (e.g., back to home or cart page)
    if (cartItems.length === 0 && step !== 4) {
      console.log("Cart is empty, redirecting...");
      // navigate('/'); // Example using react-router-dom
      // For this example, we'll just show a message
    }
  }, [cartItems, step]); // Depend on cartItems and step

  // Handle input changes for shipping form
  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Validate shipping form (basic validation)
  const validateShipping = () => {
    const requiredFields = [
      "fullName",
      "address1",
      "city",
      "stateProvince",
      "zipPostal",
      "country",
      "email",
      "phone",
    ];
    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        alert(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`
        );
        return false;
      }
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Validate payment method selection
  const validatePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return false;
    }
    return true;
  };

  // Handle step progression
  const handleNextStep = () => {
    if (step === 1) {
      if (validateShipping()) {
        setStep(2); // Move to Payment
      }
    } else if (step === 2) {
      if (validatePayment()) {
        setStep(3); // Move to Review
      }
    } else if (step === 3) {
      // This is the "Place Order" step
      placeOrder();
    }
  };

  // Handle step regression
  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Simulate placing the order
  const placeOrder = async () => {
    // 1. Construct the payload to send to the backend
    const orderPayload = {
      shippingInfo: shippingInfo,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.volumeInfo?.title || "Untitled",
        quantity: item.quantity,
        price: parseFloat(item.priceValue) || 0,
      })),
      totalAmount: calculateTotal(),
      orderDate: new Date().toISOString(), // ISO format is good for backend
    };

    console.log("Order Payload:", orderPayload);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3000/orders/",
        orderPayload,
        {
          headers: { "x-auth-token": token },
        }
      );

      console.log("Order placed successfully:", response.data);

      // 3. Handle the backend response
      // The backend should ideally return the saved order details, including its new ID
      const savedOrder = response.data; // Assuming the backend returns the created order

      // Update orderDetails with the actual data from the backend
      setOrderDetails({
        orderId: savedOrder.id || `INV-${Date.now()}`,
        date: new Date(savedOrder.orderDate || Date.now()).toLocaleString(),
        shippingInfo: savedOrder.shippingInfo || shippingInfo,
        paymentMethod: savedOrder.paymentMethod || paymentMethod,
        items: savedOrder.items || orderPayload.items, // Use items from backend response
        total: savedOrder.totalAmount || calculateTotal(),
        // Add any other details returned by your backend
      });

      clearCart(); // Clear the cart after successful order placement
      setStep(4); // Move to Confirmation
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response ? error.response.data : error.message
      );
      // 4. Handle errors (e.g., display an error message to the user)
      let errorMessage =
        "There was an issue placing your order. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(`Order Failed: ${errorMessage}`);
      // Optionally, you might want to keep the user on step 3 or redirect them
      // setStep(3); // Or navigate to an error page
    }
  };

  // Function to trigger browser print
  const handlePrintInvoice = () => {
    window.print();
  };

  // Render content based on the current step
  const renderStepContent = () => {
    if (cartItems.length === 0 && step !== 4) {
      return (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Cart is Empty
          </h3>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before checking out.
          </p>
          {/* Consider adding a button to navigate back to the home/books page */}
          {/* <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                Browse Books
             </button> */}
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Shipping Information
            </h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={shippingInfo.email}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="address1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address1"
                  id="address1"
                  value={shippingInfo.address1}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="address2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  value={shippingInfo.address2}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={shippingInfo.city}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="stateProvince"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  type="text"
                  name="stateProvince"
                  id="stateProvince"
                  value={shippingInfo.stateProvince}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="zipPostal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  name="zipPostal"
                  id="zipPostal"
                  value={shippingInfo.zipPostal}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={shippingInfo.country}
                  onChange={handleShippingInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Payment Method
            </h3>
            <div className="space-y-4">
              <label className="flex items-center border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-lg font-medium text-gray-800">
                  Credit Card
                </span>
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-lg font-medium text-gray-800">
                  PayPal
                </span>
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-lg font-medium text-gray-800">
                  Bank Transfer
                </span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Review Your Order
            </h3>

            {/* Order Summary */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                Items:
              </h4>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex justify-between items-center text-gray-800"
                  >
                    <span>
                      {item.volumeInfo?.title || "Untitled"} x {item.quantity}
                    </span>
                    <span>
                      $
                      {(parseFloat(item.priceValue) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4 text-lg font-bold text-gray-800">
                <span>Order Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>

            {/* Shipping Info Summary */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                Shipping To:
              </h4>
              <div className="text-gray-800 leading-relaxed">
                <p>{shippingInfo.fullName}</p>
                <p>{shippingInfo.address1}</p>
                {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
                <p>
                  {shippingInfo.city}, {shippingInfo.stateProvince}{" "}
                  {shippingInfo.zipPostal}
                </p>
                <p>{shippingInfo.country}</p>
                <p>Email: {shippingInfo.email}</p>
                <p>Phone: {shippingInfo.phone}</p>
              </div>
            </div>

            {/* Payment Method Summary */}
            <div>
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                Payment Method:
              </h4>
              <p className="text-gray-800">
                {paymentMethod.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>
        );
      case 4:
        // Order Confirmation / Simulated Invoice Display
        if (!orderDetails)
          return (
            <p className="text-center text-red-500">Order details not found.</p>
          );

        return (
          <div className="text-gray-800">
            {/* Invoice Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Invoice</h3>
                <p className="text-sm text-gray-600">
                  Order ID:{" "}
                  <span className="font-semibold">{orderDetails.orderId}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  <span className="font-semibold">{orderDetails.date}</span>
                </p>
              </div>
              <div className="text-right">
                <h4 className="text-xl font-semibold text-gray-800">
                  Bookstore
                </h4>{" "}
                <p className="text-sm text-gray-600">
                  142, Katuwana Industrial Estate, Homagama 10200
                </p>
                <p className="text-sm text-gray-600">+94-11-675-5675</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-700 mb-3">
                  Billing Information
                </h4>
                {/* For this simulation, we'll use shipping info as billing */}
                <div className="text-gray-800 leading-relaxed">
                  <p>{orderDetails.shippingInfo.fullName}</p>
                  <p>{orderDetails.shippingInfo.address1}</p>
                  {orderDetails.shippingInfo.address2 && (
                    <p>{orderDetails.shippingInfo.address2}</p>
                  )}
                  <p>
                    {orderDetails.shippingInfo.city},{" "}
                    {orderDetails.shippingInfo.stateProvince}{" "}
                    {orderDetails.shippingInfo.zipPostal}
                  </p>
                  <p>{orderDetails.shippingInfo.country}</p>
                  <p>Email: {orderDetails.shippingInfo.email}</p>
                  <p>Phone: {orderDetails.shippingInfo.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-700 mb-3">
                  Shipping Information
                </h4>
                <div className="text-gray-800 leading-relaxed">
                  <p>{orderDetails.shippingInfo.fullName}</p>
                  <p>{orderDetails.shippingInfo.address1}</p>
                  {orderDetails.shippingInfo.address2 && (
                    <p>{orderDetails.shippingInfo.address2}</p>
                  )}
                  <p>
                    {orderDetails.shippingInfo.city},{" "}
                    {orderDetails.shippingInfo.stateProvince}{" "}
                    {orderDetails.shippingInfo.zipPostal}
                  </p>
                  <p>{orderDetails.shippingInfo.country}</p>
                  <p>Email: {orderDetails.shippingInfo.email}</p>
                  <p>Phone: {orderDetails.shippingInfo.phone}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">
                Order Details
              </h4>
              <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Item</th>
                    <th className="py-3 px-6 text-center">Quantity</th>
                    <th className="py-3 px-6 text-right">Unit Price</th>
                    <th className="py-3 px-6 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 text-sm font-light">
                  {orderDetails.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">{item.quantity}</td>
                      <td className="py-3 px-6 text-right">
                        ${parseFloat(item.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-right">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="text-lg font-bold text-gray-800 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-300">
                    <span>Subtotal:</span>
                    <span>${orderDetails.total}</span>
                  </div>

                  <div className="flex justify-between py-2 mt-2 border-t-2 border-gray-800">
                    {" "}
                    {/* Stronger border for total */}
                    <span>Total:</span>
                    <span className="text-green-700">
                      ${orderDetails.total}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-gray-800">
                  <h5 className="text-lg font-semibold text-gray-700 mb-2">
                    Payment Information:
                  </h5>
                  <p>
                    <span className="font-semibold">Method:</span>{" "}
                    {orderDetails.paymentMethod.replace("_", " ").toUpperCase()}
                  </p>
                  {/* Add last 4 digits of card, transaction ID etc. in a real app */}
                </div>
              </div>
            </div>

            {/* Footer/Thank You */}
            <div className="text-center text-gray-600 mt-8 pt-8 border-t border-gray-300">
              <p className="text-xl font-semibold mb-2">
                Thank You For Your Order!
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 my-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Checkout
      </h1>
      {step === 4 && (
        <div className="flex justify-end mb-4 no-print">
          {" "}
          <button
            onClick={handlePrintInvoice}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
            aria-label="Print or Save Invoice as PDF"
          >
            <FaPrint className="mr-2" /> Print Invoice
          </button>
        </div>
      )}
      {step !== 4 && ( // Hide step indicator on confirmation page
        <div className="flex justify-center mb-8 no-print">
          {" "}
          <div
            className={`flex items-center ${
              step >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step >= 1
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-400"
              }`}
            >
              1
            </span>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          <div
            className={`flex-auto border-t-2 mt-4 mx-4 ${
              step > 1 ? "border-blue-600" : "border-gray-400"
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step >= 2
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-400"
              }`}
            >
              2
            </span>
            <span className="ml-2 font-medium">Payment</span>
          </div>
          <div
            className={`flex-auto border-t-2 mt-4 mx-4 ${
              step > 2 ? "border-blue-600" : "border-gray-400"
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step >= 3
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-400"
              }`}
            >
              3
            </span>
            <span className="ml-2 font-medium">Review</span>
          </div>
          <div
            className={`flex-auto border-t-2 mt-4 mx-4 ${
              step > 3 ? "border-blue-600" : "border-gray-400"
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 4 ? "text-green-600" : "text-gray-400"
            }`}
          >
            {" "}
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step >= 4
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-400"
              }`}
            >
              ✓
            </span>{" "}
            <span className="ml-2 font-medium">Confirmation</span>
          </div>
        </div>
      )}
      <div className="mb-8">{renderStepContent()}</div>
      {cartItems.length > 0 && step !== 4 && (
        <div className="flex justify-between mt-8 no-print">
          {" "}
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-md transition duration-200 ease-in-out"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNextStep}
            className={`px-6 py-2 font-bold rounded-md transition duration-200 ease-in-out ${
              step === 3
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } ${step === 1 && "ml-auto"} ${
              step === 2 &&
              (paymentMethod ? "" : "opacity-50 cursor-not-allowed")
            }`}
            disabled={step === 2 && !paymentMethod}
          >
            {step === 1 && "Continue to Payment"}
            {step === 2 && "Review Order"}
            {step === 3 && "Place Order"}
          </button>
        </div>
      )}
      {step === 4 && (
        <div className="text-center mt-8 no-print">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
