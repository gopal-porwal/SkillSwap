import Navbar from "../components/Navbar"

function Layout({ children }) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  )

}

export default Layout