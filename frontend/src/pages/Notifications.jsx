import { useEffect, useState } from "react"
import api from "../api/axios"
import Layout from "../layout/Layout"
import socket from "../socket"
import Loader from "../components/Loader"

function Notifications() {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications")
      setNotifications(res.data.data.notifications || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`)

      setNotifications(prev =>
        prev.map(n =>
          n._id === id ? { ...n, isRead: true } : n
        )
      )
    } catch (err) {
      console.error("Failed to mark as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all")

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
    } catch (err) {
      console.error("Failed to mark all as read")
    }
  }

  useEffect(() => {

    fetchNotifications()

    socket.on("notification", () => {
      fetchNotifications()
    })

    return () => {
      socket.off("notification")
    }

  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader text="Loading notifications..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Notifications 🔔
            </h1>
            <p className="text-gray-500 text-sm">
              Stay updated with your activity
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Empty */}
        {notifications.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow border text-center text-gray-500">
            No notifications yet
          </div>
        ) : (

          <div className="space-y-3">

            {notifications.map(n => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition hover:shadow-md ${
                  n.isRead
                    ? "bg-white"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >

                {/* Message */}
                <p className="font-medium text-gray-800">
                  {n.message}
                </p>

                {/* Meta */}
                <div className="flex justify-between items-center mt-2">

                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {n.type}
                  </p>

                  {!n.isRead && (
                    <span className="text-xs font-medium text-indigo-600">
                      New
                    </span>
                  )}

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

    </Layout>
  )
}

export default Notifications