import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RequireAuth } from "./features/auth/components/RequireAuth";
import { AuthBootstrap } from "./app/AuthBootstrap";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Products from "./features/products/pages/Products";
import Navbar from "./shared/components/Navbar";
import AddProductPage from "./features/products/pages/AddProductPage";
import UpdateProduct from "./features/products/pages/UpdateProduct";
import CartPage from "./features/cart/pages/CartPage";
import { useAuth } from "./features/auth/hooks/useAuth";
import OrderConfirmationPage from "./features/checkout/pages/OrderConfirmationPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";

function App() {
  const user = useAuth();

  return (
    <AuthBootstrap>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/add-product"
            element={
              <RequireAuth roles={["admin"]}>
                <AddProductPage />
              </RequireAuth>
            }
          />
          <Route
            path="/products/update/:id"
            element={
              <RequireAuth roles={["admin"]}>
                <UpdateProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/shopping-cart"
            element={
              user?.role === "admin" || (user?.role === "user" && user.id) ? (
                <CartPage userId={user.id} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth roles={["user", "admin"]}>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <RequireAuth roles={["user", "admin"]}>
                <OrderConfirmationPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthBootstrap>
  );
}

export default App;
