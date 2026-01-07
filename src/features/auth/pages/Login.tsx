import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      navigate("/products");
    } catch (err) {
      // Error handled by RTK Query
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-10 rounded-3xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-medium tracking-tight text-text mb-6 text-center">
          Welcome back
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700"
            >
            </button>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="w-full mt-6 bg-primary text-white shadow-sm py-2 rounded-lg
                     hover:bg-primary-hover transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">
            {'data' in error ? (error.data as any)?.message : 'Login failed'}
          </p>
        )}
        <div>
          <p className="text-sm text-text mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
