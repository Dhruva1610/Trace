import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SceneFallback } from './SceneFallback'
import { useTheme } from '@/context/ThemeContext'
import { useWorkspace } from '@/context/WorkspaceContext'

interface OrbMeshProps {
  reducedMotion: boolean
  resolvedTheme: 'light' | 'dark'
}

const OrbScene: React.FC<OrbMeshProps> = ({ reducedMotion, resolvedTheme }) => {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const sat1Ref = useRef<THREE.Mesh>(null)
  const sat2Ref = useRef<THREE.Mesh>(null)

  // Responsive pointer tracking
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Smooth pointer tilt interpolation
    targetRotation.current.x = state.pointer.y * 0.35
    targetRotation.current.y = state.pointer.x * 0.45

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.05
    )

    if (!reducedMotion) {
      // Gentle core float
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.15
        coreRef.current.rotation.z += delta * 0.08
      }
      // Counter-rotating orbital rings
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += delta * 0.22
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.x += delta * 0.18
        ring2Ref.current.rotation.y -= delta * 0.12
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.y += delta * 0.28
      }
      // Orbiting satellites
      const time = state.clock.getElapsedTime()
      if (sat1Ref.current) {
        sat1Ref.current.position.x = Math.cos(time * 0.8) * 1.9
        sat1Ref.current.position.y = Math.sin(time * 0.8) * 0.8
        sat1Ref.current.position.z = Math.sin(time * 0.8) * 1.6
      }
      if (sat2Ref.current) {
        sat2Ref.current.position.x = Math.cos(time * -0.6 + 1.5) * 2.3
        sat2Ref.current.position.y = Math.sin(time * -0.6 + 1.5) * 1.4
        sat2Ref.current.position.z = Math.sin(time * -0.6) * 1.2
      }
    }
  })

  const isDark = resolvedTheme === 'dark'

  const coreColor = useMemo(() => {
    return isDark ? '#1C1F17' : '#F2EFE6'
  }, [isDark])

  const wireColor = useMemo(() => {
    return isDark ? '#32362C' : '#D1CEBF'
  }, [isDark])

  return (
    <group ref={groupRef}>
      {/* Dynamic Lighting */}
      <ambientLight intensity={isDark ? 0.9 : 1.2} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[-3, -2, -3]} intensity={2.0} color="#D5F47A" distance={10} />
      <pointLight position={[3, -1, 2]} intensity={1.8} color="#9D84FD" distance={9} />

      {/* Main Sculptural Core Sphere */}
      <mesh ref={coreRef} castShadow receiveShadow>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial
          color={coreColor}
          roughness={0.2}
          metalness={0.15}
          emissive={isDark ? '#161912' : '#E8E5DC'}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner geometric facets */}
      <mesh scale={[1.18, 1.18, 1.18]}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#D5F47A"
          wireframe
          transparent
          opacity={isDark ? 0.18 : 0.25}
        />
      </mesh>

      {/* Outer Orbital Ring 1 - Lime tinted */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.75, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#D5F47A"
          emissive="#D5F47A"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Orbital Ring 2 - Violet tinted */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.05, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#9D84FD"
          emissive="#9D84FD"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Outer Subtle Wire Frame Ring 3 */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[2.35, 0.008, 16, 100]} />
        <meshStandardMaterial color={wireColor} transparent opacity={0.6} />
      </mesh>

      {/* Orbiting Satellite Node 1 (Accent Lime) */}
      <mesh ref={sat1Ref} position={[1.9, 0, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial
          color="#D5F47A"
          emissive="#D5F47A"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Orbiting Satellite Node 2 (Violet) */}
      <mesh ref={sat2Ref} position={[-2.3, 0.5, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#9D84FD"
          emissive="#9D84FD"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  )
}

interface TraceOrbProps {
  className?: string
  height?: string | number
}

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('[TRACE WebGL] Handled WebGL error, falling back to 2D view:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export const TraceOrb: React.FC<TraceOrbProps> = ({
  className = '',
  height = '100%',
}) => {
  const { resolvedTheme } = useTheme()
  const { settings } = useWorkspace()
  const [webglSupported, setWebglSupported] = useState<boolean>(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    return <SceneFallback />
  }

  return (
    <div
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      <WebGLErrorBoundary fallback={<SceneFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        >
          <OrbScene
            reducedMotion={settings.reducedMotion}
            resolvedTheme={resolvedTheme}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}
