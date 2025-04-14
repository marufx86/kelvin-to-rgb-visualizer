
import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, useGLTF, Loader } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceSceneProps {
  rgbArray: number[];
}

const OrbitalLight = ({ color }: { color: string }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      const t = clock.getElapsedTime() * 0.5;
      orbitRef.current.position.x = Math.sin(t) * 3;
      orbitRef.current.position.z = Math.cos(t) * 3;
    }
  });

  return (
    <group ref={orbitRef} position={[3, 0, 0]}>
      <pointLight ref={lightRef} intensity={2} color={color} distance={10} castShadow />
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

const Planet = ({ color }: { color: string }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3;
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group>
      {/* Planet - now made white to better show the colored light */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.8}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Ring - also made white/silver to better reflect the light */}
      <mesh ref={ringRef} castShadow receiveShadow>
        <torusGeometry args={[2, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          emissive={color} 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// SimpleScene component for fallback when WebGL fails
const SimpleScene = ({ color }: { color: string }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div 
          className="w-32 h-32 rounded-full mx-auto mb-4"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 30px 10px ${color}`
          }}
        ></div>
        <p className="text-white text-opacity-70">
          Simple representation (WebGL not available)
        </p>
      </div>
    </div>
  );
};

const SpaceScene: React.FC<SpaceSceneProps> = ({ rgbArray }) => {
  const colorString = `rgb(${rgbArray.join(',')})`;
  const [webGLFailed, setWebGLFailed] = useState(false);
  
  // Check if WebGL is available
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLFailed(true);
      }
    } catch (e) {
      setWebGLFailed(true);
    }
  }, []);
  
  if (webGLFailed) {
    return (
      <div className="w-full rounded-2xl h-64 sm:h-80 md:h-96 mb-8 relative overflow-hidden shadow-lg bg-black">
        <SimpleScene color={colorString} />
      </div>
    );
  }
  
  return (
    <div className="w-full rounded-2xl h-64 sm:h-80 md:h-96 mb-8 relative overflow-hidden shadow-lg">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white">Loading scene...</div>}>
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 6], fov: 45 }} 
          dpr={1} 
          gl={{ 
            antialias: true, 
            alpha: false, 
            stencil: false,
            depth: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
            logarithmicDepthBuffer: true 
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#030303');
            // Replace the deprecated outputEncoding with outputColorSpace
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
          performance={{ min: 0.1 }}
          frameloop="always"
        >
          <color attach="background" args={['#030303']} />
          <ambientLight intensity={0.1} />
          <Planet color={colorString} />
          <OrbitalLight color={colorString} />
          <Stars radius={100} depth={50} count={2500} factor={4} saturation={0.5} fade />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
          />
          <Environment preset="night" />
        </Canvas>
      </Suspense>
      <Loader />
    </div>
  );
};

export default SpaceScene;
