import { useEffect, useState } from "react"
import api from "../api/axios"
import Layout from "../layout/Layout"
import { jwtDecode } from "jwt-decode"
import SessionCard from "../components/SessionCard"
import Loader from "../components/Loader"

function Sessions() {

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState({})
  const [ratings, setRatings] = useState({})
  const [ratedSessions, setRatedSessions] = useState({})

  const token = localStorage.getItem("token")
  let currentUserId = null

  if (token) {
    const decoded = jwtDecode(token)
    currentUserId = decoded.id || decoded._id
  }

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions/my")
      setSessions(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const respondSession = async (sessionId, action) => {
    try {
      await api.put("/sessions/respond", { sessionId, action })
      fetchSessions()
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong")
    }
  }

  const completeSession = async (sessionId) => {
    try {
      await api.put("/sessions/complete", { sessionId })
      fetchSessions()
    } catch (err) {
      alert("Failed to complete session")
    }
  }

  const uploadRecording = async (sessionId) => {
    try {
      const file = selectedFiles[sessionId]

      if (!file) {
        alert("Please select a file")
        return
      }

      const formData = new FormData()
      formData.append("recording", file)
      formData.append("sessionId", sessionId)

      await api.post("/sessions/upload-recording", formData)
      fetchSessions()

    } catch (err) {
      alert("Upload failed")
    }
  }

  const submitRating = async (sessionId) => {
    try {
      const { ratingValue, commentValue } = ratings[sessionId] || {}

      await api.post("/sessions/rate", {
        sessionId,
        rating: Number(ratingValue),
        comment: commentValue
      })

      alert("Rating submitted")

      setRatedSessions(prev => ({
        ...prev,
        [sessionId]: true
      }))

      fetchSessions()

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong")
    }
  }

  const handleRatingChange = (id, field, value) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleFileChange = (id, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [id]: file
    }))
  }

  const pending = sessions.filter(s => s.status === "pending")
  const accepted = sessions.filter(s => s.status === "accepted")
  const completed = sessions.filter(s => s.status === "completed")

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader text="Loading sessions..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Your Sessions 🎯
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your learning and teaching sessions
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Pending Sessions
          </h2>

          {pending.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No pending sessions
            </p>
          ) : (
            <div className="space-y-4">
              {pending.map(s => {
                const isReceiver =
                  String(s.receiver?._id) === String(currentUserId)

                return (
                  <SessionCard
                    key={s._id}
                    session={s}
                    type="pending"
                    isReceiver={isReceiver}
                    onAccept={() => respondSession(s._id, "accepted")}
                    onReject={() => respondSession(s._id, "rejected")}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Accepted */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Accepted Sessions
          </h2>

          {accepted.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No accepted sessions
            </p>
          ) : (
            <div className="space-y-4">
              {accepted.map(s => (
                <SessionCard
                  key={s._id}
                  session={s}
                  type="accepted"
                  onComplete={() => completeSession(s._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Completed Sessions
          </h2>

          {completed.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No completed sessions
            </p>
          ) : (
            <div className="space-y-4">
              {completed.map(s => (
                <SessionCard
                  key={s._id}
                  session={s}
                  type="completed"
                  setSelectedFile={handleFileChange}
                  onUpload={() => uploadRecording(s._id)}
                  onRatingChange={handleRatingChange}
                  onSubmitRating={() => submitRating(s._id)}
                  isRated={ratedSessions[s._id]}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </Layout>
  )
}

export default Sessions