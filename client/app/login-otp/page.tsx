"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Invalid request. Email missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/api/auth/verify-login-otp`,
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
        setLoading(false);
        return;
      }

      if (data.role === "admin") {
        router.push("/admindashboard");
      } else {
        router.push("/employee-dashboard");
      }

    } catch (error) {
      console.error("OTP Verify Error:", error);
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  if (!email) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid request. Email missing.
      </p>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* TOP HALF */}
      <div className="absolute top-0 left-0 w-full h-1/2 
                      bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/emplogbg.jpg')" }}
        />
      </div>

      {/* BOTTOM HALF */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white" />

      {/* CENTER CARD */}
      <form
        onSubmit={handleVerify}
        className="relative z-10 w-full max-w-md rounded-3xl 
                   bg-white p-10 shadow-2xl
                   border border-slate-200"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
          Enter OTP
        </h1>

        <p className="mb-6 text-center text-sm text-slate-600">
          Enter the OTP sent to your email
        </p>

        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full bg-white text-slate-900
                     border border-slate-300 px-4 py-3 rounded-xl
                     placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-600
                     focus:border-indigo-600 transition"
        />

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
                     hover:shadow-lg disabled:opacity-50"
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
