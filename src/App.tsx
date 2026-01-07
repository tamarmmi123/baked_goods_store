import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth } from "./features/auth/components/RequireAuth";
import { AuthBootstrap } from "./app/AuthBootstrap";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Products from "./features/products/pages/Products";
import Navbar from "./shared/components/Navbar";
import AddProductPage from "./features/products/pages/AddProductPage";
import UpdateProduct from "./features/products/pages/UpdateProduct";

function App() {
  return (
    <AuthBootstrap>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add-product" element={<AddProductPage />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
        </Routes>
      </Router>
    </AuthBootstrap>
  );
}

export default App;
