"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!API_URL) {
      setError("API URL not configured.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      router.push("/adminlogin");

    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/adsig.jpg')" }}
      />

      <div className="absolute top-0 left-0 w-full h-1/2 bg-black/60 backdrop-blur-sm" />

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-100" />

      <div className="relative z-10 w-full max-w-md 
                      bg-gradient-to-br from-white to-slate-50
                      shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]
                      rounded-3xl border border-slate-200
                      p-10 transition-all duration-300
                      hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45)]">

        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
          Admin Registration
        </h2>

        <p className="text-sm text-slate-600 text-center mb-8">
          Create your administrator account
        </p>

        <form onSubmit={handleSignup} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="w-full bg-white text-slate-900
                         border border-slate-300 rounded-xl px-4 py-3
                         placeholder-slate-400
                         focus:ring-2 focus:ring-indigo-700
                         focus:border-indigo-700
                         outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your admin email"
              className="w-full bg-white text-slate-900
                         border border-slate-300 rounded-xl px-4 py-3
                         placeholder-slate-400
                         focus:ring-2 focus:ring-indigo-700
                         focus:border-indigo-700
                         outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              className="w-full bg-white text-slate-900
                         border border-slate-300 rounded-xl px-4 py-3
                         placeholder-slate-400
                         focus:ring-2 focus:ring-indigo-700
                         focus:border-indigo-700
                         outline-none transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 
                            text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-700 hover:bg-indigo-800
                       text-white py-3 rounded-xl font-medium
                       transition duration-300 shadow-md
                       hover:-translate-y-1 hover:shadow-lg
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-sm text-slate-600 text-center">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => router.push("/adminlogin")}
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </button>
        </p>

      </div>

    </main>
  );
}
