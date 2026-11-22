import { useNavigate } from "react-router-dom"

function LandingNavbar() {

  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold text-indigo-600 cursor-pointer"
      >
        SkillSwap
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Login */}
        <button
          onClick={() => navigate("/login")}
          className="px-3 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition"
        >
          Login
        </button>

        {/* Register */}
        <button
          onClick={() => navigate("/register")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          Get Started
        </button>

      </div>

    </nav>
  )
}

export default LandingNavbar