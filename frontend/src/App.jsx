import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Matches from "./pages/Matches"
import Sessions from "./pages/Sessions"
import Leaderboard from "./pages/Leaderboard"
import Profile from "./pages/Profile"
import Notifications from "./pages/Notifications"

import socket from "./socket"
import { jwtDecode } from "jwt-decode"

function App() {

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decoded = jwtDecode(token)
        const userId = decoded.id || decoded._id

        if (userId) {
          socket.emit("register", userId)
          console.log("🟢 Socket registered:", userId)
        }

      } catch (err) {
        console.error("Invalid token:", err)
      }
    }

  }, [])

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App