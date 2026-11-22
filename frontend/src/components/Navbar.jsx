import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import NotificationBell from "./NotificationBell"

function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()

  const [darkMode, setDarkMode] = useState(false)

  // 🔥 sync initial theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDarkMode(isDark)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  // 🔥 FIXED toggle
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark")

    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDarkMode(true)
    }
  }

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Matches", path: "/matches" },
    { name: "Sessions", path: "/sessions" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Profile", path: "/profile" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 
        className="text-2xl font-extrabold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        SkillSwap
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition duration-200 ${
                location.pathname === link.path
                  ? "text-indigo-600 dark:text-yellow-400 font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-yellow-400"
              }`}
            >
              {link.name}
            </Link>
          ))}

        </div>

        {/* 🔥 Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-50 text-red-500 font-medium hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition"
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

export default Navbar