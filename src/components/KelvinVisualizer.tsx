import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LightScene from './LightScene';
import SpaceScene from './SpaceScene';
import ColorInformation from './ColorInformation';
import PresetTable from './PresetTable';
import { getColorArray, lightPresets, roomPresets, LightPreset } from '../utils/colorUtils';

// Scenes that we have available to display
const SCENES = {
  SPACE: 'space',
  ROOM: 'room',
  FLAT: 'flat'
};

const KelvinVisualizer: React.FC = () => {
  const [kelvin, setKelvin] = useState(4000);
  const [rgbArray, setRgbArray] = useState<number[]>([255, 220, 180]);
  const [activeScene, setActiveScene] = useState(SCENES.ROOM); // Default scene
  
  useEffect(() => {
    // Update RGB values when Kelvin changes
    const newRgbArray = getColorArray(kelvin);
    setRgbArray(newRgbArray);
  }, [kelvin]);
  
  const handleKelvinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKelvin(parseInt(e.target.value));
  };
  
  const handlePresetSelect = (preset: LightPreset) => {
    setRgbArray(preset.rgbArray);
    setKelvin(preset.kelvin);
  };

  const renderCurrentScene = () => {
    switch (activeScene) {
      case SCENES.SPACE:
        return <SpaceScene rgbArray={rgbArray} />;
      case SCENES.ROOM:
        return <LightScene rgbArray={rgbArray} />;
      case SCENES.FLAT:
        return (
          <div 
            className="w-full rounded-2xl h-64 sm:h-80 md:h-96 mb-8 relative overflow-hidden"
            style={{
              boxShadow: `0px 0px 50px 10px rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, 0.5)`,
              backgroundColor: `rgb(${rgbArray.join(',')})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 rounded-2xl" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-b-2xl" />
          </div>
        );
      default:
        return <LightScene rgbArray={rgbArray} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-10 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Kelvin Light Visualizer
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60">
          Convert Kelvin temperature to RGB, HEX, and visualize lighting effects
        </p>
      </motion.header>
      
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2 bg-zinc-800/50 p-1 rounded-full">
          <button 
            onClick={() => setActiveScene(SCENES.ROOM)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              activeScene === SCENES.ROOM 
                ? 'bg-zinc-700 text-white shadow-inner' 
                : 'text-white/80 hover:bg-zinc-700/50'
            } transition-colors`}
          >
            Room Scene
          </button>
          <button 
            onClick={() => setActiveScene(SCENES.SPACE)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              activeScene === SCENES.SPACE 
                ? 'bg-zinc-700 text-white shadow-inner' 
                : 'text-white/80 hover:bg-zinc-700/50'
            } transition-colors`}
          >
            Space Scene
          </button>
          <button 
            onClick={() => setActiveScene(SCENES.FLAT)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              activeScene === SCENES.FLAT 
                ? 'bg-zinc-700 text-white shadow-inner' 
                : 'text-white/80 hover:bg-zinc-700/50'
            } transition-colors`}
          >
            2D View
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {renderCurrentScene()}
      </motion.div>
      
      <motion.div
        className="mb-6 sm:mb-8 py-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-medium">1000K</span>
          <span className="text-sm font-medium">10000K</span>
        </div>
        <input
          type="range"
          min="1000"
          max="10000"
          step="100"
          value={kelvin}
          onChange={handleKelvinChange}
          className="light-slider w-full"
        />
        <div className="mt-2 flex justify-between items-center text-xs text-white/60">
          <span>Warm</span>
          <span>Neutral</span>
          <span>Cool</span>
        </div>
      </motion.div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <ColorInformation kelvin={kelvin} rgbArray={rgbArray} />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 sm:mt-16"
      >
        <PresetTable 
          presets={lightPresets} 
          roomPresets={roomPresets}
          onSelectPreset={handlePresetSelect} 
        />
      </motion.div>
    </div>
  );
};

export default KelvinVisualizer;
