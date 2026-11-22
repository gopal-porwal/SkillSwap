import { Zap, Bell, Video, Trophy } from "lucide-react"

function FeaturesSection() {

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Smart Skill Matching",
      desc: "Find perfect partners based on what you can teach and learn."
    },
    {
      icon: <Bell className="w-6 h-6 text-indigo-600" />,
      title: "Real-time Notifications",
      desc: "Get instant updates for session requests and activities."
    },
    {
      icon: <Video className="w-6 h-6 text-indigo-600" />,
      title: "Seamless Video Sessions",
      desc: "Connect easily using Google Meet for smooth learning."
    },
    {
      icon: <Trophy className="w-6 h-6 text-indigo-600" />,
      title: "Ratings & Leaderboard",
      desc: "Earn ratings, badges, and climb the leaderboard."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800">
          Powerful Features 🚀
        </h2>

        <p className="text-gray-500 mt-2">
          Everything you need to learn and grow
        </p>

        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition"
            >

              {/* Icon */}
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-800">
                {feature.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-gray-500 mt-2">
                {feature.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default FeaturesSection