"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="flex min-h-screen overflow-hidden">
      
     
      <div
        className="relative hidden md:flex w-1/2 flex-col justify-center p-16 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-900/70 to-indigo-900/70"></div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Employee Attendance
            <br /> Automation System
          </h1>

          <p className="text-lg opacity-90 leading-relaxed">
            Smart attendance tracking with automated login,
            logout monitoring and real-time work hour analysis.
          </p>
        </div>
      </div>

      
      <div className="relative flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-6">

        <div
          className={`relative w-full max-w-md rounded-3xl 
          bg-gradient-to-br from-white via-slate-50 to-indigo-50 
          p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
          border border-slate-200
          transform transition-all duration-700 
          ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          hover:scale-[1.02]`}
        >
          
          <h2 className="mb-2 text-3xl font-bold text-slate-800 text-center">
            Welcome
          </h2>

          <p className="mb-8 text-center text-slate-600">
            Select your login type to continue
          </p>

          <div className="flex flex-col gap-5">

            <button
              onClick={() => router.push("/employeelogin")}
              className="rounded-lg bg-indigo-600 py-3 text-white font-medium shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1"
            >
              👨🏻‍💼 Employee Login
            </button>

            <button
              onClick={() => router.push("/adminlogin")}
              className="rounded-lg bg-slate-800 py-3 text-white font-medium shadow-md transition-all duration-300 hover:bg-slate-900 hover:shadow-xl hover:-translate-y-1"
            >
              🤖 Admin Login
            </button>

          </div>

          <p className="mt-8 text-xs text-center text-slate-500">
            © 2026 Employee Attendance System
          </p>
        </div>
      </div>
    </main>
  );
}
