/**
 * Linear interpolation between two colors
 */
export function interpolateColor(color1: number[], color2: number[], factor: number): number[] {
  // Ensure factor is between 0 and 1
  factor = Math.max(0, Math.min(1, factor));
  return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
}

/**
 * Get interpolated color based on Kelvin value
 */
export function getColorArray(kelvin: number): number[] {
  // Ensure kelvin is within our supported range
  kelvin = Math.max(1000, Math.min(10000, kelvin));
  
  // Define color points based on the reference image
  if (kelvin <= 2000) {
    // Deep amber/orange (1000K-2000K)
    return interpolateColor([255, 120, 0], [255, 147, 41], (kelvin - 1000) / 1000);
  } else if (kelvin <= 3000) {
    // Amber to yellow (2000K-3000K)
    return interpolateColor([255, 147, 41], [255, 180, 60], (kelvin - 2000) / 1000);
  } else if (kelvin <= 4000) {
    // Yellow to neutral white (3000K-4000K)
    return interpolateColor([255, 180, 60], [255, 220, 180], (kelvin - 3000) / 1000);
  } else if (kelvin <= 5000) {
    // Neutral white (4000K-5000K)
    return interpolateColor([255, 220, 180], [240, 240, 240], (kelvin - 4000) / 1000);
  } else if (kelvin <= 6000) {
    // Neutral to cool white (5000K-6000K)
    return interpolateColor([240, 240, 240], [220, 230, 255], (kelvin - 5000) / 1000);
  } else if (kelvin <= 7000) {
    // Cool white to light blue (6000K-7000K)
    return interpolateColor([220, 230, 255], [180, 210, 255], (kelvin - 6000) / 1000);
  } else if (kelvin <= 8000) {
    // Light blue to blue (7000K-8000K)
    return interpolateColor([180, 210, 255], [150, 180, 255], (kelvin - 7000) / 1000);
  } else if (kelvin <= 9000) {
    // Blue (8000K-9000K)
    return interpolateColor([150, 180, 255], [120, 150, 255], (kelvin - 8000) / 1000);
  } else {
    // Deep blue (9000K-10000K)
    return interpolateColor([120, 150, 255], [90, 120, 255], (kelvin - 9000) / 1000);
  }
}

/**
 * Convert RGB array to hexadecimal string
 */
export function rgbToHex(rgb: number[]): string {
  return "#" + rgb.map(c => {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}

/**
 * Convert RGB to HSV (Hue in degrees, Saturation and Value in percentage)
 */
export function rgbToHsv(r: number, g: number, b: number): number[] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  if (delta === 0) {
    h = 0;
  } else if (max === rNorm) {
    h = 60 * (((gNorm - bNorm) / delta) % 6);
  } else if (max === gNorm) {
    h = 60 * (((bNorm - rNorm) / delta) + 2);
  } else if (max === bNorm) {
    h = 60 * (((rNorm - gNorm) / delta) + 4);
  }
  
  if (h < 0) h += 360;
  
  const s = max === 0 ? 0 : (delta / max);
  const v = max;
  
  return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
}

/**
 * Convert RGB to HSL (Hue in degrees, Saturation and Lightness in percentage)
 */
export function rgbToHsl(r: number, g: number, b: number): number[] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;
  
  let s = 0;
  let h = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === rNorm) {
      h = ((gNorm - bNorm) / d) + (gNorm < bNorm ? 6 : 0);
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / d) + 2;
    } else if (max === bNorm) {
      h = ((rNorm - gNorm) / d) + 4;
    }
    
    h *= 60;
  }
  
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert RGB to Linear space (values normalized between 0 and 1)
 */
export function rgbToLinear(r: number, g: number, b: number): string[] {
  return [
    (r / 255).toFixed(3),
    (g / 255).toFixed(3),
    (b / 255).toFixed(3)
  ];
}

export type LightPreset = {
  name: string;
  rgb: string;
  rgbArray: number[];
  kelvin: number;
};

// Standard lighting presets
export const lightPresets: LightPreset[] = [
  {
    name: "1000K Light",
    rgb: "255, 120, 0",
    rgbArray: [255, 120, 0],
    kelvin: 1000
  },
  {
    name: "2000K Light",
    rgb: "255, 147, 41",
    rgbArray: [255, 147, 41],
    kelvin: 2000
  },
  {
    name: "3000K Light",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "4000K Light",
    rgb: "255, 220, 180",
    rgbArray: [255, 220, 180],
    kelvin: 4000
  },
  {
    name: "5000K Light",
    rgb: "240, 240, 240",
    rgbArray: [240, 240, 240],
    kelvin: 5000
  },
  {
    name: "6000K Light",
    rgb: "220, 230, 255",
    rgbArray: [220, 230, 255],
    kelvin: 6000
  },
  {
    name: "7000K Light",
    rgb: "180, 210, 255",
    rgbArray: [180, 210, 255],
    kelvin: 7000
  },
  {
    name: "8000K Light",
    rgb: "150, 180, 255",
    rgbArray: [150, 180, 255],
    kelvin: 8000
  },
  {
    name: "9000K Light",
    rgb: "120, 150, 255",
    rgbArray: [120, 150, 255],
    kelvin: 9000
  },
  {
    name: "10000K Light",
    rgb: "90, 120, 255",
    rgbArray: [90, 120, 255],
    kelvin: 10000
  },
  {
    name: "Candle",
    rgb: "255, 147, 41",
    rgbArray: [255, 147, 41],
    kelvin: 2000
  },
  {
    name: "40W Tungsten",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 2700
  },
  {
    name: "100W Tungsten",
    rgb: "255, 200, 120",
    rgbArray: [255, 200, 120],
    kelvin: 2800
  },
  {
    name: "Halogen",
    rgb: "255, 220, 180",
    rgbArray: [255, 220, 180],
    kelvin: 3200
  },
  {
    name: "Carbon Arc",
    rgb: "255, 230, 210",
    rgbArray: [255, 230, 210],
    kelvin: 3500
  },
  {
    name: "High Noon Sun",
    rgb: "240, 240, 240",
    rgbArray: [240, 240, 240],
    kelvin: 5000
  },
  {
    name: "Direct Sunlight",
    rgb: "220, 230, 255",
    rgbArray: [220, 230, 255],
    kelvin: 6000
  },
  {
    name: "Overcast Sky",
    rgb: "180, 210, 255",
    rgbArray: [180, 210, 255],
    kelvin: 7000
  },
  {
    name: "Clear Blue Sky",
    rgb: "120, 150, 255",
    rgbArray: [120, 150, 255],
    kelvin: 9000
  }
];

// Room-specific lighting presets with updated values based on provided specifications
export const roomPresets: LightPreset[] = [
  {
    name: "Dining Room - Soft White",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Bedroom - Very Warm",
    rgb: "255, 147, 41", 
    rgbArray: [255, 147, 41],
    kelvin: 2200
  },
  {
    name: "Bedroom - Warm White",
    rgb: "255, 170, 50",
    rgbArray: [255, 170, 50],
    kelvin: 2700
  },
  {
    name: "Bedroom - Soft White",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Kitchen - Warm",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Kitchen - Bright",
    rgb: "255, 230, 210",
    rgbArray: [255, 230, 210],
    kelvin: 3500
  },
  {
    name: "Bathroom - Warm",
    rgb: "255, 170, 50",
    rgbArray: [255, 170, 50],
    kelvin: 2700
  },
  {
    name: "Bathroom - Soft White",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Living Room - Very Warm",
    rgb: "255, 147, 41",
    rgbArray: [255, 147, 41],
    kelvin: 2200
  },
  {
    name: "Living Room - Warm",
    rgb: "255, 170, 50", 
    rgbArray: [255, 170, 50],
    kelvin: 2700
  },
  {
    name: "Living Room - Soft White",
    rgb: "255, 180, 60", 
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Outdoor - Warm White",
    rgb: "255, 170, 50",
    rgbArray: [255, 170, 50],
    kelvin: 2500
  },
  {
    name: "Outdoor - Soft White",
    rgb: "255, 180, 60",
    rgbArray: [255, 180, 60],
    kelvin: 3000
  },
  {
    name: "Outdoor - Natural White",
    rgb: "255, 220, 180",
    rgbArray: [255, 220, 180],
    kelvin: 4000
  }
];
