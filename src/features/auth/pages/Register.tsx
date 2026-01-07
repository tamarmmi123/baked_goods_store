import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authApi";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, email, password, street, city, zip }).unwrap();
      navigate("/products");
    } catch (err) {
      // Error is already handled by RTK Query, no need to do anything here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-10 rounded-3xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-medium tracking-tight text-text mb-6 text-center">
          Create account
        </h2>

        <div className="grid gap-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
            required
          />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
            />

          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ZIP"
            className="input w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>

        <button
          disabled={isLoading}
          className="w-full mt-6 bg-primary text-white shadow-sm py-2 rounded-lg
                     hover:bg-primary-hover transition disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">
            {'data' in error ? (error.data as any)?.message : 'Registration failed'}
          </p>
        )}
        <div>
          <p className="text-sm text-text mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
