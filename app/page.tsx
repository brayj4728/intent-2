import Gallery from "@/gallery"
import IntroScreenParallax from "@/intro-screen-parallax"
import DesignDiary from "@/design-diary"
import ExperienceSection from "@/experience-section"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage() {
  return (
    <main className="relative overflow-visible">
      <ErrorBoundary>
        <IntroScreenParallax />
      </ErrorBoundary>
      <ErrorBoundary>
        <Gallery />
      </ErrorBoundary>
      <ErrorBoundary>
        <DesignDiary />
      </ErrorBoundary>
      <ErrorBoundary>
        <ExperienceSection />
      </ErrorBoundary>
    </main>
  )
}
