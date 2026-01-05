import { useState } from "react";
import { useLoginMutation } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password }).unwrap();
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
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
            required
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
            required
          />
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
            Invalid email or password
          </p>
        )}
        <div>
            <p className="text-sm text-text mt-4 text-center">
                Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
            </p>
        </div>
      </form>
    </div>
  );
}
