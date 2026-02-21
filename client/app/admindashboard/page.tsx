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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/adminlogin");
      return;
    }
    fetchAttendance(token);
  }, []);

  const fetchAttendance = async (token: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/attendance/admin/attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        localStorage.removeItem("token");
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

  const handleExport = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/adminlogin");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/attendance/admin/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("token");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/adminlogin");
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/dashboardbg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 backdrop-blur-sm" />

      <div className="relative flex min-h-screen">

        <aside className="w-64 bg-white/90 backdrop-blur-xl shadow-xl p-8 hidden md:flex flex-col justify-between border-r border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600 mb-12">
              Admin Panel
            </h2>

            <nav className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-semibold shadow-sm">
                Dashboard
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                Attendance
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer">
                Reports
              </div>
            </nav>
          </div>

          <div className="text-xs text-slate-400 mt-10">
            © {new Date().getFullYear()} Attendance System
          </div>
        </aside>

        <main className="flex-1 p-10">

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

          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <SummaryCard title="Today Present" value={counts.present} accent="emerald" />
            <SummaryCard title="Today Late" value={counts.late} accent="yellow" />
            <SummaryCard title="Today Incomplete" value={counts.incomplete} accent="red" />
            <SummaryCard title="Today Absent" value={counts.absent} accent="slate" />
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
    <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200 transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50">
      <h3 className="text-slate-600 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColors[accent]}`}>
        {value}
      </p>
    </div>
  );
}
