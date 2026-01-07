import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/Logo.png";
import {
  Search,
  Home,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ShoppingCart,
  Plus,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlSearchTerm =
      new URLSearchParams(location.search).get("search") || "";
    setSearchTerm(urlSearchTerm);
  }, [location.search]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <nav className="bg-primary-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="logo" className="h-14 w-auto" />
          </div>
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-3 py-1 rounded-md border border-gray-300 bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary w-80"
              />
            </div>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-muted hover:text-text transition tooltip"
              data-title="Home"
            >
              <Home className="h-5 w-5" />
            </Link>
            <Link
              to="/products"
              className="text-muted hover:text-text transition tooltip"
              data-title="Products"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
            <Link
              to="/products/add-product"
              className="text-muted hover:text-text transition tooltip"
              data-title="Add Product"
            >
              <Plus className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="text-muted hover:text-text transition tooltip"
              data-title="Login"
            >
              <LogIn className="h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="text-muted hover:text-text transition tooltip"
              data-title="Register"
            >
              <UserPlus className="h-5 w-5" />
            </Link>
            <Link
              to="/shopping-cart"
              className="text-muted hover:text-text transition tooltip"
              data-title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none text-text"
            >
              {isOpen ? "X" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary-600 text-white px-2 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            onClick={() => setIsOpen(false)}
            title="Home"
          >
            <Home className="h-5 w-5 inline mr-2" />
            Home
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            onClick={() => setIsOpen(false)}
            title="Products"
          >
            <LayoutDashboard className="h-5 w-5 inline mr-2" />
            Products
          </Link>
          <Link
            to="/products/add-product"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            title="Add Product"
          >
            <Plus className="h-5 w-5 inline mr-2" />
            Add Product
          </Link>
          <Link
            to="/login"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            onClick={() => setIsOpen(false)}
            title="Login"
          >
            <LogIn className="h-5 w-5 inline mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            onClick={() => setIsOpen(false)}
            title="Register"
          >
            <UserPlus className="h-5 w-5 inline mr-2" />
            Register
          </Link>
          <Link
            to="/shopping-cart"
            className="block px-3 py-2 rounded-md text-muted hover:text-text transition"
            onClick={() => setIsOpen(false)}
            title="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5 inline mr-2" />
            Shopping Cart
          </Link>
        </div>
      )}
    </nav>
  );
}
