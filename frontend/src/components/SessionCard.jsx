import { jwtDecode } from "jwt-decode"

function SessionCard({
  session,
  type,
  isReceiver,
  onAccept,
  onReject,
  onComplete,
  onUpload,
  onRatingChange,
  onSubmitRating,
  setSelectedFile,
  isRated
}) {

  const token = localStorage.getItem("token")
  let currentUserId = null

  if (token) {
    const decoded = jwtDecode(token)
    currentUserId = decoded.id || decoded._id
  }

  const isSender = String(session.sender?._id) === String(currentUserId)
  const otherUser = isSender ? session.receiver : session.sender

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition duration-300">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {otherUser?.name}
          </p>
          <p className="text-sm text-gray-500">
            {otherUser?.email}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ⭐ {otherUser?.averageRating || 0}
          </p>
        </div>

        <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusColor[session.status]}`}>
          {session.status}
        </span>
      </div>

      {/* Skill */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Skill
        </p>
        <p className="font-medium text-gray-800">
          {session.skill}
        </p>
      </div>

      {/* Role */}
      <p className="text-xs text-gray-400 mb-4">
        {isSender ? "You sent request" : "You received request"}
      </p>

      {/* ---------------- PENDING ---------------- */}
      {type === "pending" && isReceiver && (
        <div className="flex gap-3">

          <button
            onClick={onAccept}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
          >
            Accept
          </button>

          <button
            onClick={onReject}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Reject
          </button>

        </div>
      )}

      {/* ---------------- ACCEPTED ---------------- */}
      {type === "accepted" && (
        <div className="flex gap-3">

          {session.meetLink && (
            <a
              href={session.meetLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Join Meet
            </a>
          )}

          <button
            onClick={onComplete}
            className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition"
          >
            Mark Completed
          </button>

        </div>
      )}

      {/* ---------------- COMPLETED ---------------- */}
      {type === "completed" && (
        <div className="space-y-4">

          {/* Recording */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Recording
            </p>

            {session.recordingUrl ? (
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                View Recording
              </a>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  className="text-sm"
                  onChange={(e) =>
                    setSelectedFile(session._id, e.target.files[0])
                  }
                />

                <button
                  onClick={onUpload}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Upload Recording
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Rating
            </p>

            {!isRated ? (
              <div className="flex flex-col sm:flex-row gap-2">

                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  className="border p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) =>
                    onRatingChange(session._id, "ratingValue", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Comment"
                  className="border p-2 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) =>
                    onRatingChange(session._id, "commentValue", e.target.value)
                  }
                />

                <button
                  onClick={onSubmitRating}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
                >
                  Submit
                </button>

              </div>
            ) : (
              <p className="text-green-600 text-sm font-medium">
                You have already rated this session ✅
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default SessionCard