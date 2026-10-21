import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Project } from '@/types'
import { useTheme } from '@/context/ThemeContext'
import { SceneFallback } from './SceneFallback'

interface ProjectNodeProps {
  project: Project
  isSelected: boolean
  onSelect: (project: Project) => void
  reducedMotion: boolean
}

const ProjectNode: React.FC<ProjectNodeProps> = ({
  project,
  isSelected,
  onSelect,
  reducedMotion,
}) => {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const { x, y, z } = project.spatialCoords

  useFrame((state, delta) => {
    if (!meshRef.current) return
    if (!reducedMotion) {
      // Gentle floating oscillation
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = y + Math.sin(time + x * 2) * 0.12
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group
      ref={meshRef}
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(project)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      scale={isSelected ? 1.35 : hovered ? 1.2 : 1.0}
    >
      {/* Node Core Geometry */}
      <mesh castShadow>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={project.color}
          roughness={0.25}
          metalness={0.3}
          emissive={project.color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Orbit Halo Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.7, 0.015, 12, 48]} />
        <meshStandardMaterial
          color={project.color}
          transparent
          opacity={isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* Subtle pulsating beacon sphere */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

interface SpatialCanvasProps {
  projects: Project[]
  selectedProject: Project | null
  onSelectProject: (project: Project) => void
  reducedMotion?: boolean
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  reducedMotion = false,
}) => {
  const { resolvedTheme } = useTheme()
  const [webglSupported, setWebglSupported] = useState(true)

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    return <SceneFallback label="Spatial Canvas 2D Fallback" size={380} />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '440px',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(circle at center, #191B16 0%, #0E0F0C 100%)'
          : 'radial-gradient(circle at center, #FFFFFF 0%, #ECE9DF 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.8 : 1.1} />
        <directionalLight position={[5, 6, 5]} intensity={1.5} />
        <pointLight position={[-4, -3, -2]} color="#D5F47A" intensity={1.8} distance={12} />
        <pointLight position={[4, -2, 3]} color="#9D84FD" intensity={1.6} distance={12} />

        {/* Central Ambient Ring Grid */}
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[1.5, 3.8, 64]} />
          <meshBasicMaterial
            color={isDark ? '#2D3126' : '#DCD9CE'}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Floating Project Nodes */}
        {projects.map((p) => (
          <ProjectNode
            key={p.id}
            project={p}
            isSelected={selectedProject?.id === p.id}
            onSelect={onSelectProject}
            reducedMotion={reducedMotion}
          />
        ))}
      </Canvas>
    </div>
  )
}
