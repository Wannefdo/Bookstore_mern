import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout"; // Assuming MainLayout exists
import Cart from "./components/Cart";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import the CartProvider
import { CartProvider } from "./context/CartContext"; // Adjust the path if necessary
import Checkout from "./pages/Checkout";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      {/* Wrap Routes with CartProvider */}
      <CartProvider>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                {/* MainLayout typically includes shared elements like navigation */}
                <Home />
              </MainLayout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/userprofile" element={<UserProfile />} />

          {/* If Cart also uses MainLayout, wrap it */}
          <Route
            path="/cart"
            element={
              <MainLayout>
                {/* Assuming Cart also uses MainLayout */}
                <Cart />
              </MainLayout>
            }
          />
          {/* Example of a route that doesn't use MainLayout */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
