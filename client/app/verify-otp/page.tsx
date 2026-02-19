"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyOtpContent() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const type = params.get("type") || "employee";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Invalid request. Email missing.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      setSuccess("Account verified successfully! Redirecting...");

      setTimeout(() => {
        if (type === "admin") {
          router.push("/adminlogin");
        } else {
          router.push("/employeelogin");
        }
      }, 1500);

    } catch (error) {
      console.error("OTP Verify Error:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-red-600 font-medium">
          Invalid request. Email missing.
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center">

      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/verotp.jpg')" }}
      />

      <div className="absolute top-0 left-0 w-full h-1/2 bg-black/40" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-200"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          Verify OTP & Set Password
        </h1>

        <p className="mb-6 text-center text-sm text-slate-600">
          Enter the OTP sent to your email and create your password
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full mb-4 bg-white text-slate-900 border border-slate-300 
                     px-4 py-3 rounded-xl placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 bg-white text-slate-900 border border-slate-300 
                     px-4 py-3 rounded-xl placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mb-3">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl
                     hover:bg-indigo-700 transition-all duration-300
                     hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>

        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> Please check your inbox and spam/junk folder for the OTP. 
          Create a strong password using uppercase letters, lowercase letters, 
          numbers, and special characters for better security.
        </div>

      </form>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
