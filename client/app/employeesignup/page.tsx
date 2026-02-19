"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
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
          role: "employee",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push(`/verify-otp?email=${email}&type=employee`);
    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center">

      {/* TOP HALF IMAGE */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/empsignin.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-black/40" />

      {/* BOTTOM HALF */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

      {/* CENTER CARD */}
      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-200"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Employee Signup
        </h2>

        <p className="text-sm text-slate-600 mb-8 text-center">
          Verify your email to create your account
        </p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white text-slate-900 border border-slate-300 px-4 py-3 rounded-xl
                       placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-600
                       focus:border-indigo-600 transition"
          />

          <input
            type="email"
            placeholder="Employee Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white text-slate-900 border border-slate-300 px-4 py-3 rounded-xl
                       placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-600
                       focus:border-indigo-600 transition"
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl
                     hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* 📝 NOTE BLOCK ADDED BELOW BUTTON */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> Please enter a valid and accessible email address. 
          After clicking "Send OTP", check your inbox and also your spam/junk folder 
          for the verification OTP.
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/employeelogin")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>

    </main>
  );
}
