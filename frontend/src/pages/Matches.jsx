import { useEffect, useState } from "react"
import api from "../api/axios"
import Layout from "../layout/Layout"
import { jwtDecode } from "jwt-decode"
import Loader from "../components/Loader"
import SkillTag from "../components/SkillTag" // 🔥 ADD

function Matches() {

  const [matches, setMatches] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState(null)

  const token = localStorage.getItem("token")
  let currentUserId = null

  if (token) {
    const decoded = jwtDecode(token)
    currentUserId = decoded.id || decoded._id
  }

  useEffect(() => {

    const fetchData = async () => {
      try {

        const [matchRes, sessionRes] = await Promise.all([
          api.get("/matches"),
          api.get("/sessions/my")
        ])

        setMatches(matchRes.data.data)
        setSessions(sessionRes.data.data)

      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

  }, [])

  const getSessionStatus = (match) => {

    const skill = match.matchedLearnSkills[0]?.name

    const existing = sessions.find(s =>
      (
        (String(s.sender?._id) === String(currentUserId) &&
          String(s.receiver?._id) === String(match.userId)) ||

        (String(s.receiver?._id) === String(currentUserId) &&
          String(s.sender?._id) === String(match.userId))
      ) &&
      s.skill === skill
    )

    return existing?.status || null
  }

  const handleRequest = async (receiverId, skill) => {
    try {

      setSendingId(receiverId)

      await api.post("/sessions/request", {
        receiverId,
        skill
      })

      alert("Session request sent")

      const sessionRes = await api.get("/sessions/my")
      setSessions(sessionRes.data.data)

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Could not send request"

      alert(message)

    } finally {
      setSendingId(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <Loader text="Loading matches..." />
      </Layout>
    )
  }

  return (

    <Layout>

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Skill Matches 🔗
          </h1>
          <p className="text-gray-500 mt-1">
            Connect with users who match your learning goals
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow border">
            <p className="text-gray-500">
              No matches found 😔
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {matches.map((match) => {

              const status = getSessionStatus(match)

              let buttonText = "Request Session"
              let disabled = false
              let buttonStyle = "bg-indigo-600 hover:bg-indigo-700"

              if (status === "pending") {
                buttonText = "Pending"
                disabled = true
                buttonStyle = "bg-gray-400 cursor-not-allowed"
              }

              if (status === "accepted") {
                buttonText = "Ongoing"
                disabled = true
                buttonStyle = "bg-yellow-500 cursor-not-allowed"
              }

              return (

                <div
                  key={match.userId}
                  className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition duration-300"
                >

                  {/* User Info */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {match.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {match.email}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">

                    {/* Teach */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        They Teach
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchedLearnSkills.map((skill) => (
                          <SkillTag
                            key={skill._id}
                            label={skill.name}
                            color="blue"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Learn */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        They Want To Learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchedTeachSkills.map((skill) => (
                          <SkillTag
                            key={skill._id}
                            label={skill.name}
                            color="green"
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Action */}
                  <div className="mt-6">
                    <button
                      onClick={() =>
                        handleRequest(
                          match.userId,
                          match.matchedLearnSkills[0]?.name
                        )
                      }
                      disabled={disabled || sendingId === match.userId}
                      className={`w-full py-2.5 rounded-lg text-white font-medium transition ${buttonStyle} disabled:opacity-70`}
                    >
                      {sendingId === match.userId
                        ? "Sending..."
                        : buttonText}
                    </button>
                  </div>

                </div>

              )
            })}

          </div>

        )}

      </div>

    </Layout>

  )

}

export default Matches