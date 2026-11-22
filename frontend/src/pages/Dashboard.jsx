import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Layout from "../layout/Layout"
import Loader from "../components/Loader"

function Dashboard() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile")
        setUser(res.data)
      } catch (err) {
        console.error("Profile fetch failed")
        localStorage.removeItem("token")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <Loader text="Loading dashboard..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's your learning overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800 mt-1">
              {user.email}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-semibold text-indigo-600 mt-1 text-lg">
              ⭐ {user.averageRating || 0}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Total Ratings</p>
            <p className="font-semibold text-gray-800 mt-1 text-lg">
              {user.totalRatings}
            </p>
          </div>

        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Teach */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Skills You Teach
            </h2>

            {user.skillsTeach?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsTeach.map((skill) => (
                  <span
                    key={skill._id}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No teaching skills added
              </p>
            )}
          </div>

          {/* Learn */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Skills You Want to Learn
            </h2>

            {user.skillsLearn?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsLearn.map((skill) => (
                  <span
                    key={skill._id}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No learning skills added
              </p>
            )}
          </div>

        </div>

        {/* Badges */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Badges 🏆
          </h2>

          {user.badges?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No badges yet
            </p>
          )}
        </div>

      </div>

    </Layout>
  )
}

export default Dashboard