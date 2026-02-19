"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EmployeeVerifyOtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      setSuccess("Account verified successfully!");

      setTimeout(() => {
        router.push("/employeelogin");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
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
        bg-white p-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)]
        border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Verify OTP & Set Password
        </h1>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="w-full mb-4 border border-slate-300 px-4 py-3 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 border border-slate-300 px-4 py-3 rounded-xl
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
                     hover:shadow-xl hover:-translate-y-1
                     disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Create Account"}
        </button>
      </form>
    </main>
  );
}

export default function EmployeeVerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <EmployeeVerifyOtpContent />
    </Suspense>
  );
}
