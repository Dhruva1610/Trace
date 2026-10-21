import React from 'react'
import { LandingNavbar } from './LandingNavbar'
import { HeroSection } from './HeroSection'
import { StatementSection } from './StatementSection'
import { ProductPreviewSection } from './ProductPreviewSection'
import { FeaturesSection } from './FeaturesSection'
import { SpatialPreviewSection } from './SpatialPreviewSection'
import { CtaSection } from './CtaSection'
import { LandingFooter } from './LandingFooter'

export const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingNavbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <StatementSection />
        <ProductPreviewSection />
        <FeaturesSection />
        <SpatialPreviewSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
