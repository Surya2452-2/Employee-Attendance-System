"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [counts, setCounts] = useState({
    present: 0,
    late: 0,
    incomplete: 0,
    absent: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/admin/attendance`,
        { credentials: "include" }
      );

      if (!res.ok) {
        router.push("/adminlogin");
        return;
      }

      const data = await res.json();
      setRecords(data);
      setFilteredRecords(data);
      animateCounts(data);
    } catch {
      router.push("/adminlogin");
    }
  };

  // 🔥 Today-only summary counts
  const animateCounts = (data: any[]) => {
    const today = new Date().toISOString().split("T")[0];

    const todayRecords = data.filter(
      (r) => new Date(r.date).toISOString().split("T")[0] === today
    );

    const totals = {
      present: todayRecords.filter(r => r.status === "Present").length,
      late: todayRecords.filter(r => r.status === "Late").length,
      incomplete: todayRecords.filter(r => r.status === "Incomplete").length,
      absent: todayRecords.filter(r => r.status === "Absent").length,
    };

    let step = 0;
    const steps = 20;

    const interval = setInterval(() => {
      step++;

      setCounts({
        present: Math.min(Math.round((totals.present / steps) * step), totals.present),
        late: Math.min(Math.round((totals.late / steps) * step), totals.late),
        incomplete: Math.min(Math.round((totals.incomplete / steps) * step), totals.incomplete),
        absent: Math.min(Math.round((totals.absent / steps) * step), totals.absent),
      });

      if (step >= steps) clearInterval(interval);
    }, 30);
  };

  // 🔍 Filtering
  useEffect(() => {
    let temp = records;

    if (search) {
      temp = temp.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedDate) {
      temp = temp.filter(
        (r) =>
          new Date(r.date).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredRecords(temp);
  }, [search, selectedDate, records]);

  // 📤 Export CSV
  const handleExport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/admin/export`,
        { credentials: "include" }
      );

      if (!response.ok) {
        router.push("/adminlogin");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance-report.csv";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleLogout = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      { method: "POST", credentials: "include" }
    );
    router.push("/");
  };

  return (
    <div className="relative min-h-screen">

      {/* 🌄 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/dashboardbg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 backdrop-blur-sm" />


      <div className="relative flex min-h-screen">

        {/* Sidebar */}
       {/* Sidebar */}
<aside className="w-64 bg-white/90 backdrop-blur-xl shadow-xl p-8 hidden md:flex flex-col justify-between border-r border-slate-200">

  <div>
    <h2 className="text-2xl font-bold text-indigo-600 mb-12">
      Admin Panel
    </h2>

    <nav className="space-y-4">

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
                      bg-indigo-100 text-indigo-700 font-semibold shadow-sm">
        📊 Dashboard
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
                      text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 
                      transition cursor-pointer">
        🗂 Attendance
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
                      text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 
                      transition cursor-pointer">
        📈 Reports
      </div>

      
    </nav>
  </div>

  {/* Footer */}
  <div className="text-xs text-slate-400 mt-10">
    © {new Date().getFullYear()} Attendance System
  </div>

</aside>


        {/* Main */}
        <main className="flex-1 p-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Today’s Attendance Overview
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <SummaryCard title="Today Present" value={counts.present} accent="emerald" />
            <SummaryCard title="Today Late" value={counts.late} accent="yellow" />
            <SummaryCard title="Today Incomplete" value={counts.incomplete} accent="red" />
            <SummaryCard title="Today Absent" value={counts.absent} accent="slate" />
          </div>

          {/* Filters + Export */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-300 px-4 py-2 rounded-xl
                           bg-white text-slate-900
                           focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-300 px-4 py-2 rounded-xl
                           bg-white text-slate-900 font-medium
                           focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
              />
            </div>

            <button
              onClick={handleExport}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-slate-200">
            <table className="w-full text-left text-sm">

              <thead className="bg-indigo-600 text-white uppercase tracking-wide shadow-md">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="px-4">Date</th>
                  <th className="px-4">Login</th>
                  <th className="px-4">Logout</th>
                  <th className="px-4">Hours</th>
                  <th className="px-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b transition duration-300 
                               hover:bg-indigo-50 
                               hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {r.name}
                    </td>

                    <td className="px-4 text-slate-700 font-medium">
                      {new Date(r.date).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 text-slate-800">
                      {r.loginTime
                        ? new Date(r.loginTime).toLocaleTimeString("en-IN")
                        : "-"}
                    </td>

                    <td className="px-4 text-slate-800">
                      {r.logoutTime
                        ? new Date(r.logoutTime).toLocaleTimeString("en-IN")
                        : "-"}
                    </td>

                    <td className="px-4 font-bold text-indigo-700 text-base">
                      {r.totalHours}
                    </td>

                    <td className="px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          r.status === "Present"
                            ? "bg-emerald-500 text-white"
                            : r.status === "Late"
                            ? "bg-yellow-400 text-yellow-900"
                            : r.status === "Incomplete"
                            ? "bg-red-500 text-white"
                            : r.status === "Absent"
                            ? "bg-slate-600 text-white"
                            : "bg-slate-300 text-slate-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, accent }: any) {
  const textColors: any = {
    emerald: "text-emerald-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    slate: "text-slate-700",
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200
                    transition duration-300 transform hover:-translate-y-1
                    hover:shadow-2xl hover:shadow-indigo-200/50">
      <h3 className="text-slate-600 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColors[accent]}`}>
        {value}
      </p>
    </div>
  );
}
