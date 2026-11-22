import { useEffect, useState } from "react"
import api from "../api/axios"
import Layout from "../layout/Layout"
import Loader from "../components/Loader"

function Leaderboard() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard/top-teachers")
      setUsers(res.data.data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader text="Loading leaderboard..." />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Leaderboard 🏆
          </h1>
          <p className="text-gray-500 mt-1">
            Top teachers based on ratings
          </p>
        </div>

        {!Array.isArray(users) || users.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow border text-center text-gray-500">
            No users yet
          </div>
        ) : (
          <>
            {/* 🔥 Top 3 */}
            <div className="grid md:grid-cols-3 gap-6">

              {users.slice(0, 3).map((user, index) => {

                const medal = ["🥇", "🥈", "🥉"][index]

                return (
                  <div
                    key={user._id}
                    className="bg-white p-6 rounded-2xl shadow border text-center hover:shadow-lg transition"
                  >
                    <div className="text-3xl mb-2">{medal}</div>

                    <p className="font-semibold text-lg text-gray-800">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      ⭐ {user.averageRating?.toFixed(1) || 0}
                    </p>

                    <p className="text-xs text-gray-400">
                      {user.totalRatings || 0} ratings
                    </p>
                  </div>
                )
              })}

            </div>

            {/* Rest */}
            <div className="bg-white p-6 rounded-2xl shadow border">

              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Other Rankings
              </h2>

              <div className="space-y-3">

                {users.slice(3).map((user, index) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition"
                  >

                    <div>
                      <p className="font-medium text-gray-800">
                        #{index + 4} {user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ⭐ {user.averageRating?.toFixed(1) || 0} | {user.totalRatings || 0} ratings
                      </p>
                    </div>

                    <div className="text-indigo-600 font-semibold">
                      Rank {index + 4}
                    </div>

                  </div>
                ))}

              </div>

            </div>
          </>
        )}

      </div>

    </Layout>
  )
}

export default Leaderboard