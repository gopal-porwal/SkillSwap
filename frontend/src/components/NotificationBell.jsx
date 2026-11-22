import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import socket from "../socket"
import { Bell } from "lucide-react"

function NotificationBell() {

  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications/unread-count")
      setCount(res.data.data?.unread || 0)
    } catch (err) {
      console.error("Failed to fetch unread count")
    }
  }

  useEffect(() => {

    fetchUnread()

    socket.on("notification", () => {
      fetchUnread()
    })

    return () => {
      socket.off("notification")
    }

  }, [])

  return (

    <div
      className="relative cursor-pointer group"
      onClick={() => navigate("/notifications")}
    >

      {/* 🔔 Icon */}
      <div className="p-2 rounded-full hover:bg-gray-100 transition">
        <Bell className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition" />
      </div>

      {/* 🔴 Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold px-1 rounded-full shadow">
          {count}
        </span>
      )}

    </div>

  )
}

export default NotificationBell