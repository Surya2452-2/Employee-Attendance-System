"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/employee-dashboard");

    } catch (error) {
      console.error(error);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/emplogbg.jpg')" }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

      <form
        onSubmit={handleLogin}
        className={`relative z-10 w-full max-w-md rounded-3xl 
        bg-white p-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)]
        border border-slate-200
        transform transition-all duration-700 ease-out
        ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          Employee Login
        </h1>

        <p className="mb-8 text-center text-sm text-slate-600">
          Enter your credentials to access dashboard
        </p>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Employee Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-slate-300 px-4 py-3 rounded-xl
                       text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-slate-300 px-4 py-3 rounded-xl
                       text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl
                     hover:bg-indigo-700 transition-all duration-300
                     hover:shadow-xl hover:-translate-y-1
                     disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          New employee?{" "}
          <button
            type="button"
            onClick={() => router.push("/employeesignup")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </main>
  );
}
