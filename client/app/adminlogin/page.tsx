"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/admindashboard");

    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/adminbg.jpg')" }}
      />

      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

      <form
        onSubmit={handleLogin}
        className={`relative z-10 w-full max-w-md bg-white p-10 rounded-3xl 
        shadow-2xl border border-slate-200
        transform transition-all duration-700 ease-out
        ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          Admin Login
        </h1>

        <p className="text-sm text-slate-600 mb-8 text-center">
          Secure access to admin dashboard
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-5 border border-slate-300 rounded-xl px-4 py-3
                     text-slate-900 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 border border-slate-300 rounded-xl px-4 py-3
                     text-slate-900 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl
                     hover:bg-indigo-700 transition duration-300
                     hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an admin account?{" "}
          <button
            type="button"
            onClick={() => router.push("/admin-signup")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </main>
  );
}
