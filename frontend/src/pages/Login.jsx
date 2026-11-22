import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/login", {
        email,
        password
      })

      const token = res.data.data.token
      localStorage.setItem("token", token)

      navigate("/dashboard")

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue to SkillSwap
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login