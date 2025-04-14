
import React from 'react';
import { motion } from 'framer-motion';
import KelvinVisualizer from '@/components/KelvinVisualizer';

const Index: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <KelvinVisualizer />
      
      <footer className="py-4 sm:py-6 text-center text-white/30 text-xs sm:text-sm">
        <p>made by Maruf Khan Ornob</p>
      </footer>
    </motion.div>
  );
};

export default Index;
