"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/my`,
        { credentials: "include" }
      );

      if (!res.ok) {
        router.push("/employeelogin");
        return;
      }

      const data = await res.json();
      setRecords(data);

      const today = new Date();

      const todayData = data.find((r: any) => {
        const recordDate = new Date(r.date);
        return (
          recordDate.getFullYear() === today.getFullYear() &&
          recordDate.getMonth() === today.getMonth() &&
          recordDate.getDate() === today.getDate()
        );
      });

      setTodayRecord(todayData || null);

    } catch {
      router.push("/employeelogin");
    }
  };

  const markLogin = async () => {
    setLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/login`,
      { method: "POST", credentials: "include" }
    );
    await fetchAttendance();
    setLoading(false);
  };

  const markLogout = async () => {
    setLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logout`,
      { method: "POST", credentials: "include" }
    );
    await fetchAttendance();
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      { method: "POST", credentials: "include" }
    );
    router.push("/");
  };

  const getTodayStatus = () => {
    if (!todayRecord) return "Absent";
    if (todayRecord.totalHours >= 8) return "Present";
    if (todayRecord.logoutTime && todayRecord.totalHours < 8)
      return "Incomplete";
    return "Present";
  };

  const badgeColor = (status: string) => {
    if (status === "Present")
      return "bg-emerald-100 text-emerald-700 animate-pulse";
    if (status === "Incomplete")
      return "bg-red-100 text-red-700 animate-pulse";
    return "bg-gray-200 text-gray-700";
  };

  const status = getTodayStatus();

  return (
    <main className="relative min-h-screen p-6 md:p-10 overflow-hidden">

      {/* 🌌 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7')",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-indigo-900/60 to-black/70 backdrop-blur-sm" />

      <div className="relative z-10">

        {/* HEADER */}
        <div className="bg-white/95 shadow-xl rounded-2xl p-6 flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Employee Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor your attendance and work hours
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition">
            <p className="text-sm text-slate-500 mb-2">Today Status</p>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${badgeColor(status)}`}>
              {status}
            </span>
          </div>

          <div className="bg-white shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition">
            <p className="text-sm text-slate-500 mb-2">Total Hours Today</p>
            <h2 className="text-3xl font-bold text-indigo-600 transition-all duration-500">
              {todayRecord?.totalHours ?? 0} hrs
            </h2>
          </div>

          <div className="bg-white shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition">
            <p className="text-sm text-slate-500 mb-2">Login Time</p>
            <h2 className="text-lg font-semibold text-slate-800">
              {todayRecord?.loginTime
                ? new Date(todayRecord.loginTime).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not Marked"}
            </h2>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={markLogin}
            disabled={loading || todayRecord?.loginTime}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Mark Attendance"}
          </button>

          <button
            onClick={markLogout}
            disabled={loading || !todayRecord?.loginTime || todayRecord?.logoutTime}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Mark Logout"}
          </button>
        </div>

        {/* ATTENDANCE HISTORY */}
        <div className="bg-white shadow-2xl rounded-2xl p-6">

          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Attendance History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-200 text-slate-800 uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="px-4">Login</th>
                  <th className="px-4">Logout</th>
                  <th className="px-4">Hours</th>
                  <th className="px-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {records.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No attendance records yet.
                    </td>
                  </tr>
                )}

                {records.map((r) => {
                  const rowStatus = (() => {
  if (!r.loginTime) return "Absent";
  if (r.loginTime && !r.logoutTime) return "Present";
  if (r.totalHours >= 8) return "Present";
  if (r.logoutTime && r.totalHours < 8) return "Incomplete";
  return "Absent";
})();


                  return (
                    <tr
                      key={r._id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition duration-200"
                    >
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {new Date(r.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-4 text-slate-800 font-medium">
                        {r.loginTime
                          ? new Date(r.loginTime).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </td>

                      <td className="px-4 text-slate-800 font-medium">
                        {r.logoutTime
                          ? new Date(r.logoutTime).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </td>

                      <td className="px-4 font-bold text-indigo-600">
                        {r.totalHours}
                      </td>

                      <td className="px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(rowStatus)}`}>
                          {rowStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
