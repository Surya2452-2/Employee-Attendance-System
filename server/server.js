const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const { protect, authorize } = require("./middleware/authMiddleware");
const { autoMarkAbsent } = require("./controllers/attendanceController");

const app = express();



app.set("trust proxy", 1);



app.use(helmet());


const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://employee-attendance-system-brown.vercel.app",
    ],
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());


connectDB()
  .then(() => {
    console.log("Database Connected");
    autoMarkAbsent(); 
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });


app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);


app.get(
  "/api/admin/test",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

app.get(
  "/api/user/test",
  protect,
  (req, res) => {
    res.json({
      message: "User authenticated",
      user: req.user,
    });
  }
);


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Attendance Backend Running",
  });
});


app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS Error: Origin not allowed",
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
