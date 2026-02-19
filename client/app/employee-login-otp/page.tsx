"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmployeeLoginOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      router.push("/employee-dashboard");
    } catch (error) {
      console.error(error);
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* 🔵 TOP HALF (Dark Corporate Gradient) */}
      <div className="absolute top-0 left-0 w-full h-1/2 
                       bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800" />

      {/* ⚪ BOTTOM HALF (Soft Light Gray) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-100" />

      {/* 🟢 WHITE CARD */}
      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md rounded-3xl 
         bg-white p-10 shadow-2xl border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Verify Login OTP
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl 
                     text-gray-900 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && (
          <p className="text-red-600 text-sm text-center mt-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl
                     hover:bg-indigo-700 transition-all duration-300
                     hover:shadow-lg hover:-translate-y-1
                     disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        {/* 📝 NOTE BLOCK ADDED BELOW BUTTON */}
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 text-center">
          <strong>Note:</strong> If OTP has not been received, please check your email inbox 
          and also check your spam/junk folder for the OTP.
        </div>

      </form>
    </main>
  );
}
