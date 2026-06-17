import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Sparkles, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

interface FighterModelProps {
  position: [number, number, number];
  color: string;
  isAttacking: boolean;
  isHit: boolean;
  isWinner: boolean;
  facing: number;
  label: string;
}

function FighterModel({ position, color, isAttacking, isHit, isWinner, facing, label }: FighterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const basePosition = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    if (!groupRef.current || !bodyMatRef.current) return;
    const time = state.clock.getElapsedTime();

    // Idle float
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.08;

    // Attack lunge
    const targetX = isAttacking
      ? basePosition.current.x + facing * 2.2
      : basePosition.current.x;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.18);

    // Victory jump
    if (isWinner) {
      groupRef.current.position.y = Math.abs(Math.sin(time * 4)) * 0.6;
    }

    // Hit flash + shake
    if (isHit) {
      bodyMatRef.current.emissive.setHex(0xff0000);
      bodyMatRef.current.emissiveIntensity = 3;
      groupRef.current.position.x += (Math.random() - 0.5) * 0.15;
    } else {
      const hex = parseInt(color.replace('#', ''), 16);
      bodyMatRef.current.emissive.setHex(hex);
      bodyMatRef.current.emissiveIntensity = isAttacking ? 1.5 : 0.6;
    }

    // Core pulse
    if (coreMatRef.current) {
      coreMatRef.current.opacity = 0.7 + Math.sin(time * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Legs */}
      <mesh position={[-0.15, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.15, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.38, 0.8, 6, 16]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.55, 1.05, 0]} rotation={[0, 0, 0.4]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.55, 1.05, 0]} rotation={[0, 0, -0.4]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.95} roughness={0.05} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Core Glow */}
      <mesh position={[0, 1.1, facing * 0.25]}>
        <octahedronGeometry args={[0.18]} />
        <meshBasicMaterial ref={coreMatRef} color={color} transparent opacity={0.8} />
      </mesh>
      {/* Weapon */}
      <mesh position={[facing * 0.7, 1.0, 0.1]} rotation={[0, 0, -facing * 0.7]}>
        <boxGeometry args={[0.06, 0.8, 0.06]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Point Light */}
      <pointLight color={color} intensity={isAttacking ? 4 : 2} distance={4} decay={2} />
    </group>
  );
}

function ArenaFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050508" metalness={0.8} roughness={0.4} />
      </mesh>
      <Grid
        infiniteGrid
        fadeDistance={25}
        sectionColor="#00f0ff"
        sectionThickness={1.2}
        cellColor="#ff00ff"
        cellThickness={0.4}
        cellSize={1}
        sectionSize={5}
        position={[0, 0, 0]}
      />
    </>
  );
}

function ArenaPillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.25, 5, 8]} />
        <meshStandardMaterial color="#0d0d14" metalness={0.9} roughness={0.2} emissive="#00f0ff" emissiveIntensity={0.1} />
      </mesh>
      <pointLight color="#00f0ff" intensity={0.8} distance={3} position={[0, 2.5, 0]} />
    </group>
  );
}

function VictoryExplosion({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <>
      <Sparkles count={80} scale={4} size={4} speed={1.5} opacity={1} color={color} position={position} />
      <pointLight color={color} intensity={10} distance={8} position={position} />
    </>
  );
}

interface ThreeArenaProps {
  battleState: 'idle' | 'approving' | 'finding_match' | 'attacking' | 'resolving' | 'finished';
  winner?: 'player' | 'opponent';
  playerHp?: number;
  opponentHp?: number;
}

export function ThreeArena({ battleState, winner, playerHp = 100, opponentHp = 100 }: ThreeArenaProps) {
  const isActive = battleState === 'attacking' || battleState === 'resolving';
  const isFinished = battleState === 'finished';

  const stateLabel: Record<string, string> = {
    idle: 'SELECT FIGHTER',
    approving: 'AUTHORIZING...',
    finding_match: 'SCANNING NETWORK...',
    attacking: 'COMBAT IN PROGRESS',
    resolving: 'RESOLVING...',
    finished: winner === 'player' ? 'VICTORY' : 'DEFEAT',
  };

  const stateColor: Record<string, string> = {
    idle: '#00f0ff',
    approving: '#ff00ff',
    finding_match: '#00f0ff',
    attacking: '#ff0040',
    resolving: '#ffe600',
    finished: winner === 'player' ? '#ffe600' : '#ff0040',
  };

  return (
    <div className="relative w-full h-[360px] md:h-[440px] bg-black border border-primary/30 overflow-hidden rounded-lg shadow-[0_0_40px_rgba(0,240,255,0.12)]">
      {/* Health Bars HUD */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-3 pointer-events-none">
        {/* Player HP */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-display text-primary tracking-widest">PLAYER</span>
            <span className="text-[9px] font-mono text-primary">{playerHp}%</span>
          </div>
          <div className="h-2 bg-white/10 border border-primary/30 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 shadow-[0_0_8px_#00f0ff]"
              style={{ width: `${playerHp}%` }}
            />
          </div>
        </div>
        {/* VS badge */}
        <div className="shrink-0 font-display text-xs font-bold text-white/60 bg-white/5 border border-white/10 px-2 py-1">VS</div>
        {/* Opponent HP */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-secondary">{opponentHp}%</span>
            <span className="text-[9px] font-display text-secondary tracking-widest">ENEMY</span>
          </div>
          <div className="h-2 bg-white/10 border border-secondary/30 overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-700 shadow-[0_0_8px_#ff00ff]"
              style={{ width: `${opponentHp}%`, marginLeft: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* State Label */}
      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div
          className="font-display text-[11px] tracking-[0.3em] px-4 py-1 border bg-black/60 backdrop-blur-sm"
          style={{ color: stateColor[battleState] || '#00f0ff', borderColor: `${stateColor[battleState]}44` }}
        >
          {stateLabel[battleState]}
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-20 mix-blend-overlay opacity-60" />

      <Canvas shadows camera={{ position: [0, 3.5, 8], fov: 50 }}>
        <color attach="background" args={['#040408']} />
        <fog attach="fog" args={['#040408', 8, 22]} />

        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[0, 6, 0]} color="#00f0ff" intensity={0.5} distance={15} />

        <ArenaFloor />

        {/* Pillars */}
        <ArenaPillar position={[-6, 2.5, -5]} />
        <ArenaPillar position={[6, 2.5, -5]} />
        <ArenaPillar position={[-6, 2.5, 3]} />
        <ArenaPillar position={[6, 2.5, 3]} />

        {/* Ambient Particles */}
        <Sparkles count={60} scale={14} size={1.5} speed={0.3} opacity={0.3} color="#00f0ff" />

        {/* Player Fighter */}
        <FighterModel
          position={[-3, 0, 0]}
          color="#00f0ff"
          facing={1}
          label="PLAYER"
          isAttacking={isActive && winner === 'player'}
          isHit={battleState === 'resolving' && winner === 'opponent'}
          isWinner={isFinished && winner === 'player'}
        />

        {/* Opponent Fighter */}
        <FighterModel
          position={[3, 0, 0]}
          color="#ff00ff"
          facing={-1}
          label="ENEMY"
          isAttacking={isActive && winner === 'opponent'}
          isHit={battleState === 'resolving' && winner === 'player'}
          isWinner={isFinished && winner === 'opponent'}
        />

        {/* Victory Explosion */}
        {isFinished && winner === 'player' && (
          <VictoryExplosion position={[-3, 1.5, 0]} color="#ffe600" />
        )}
        {isFinished && winner === 'opponent' && (
          <VictoryExplosion position={[3, 1.5, 0]} color="#ff00ff" />
        )}

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 5}
          autoRotate={battleState === 'idle'}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
