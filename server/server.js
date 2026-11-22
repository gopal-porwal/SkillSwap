const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");

dotenv.config({ path: __dirname + "/.env" });
connectDB();

const app = express();
const server = http.createServer(app);

// 🔔 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🧠 Store online users (userId → socketId)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // User registers after login
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User registered:", userId);
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Make io + onlineUsers accessible in controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

app.use(cors());
app.use(express.json());

// 📜 Request Logging
app.use(morgan("dev"));

// 🔒 SECURITY MIDDLEWARES

// Secure HTTP headers
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

app.use("/api", limiter);

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const matchRoutes = require("./routes/matchRoutes");
app.use("/api/matches", matchRoutes);

const sessionRoutes = require("./routes/sessionRoutes");
app.use("/api/sessions", sessionRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const leaderboardRoutes = require("./routes/leaderboardRoutes");
app.use("/api/leaderboard", leaderboardRoutes);

// Global Error Handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Skill Swap Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});