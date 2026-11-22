import { useEffect, useState } from "react"
import api from "../api/axios"
import Layout from "../layout/Layout"
import Loader from "../components/Loader"
import Badge from "../components/Badge"
import SkillTag from "../components/SkillTag"

function Profile() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    skillsTeach: "",
    skillsLearn: ""
  })

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile")

      const userData =
        res.data.data || res.data.user || res.data

      setUser(userData)

      setFormData({
        name: userData.name || "",
        skillsTeach: (userData.skillsTeach || [])
          .map(s => s.name || s)
          .join(", "),
        skillsLearn: (userData.skillsLearn || [])
          .map(s => s.name || s)
          .join(", ")
      })

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleUpdate = async () => {
    try {
      await api.put("/users/profile", {
        name: formData.name,
        skillsTeach: formData.skillsTeach
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        skillsLearn: formData.skillsLearn
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      })

      alert("Profile updated ✅")
      setIsEditing(false)
      fetchProfile()

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Update failed ❌")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader text="Loading profile..." />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12 text-gray-500">
          Failed to load profile
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Your Profile 👤
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your personal information and skills
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Mode */}
        {isEditing && (
          <div className="bg-white p-6 rounded-2xl shadow border space-y-4">

            <input
              type="text"
              value={formData.name}
              placeholder="Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              value={formData.skillsTeach}
              placeholder="Skills You Teach (comma separated)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, skillsTeach: e.target.value })
              }
            />

            <input
              type="text"
              value={formData.skillsLearn}
              placeholder="Skills You Learn (comma separated)"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) =>
                setFormData({ ...formData, skillsLearn: e.target.value })
              }
            />

            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition"
            >
              Save Changes
            </button>

          </div>
        )}

        {/* Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow border grid sm:grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold text-gray-800">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-semibold text-indigo-600">⭐ {(user.averageRating || 0).toFixed(2)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Ratings</p>
            <p className="font-semibold text-gray-800">{user.totalRatings}</p>
          </div>

        </div>

        {/* Skills */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Teach */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Skills You Teach
            </h2>

            {user.skillsTeach?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsTeach.map((skill, i) => (
                  <SkillTag key={i} label={skill.name || skill} color="blue" />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No skills added
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
                {user.skillsLearn.map((skill, i) => (
                  <SkillTag key={i} label={skill.name || skill} color="green" />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No skills added
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
              {user.badges.map((badge, i) => (
                <Badge key={i} label={badge} />
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

export default Profile