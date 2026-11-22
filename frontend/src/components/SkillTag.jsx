function SkillTag({ label, color = "blue" }) {

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200"
  }

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        rounded-full
        text-xs font-medium
        border
        transition
        hover:scale-105
        ${colorClasses[color]}
      `}
    >
      {label}
    </span>
  )
}

export default SkillTag