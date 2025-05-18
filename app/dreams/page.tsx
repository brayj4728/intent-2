import DreamsGallery from "@/dreams-gallery"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DreamsPage() {
  return (
    <main>
      <ErrorBoundary>
        <DreamsGallery />
      </ErrorBoundary>
    </main>
  )
}
