import LandingNavbar from "../components/LandingNavbar"
import HeroSection from "../components/HeroSection"
import HowItWorks from "../components/HowItWorks"
import FeaturesSection from "../components/FeaturesSection"
import CTASection from "../components/CTASection"
import Footer from "../components/Footer"

function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default Home