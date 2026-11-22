import { useNavigate } from "react-router-dom"

function Footer() {

  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Logo / About */}
        <div>
          <h2 className="text-xl font-bold text-white">
            SkillSwap
          </h2>
          <p className="text-sm mt-2 text-gray-400">
            Learn and teach skills with people around the world.
            Grow together without limits.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">

            <li
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:text-white transition"
            >
              Login
            </li>

            <li
              onClick={() => navigate("/register")}
              className="cursor-pointer hover:text-white transition"
            >
              Register
            </li>

          </ul>
        </div>

        {/* Extra */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            About
          </h3>

          <p className="text-sm text-gray-400">
            Built with ❤️ using MERN Stack.  
            Real-time learning platform for skill exchange.
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer