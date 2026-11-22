import { useNavigate } from "react-router-dom"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"

function HeroSection() {

  const navigate = useNavigate()

  return (

    <div className="bg-white">

      <BackgroundBeamsWithCollision className="py-16 md:py-20 flex items-start pt-12 md:pt-16 justify-center">

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight">
            Learn Skills.{" "}
            <span className="text-indigo-600">
              Teach Skills.
            </span>
            <br />
            Grow Together
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            SkillSwap connects learners and teachers to exchange knowledge.
            No money needed — just skills.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-7 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </button>

          </div>

          {/* Trust line */}
          <p className="mt-8 text-sm text-gray-500">
            Join learners exchanging skills worldwide 🌍
          </p>

        </div>

      </BackgroundBeamsWithCollision>

    </div>
  )
}

export default HeroSection