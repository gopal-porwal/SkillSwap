import { Users, Calendar, Award } from "lucide-react"

function HowItWorks() {

  const steps = [
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Find Your Match",
      desc: "Discover users who can teach what you want to learn."
    },
    {
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      title: "Schedule a Session",
      desc: "Book sessions and connect via Google Meet easily."
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Learn & Earn Badges",
      desc: "Complete sessions, rate each other, and earn rewards."
    }
  ]

  return (
    <section className="pt-5 pb-20 bg-white">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800">
          How SkillSwap Works
        </h2>

        <p className="text-gray-500 mt-2">
          Start learning in just a few simple steps
        </p>

        {/* Steps */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition"
            >

              {/* Icon */}
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-800">
                {step.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-gray-500 mt-2">
                {step.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default HowItWorks