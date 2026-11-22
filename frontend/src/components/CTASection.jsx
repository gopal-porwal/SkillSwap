import { useNavigate } from "react-router-dom"

function CTASection() {

  const navigate = useNavigate()

  return (
    <section className="py-20 bg-indigo-600">

      <div className="max-w-4xl mx-auto px-6 text-center text-white">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold">
          Start Your Skill Journey Today 🚀
        </h2>

        {/* Subtext */}
        <p className="mt-4 text-indigo-100">
          Join SkillSwap and connect with learners around the world.
          Teach what you know, learn what you love.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow"
          >
            Get Started Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg font-semibold border border-white text-white hover:bg-white hover:text-indigo-600 transition"
          >
            Login
          </button>

        </div>

      </div>

    </section>
  )
}

export default CTASection