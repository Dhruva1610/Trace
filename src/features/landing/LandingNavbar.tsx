import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react'
import { TraceLogo } from '@/components/brand/TraceLogo'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'

export const LandingNavbar: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <TraceLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          <a
            href="#product"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            className="hover-text-primary"
          >
            Product
          </a>
          <a
            href="#features"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            className="hover-text-primary"
          >
            Features
          </a>
          <a
            href="#spatial"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            className="hover-text-primary"
          >
            Spatial View
          </a>
          <a
            href="#about"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            className="hover-text-primary"
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Primary CTA */}
          <Button
            variant="accent"
            size="md"
            iconRight={<ArrowRight size={16} />}
            onClick={() => navigate('/app')}
            className="hidden-mobile"
          >
            Enter workspace
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <a
            href="#product"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Product
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Features
          </a>
          <a
            href="#spatial"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Spatial View
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            About
          </a>
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <Button
              variant="accent"
              size="lg"
              style={{ width: '100%' }}
              iconRight={<ArrowRight size={18} />}
              onClick={() => {
                setMobileMenuOpen(false)
                navigate('/app')
              }}
            >
              Enter workspace
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
        .hover-text-primary:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </header>
  )
}
