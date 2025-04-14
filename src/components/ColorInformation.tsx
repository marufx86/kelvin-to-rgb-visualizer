
import React, { useState } from 'react';
import { rgbToHex, rgbToHsv, rgbToHsl, rgbToLinear } from '../utils/colorUtils';
import { motion } from 'framer-motion';
import { Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ColorInformationProps {
  kelvin: number;
  rgbArray: number[];
}

interface ExportData {
  kelvin: number;
  rgb: number[];
  hex: string;
  hsv: number[];
  hsl: number[];
  linear: string[];
}

const ColorInformation: React.FC<ColorInformationProps> = ({ kelvin, rgbArray }) => {
  const { toast } = useToast();
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const hexValue = rgbToHex(rgbArray);
  const hsvValue = rgbToHsv(rgbArray[0], rgbArray[1], rgbArray[2]);
  const hslValue = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]);
  const linearValue = rgbToLinear(rgbArray[0], rgbArray[1], rgbArray[2]);
  
  const exportData: ExportData = {
    kelvin,
    rgb: rgbArray,
    hex: hexValue,
    hsv: hsvValue,
    hsl: hslValue,
    linear: linearValue
  };
  
  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    
    toast({
      title: "Copied to clipboard",
      description: `${label}: ${value}`,
      duration: 2000,
    });
    
    setTimeout(() => setCopied(null), 2000);
  };
  
  const exportSettings = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(dataStr);
    
    toast({
      title: "Settings exported",
      description: "JSON data copied to clipboard",
      duration: 2000,
    });
    
    setShowExport(!showExport);
  };

  const getTemperatureCategory = (temp: number): string => {
    if (temp >= 2000 && temp <= 3500) return "Warm White";
    if (temp > 3500 && temp <= 5500) return "Daylight";
    return "Cool White";
  };
  
  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="text-base sm:text-lg font-medium mb-3">Temperature</h3>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl sm:text-2xl font-medium">{kelvin}K</span>
            <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-white/20">
              {getTemperatureCategory(kelvin)}
            </span>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
            <p className="mb-1">Warm White: 2000K - 3500K</p>
            <p className="mb-1">Daylight: 4000K - 5500K</p>
            <p>Cool White: 6000K - 10000K</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20 shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-base sm:text-lg font-medium mb-3">Color Values</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">RGB</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm">{rgbArray.join(', ')}</span>
                <button 
                  onClick={() => copyToClipboard(rgbArray.join(', '), "RGB")}
                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-all"
                >
                  {copied === "RGB" ? <Check size={14} className="sm:size-16" /> : <Copy size={14} className="sm:size-16" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">HEX</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm">{hexValue}</span>
                <button 
                  onClick={() => copyToClipboard(hexValue, "HEX")}
                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-all"
                >
                  {copied === "HEX" ? <Check size={14} className="sm:size-16" /> : <Copy size={14} className="sm:size-16" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="p-3 sm:p-4">
            <h4 className="text-xs sm:text-sm font-medium mb-2">HSV</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">{hsvValue.join(', ')}</span>
              <button 
                onClick={() => copyToClipboard(hsvValue.join(', '), "HSV")}
                className="p-1 rounded-full hover:bg-white/20 transition-all"
              >
                {copied === "HSV" ? <Check size={12} className="sm:size-14" /> : <Copy size={12} className="sm:size-14" />}
              </button>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            <h4 className="text-xs sm:text-sm font-medium mb-2">HSL</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">{hslValue.join(', ')}</span>
              <button 
                onClick={() => copyToClipboard(hslValue.join(', '), "HSL")}
                className="p-1 rounded-full hover:bg-white/20 transition-all"
              >
                {copied === "HSL" ? <Check size={12} className="sm:size-14" /> : <Copy size={12} className="sm:size-14" />}
              </button>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            <h4 className="text-xs sm:text-sm font-medium mb-2">Linear</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm">{linearValue.join(', ')}</span>
              <button 
                onClick={() => copyToClipboard(linearValue.join(', '), "Linear")}
                className="p-1 rounded-full hover:bg-white/20 transition-all"
              >
                {copied === "Linear" ? <Check size={12} className="sm:size-14" /> : <Copy size={12} className="sm:size-14" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-4 sm:mt-6">
        <button
          onClick={exportSettings}
          className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20 w-full"
        >
          <Download size={14} className="sm:size-16" />
          <span className="text-xs sm:text-sm">Export Settings</span>
        </button>
        
        {showExport && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <pre className="p-3 sm:p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 text-xs overflow-x-auto">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ColorInformation;
