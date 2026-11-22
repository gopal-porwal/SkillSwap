function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-4 text-sm text-gray-500 font-medium tracking-wide">
        {text}
      </p>

    </div>
  )
}

export default Loader