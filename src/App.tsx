import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth } from "./features/auth/components/RequireAuth";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
