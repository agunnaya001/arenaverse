import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

interface FighterModelProps {
  position: [number, number, number];
  color: string;
  isAttacking: boolean;
  isHit: boolean;
  facing: number;
}

function FighterModel({ position, color, isAttacking, isHit, facing }: FighterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Animation state
  const basePosition = useRef(new THREE.Vector3(...position));
  
  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;

    // Bobbing animation
    const time = state.clock.getElapsedTime();
    
    if (isAttacking) {
      // Lunge forward
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, 
        basePosition.current.x + (facing * 2), 
        0.2
      );
    } else {
      // Return to base
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, 
        basePosition.current.x, 
        0.1
      );
    }

    // Hit flash effect
    if (isHit) {
      materialRef.current.emissive.setHex(0xff0000);
      materialRef.current.emissiveIntensity = 2;
      groupRef.current.position.x += (Math.random() - 0.5) * 0.1; // Shake
    } else {
      materialRef.current.emissive.setHex(parseInt(color.replace('#', '0x')));
      materialRef.current.emissiveIntensity = 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Body */}
        <mesh position={[0, 1, 0]} castShadow>
          <capsuleGeometry args={[0.4, 1, 4, 16]} />
          <meshStandardMaterial 
            ref={materialRef}
            color="#222" 
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Core Glow */}
        <mesh position={[0, 1.2, facing * 0.2]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color={color} />
        </mesh>

        <pointLight position={[0, 1, 0]} color={color} intensity={2} distance={3} />
      </group>
    </Float>
  )
}

interface ThreeArenaProps {
  battleState: 'idle' | 'approving' | 'finding_match' | 'attacking' | 'resolving' | 'finished';
  winner?: 'player' | 'opponent';
}

export function ThreeArena({ battleState, winner }: ThreeArenaProps) {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-black border border-primary/30 relative overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.1)]">
      {/* Overlay UI elements could go here */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      
      <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
        <color attach="background" args={['#050508']} />
        <fog attach="fog" args={['#050508', 5, 20]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        
        {/* Neon Grid Floor */}
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="#00f0ff" 
          sectionThickness={1}
          cellColor="#ff00ff"
          cellThickness={0.5}
          position={[0, -0.01, 0]}
        />
        
        {/* Particles */}
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#00f0ff" />

        {/* Player Fighter (Left, Cyan) */}
        <FighterModel 
          position={[-3, 0, 0]} 
          color="#00f0ff" 
          facing={1}
          isAttacking={battleState === 'attacking' && winner === 'player'}
          isHit={battleState === 'resolving' && winner === 'opponent'}
        />

        {/* Opponent Fighter (Right, Magenta) */}
        <FighterModel 
          position={[3, 0, 0]} 
          color="#ff00ff" 
          facing={-1}
          isAttacking={battleState === 'attacking' && winner === 'opponent'}
          isHit={battleState === 'resolving' && winner === 'player'}
        />

        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] z-20 mix-blend-overlay" />
    </div>
  )
}
