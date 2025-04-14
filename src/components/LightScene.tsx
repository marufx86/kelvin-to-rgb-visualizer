
import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useHelper, Environment, Loader } from '@react-three/drei';
import * as THREE from 'three';

interface LightSceneProps {
  rgbArray: number[];
}

const Bulb = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Enable the light helper only in development
  useHelper(process.env.NODE_ENV === 'development' ? lightRef : null, THREE.PointLightHelper, 0.5, 'white');
  
  return (
    <pointLight
      ref={lightRef}
      position={position}
      intensity={6}
      color={color}
      distance={10}
      castShadow
    />
  );
};

const Room = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
    </mesh>
  );
};

const Lamp = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Lamp base */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
      
      {/* Lamp pole */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Lamp shade - making it lighter colored and more translucent to better show the light color */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[1, 1, 32, 1, true]} />
        <meshStandardMaterial 
          color="#eee" 
          side={THREE.DoubleSide} 
          transparent 
          opacity={0.7} 
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Light bulb */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="white" 
          emissive={color} 
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  );
};

// Simple fallback when WebGL isn't available
const SimpleLightScene = ({ color }: { color: string }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-32 mx-auto mb-4">
          <div className="w-4 h-16 bg-gray-600 mx-auto"></div>
          <div 
            className="w-16 h-16 absolute -bottom-2 left-0 rounded-full"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 30px 10px ${color}`
            }}
          ></div>
        </div>
        <p className="text-white text-opacity-70">
          Simple representation (WebGL not available)
        </p>
      </div>
    </div>
  );
};

const LightScene: React.FC<LightSceneProps> = ({ rgbArray }) => {
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
        <SimpleLightScene color={colorString} />
      </div>
    );
  }
  
  return (
    <div className="w-full rounded-2xl h-64 sm:h-80 md:h-96 mb-8 relative overflow-hidden shadow-lg">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white">Loading scene...</div>}>
        <Canvas 
          shadows 
          camera={{ position: [5, 3, 5], fov: 50 }} 
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
            gl.setClearColor('#080808');
            // Replace the deprecated outputEncoding with outputColorSpace
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
          performance={{ min: 0.1 }}
          frameloop="demand"
        >
          <color attach="background" args={['#080808']} />
          <ambientLight intensity={0.4} />
          <Bulb position={[0, 1, 0]} color={colorString} />
          <Room />
          <Lamp color={colorString} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 - 0.1} minPolarAngle={Math.PI / 6} />
          <Environment preset="night" />
        </Canvas>
      </Suspense>
      <Loader />
    </div>
  );
};

export default LightScene;
