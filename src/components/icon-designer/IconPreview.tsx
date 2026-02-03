import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { IconConfig } from '@/types/assets';

interface IconPreviewProps {
  config: IconConfig;
  size?: number;
  isDark?: boolean;
}

export function IconPreview({ config, size = 200, isDark = false }: IconPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Pre-load image when sourceValue changes
  useEffect(() => {
    if (config.sourceType === 'image' && config.sourceValue.startsWith('data:')) {
      const img = new Image();
      img.onload = () => setLoadedImage(img);
      img.src = config.sourceValue;
    } else {
      setLoadedImage(null);
    }
  }, [config.sourceType, config.sourceValue]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background
    drawBackground(ctx, config, size);

    // Apply shape mask
    applyShapeMask(ctx, config.shape, size);

    // Draw content
    drawContent(ctx, config, size, loadedImage);

    // Draw badge if enabled
    if (config.hasBadge) {
      drawBadge(ctx, config.badgeColor, size);
    }
  }, [config, size, loadedImage]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const drawBackground = (ctx: CanvasRenderingContext2D, config: IconConfig, size: number) => {
    ctx.save();
    
    switch (config.backgroundType) {
      case 'color':
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, size, size);
        break;
        
      case 'gradient': {
        const gradient = createGradient(ctx, config.gradient.direction, size);
        config.gradient.colors.forEach((color, i) => {
          gradient.addColorStop(i / (config.gradient.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        break;
      }

      case 'mesh': {
        // Simplified mesh gradient using radial gradients
        ctx.fillStyle = config.mesh.colors[0];
        ctx.fillRect(0, 0, size, size);
        
        config.mesh.colors.forEach((color, i) => {
          const x = (i % 2) * size;
          const y = Math.floor(i / 2) * size;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.8);
          gradient.addColorStop(0, color + '80');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
        });
        break;
      }

      case 'texture':
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, size, size);
        // Add noise texture
        addNoiseTexture(ctx, size);
        break;

      case 'none':
        // Checkerboard pattern for transparency
        const squareSize = size / 10;
        for (let x = 0; x < size; x += squareSize) {
          for (let y = 0; y < size; y += squareSize) {
            ctx.fillStyle = ((x + y) / squareSize) % 2 === 0 ? '#ffffff' : '#e5e5e5';
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
        break;
    }
    
    ctx.restore();
  };

  const createGradient = (ctx: CanvasRenderingContext2D, direction: string, size: number) => {
    const coords: Record<string, [number, number, number, number]> = {
      'to-b': [size/2, 0, size/2, size],
      'to-t': [size/2, size, size/2, 0],
      'to-r': [0, size/2, size, size/2],
      'to-l': [size, size/2, 0, size/2],
      'to-br': [0, 0, size, size],
      'to-bl': [size, 0, 0, size],
      'to-tr': [0, size, size, 0],
      'to-tl': [size, size, 0, 0],
    };
    const [x0, y0, x1, y1] = coords[direction] || coords['to-br'];
    return ctx.createLinearGradient(x0, y0, x1, y1);
  };

  const addNoiseTexture = (ctx: CanvasRenderingContext2D, size: number) => {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const applyShapeMask = (ctx: CanvasRenderingContext2D, shape: string, size: number) => {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    
    switch (shape) {
      case 'square':
        ctx.rect(0, 0, size, size);
        break;
      case 'squircle': {
        const radius = size * 0.22;
        ctx.roundRect(0, 0, size, size, radius);
        break;
      }
      case 'circle':
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        break;
      case 'themed': {
        // Hexagon-ish shape for themed
        const cx = size / 2;
        const cy = size / 2;
        const r = size / 2;
        ctx.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
        for (let i = 1; i <= 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        break;
      }
    }
    
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawContent = (ctx: CanvasRenderingContext2D, config: IconConfig, size: number, preloadedImage: HTMLImageElement | null) => {
    const padding = config.effect === 'padding' ? config.paddingPercent / 100 : 0;
    const contentSize = size * (1 - padding * 2);
    const offset = size * padding;

    ctx.save();
    ctx.translate(offset, offset);

    switch (config.sourceType) {
      case 'text':
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${contentSize * 0.6}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, contentSize/2, contentSize/2);
        break;

      case 'clipart':
        ctx.font = `${contentSize * 0.6}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, contentSize/2, contentSize/2);
        break;

      case 'image':
        if (preloadedImage) {
          ctx.drawImage(preloadedImage, 0, 0, contentSize, contentSize);
        }
        break;

      case 'icon':
      default:
        // Icon rendering is handled by SVG overlay - don't draw anything on canvas
        break;
    }

    ctx.restore();
  };

  const drawBadge = (ctx: CanvasRenderingContext2D, color: string, size: number) => {
    const badgeSize = size * 0.25;
    const x = size - badgeSize - size * 0.05;
    const y = size * 0.05;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + badgeSize/2, y + badgeSize/2, badgeSize/2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Render Lucide icon as SVG overlay
  const renderIconOverlay = () => {
    if (config.sourceType !== 'icon') return null;
    
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[config.sourceValue];
    if (!IconComponent) return null;

    const padding = config.effect === 'padding' ? config.paddingPercent / 100 : 0;
    const iconSize = size * (1 - padding * 2) * 0.5;
    const offset = (size - iconSize) / 2;

    return (
      <div 
        className="absolute pointer-events-none"
        style={{ 
          top: offset, 
          left: offset, 
          width: iconSize, 
          height: iconSize,
        }}
      >
        <IconComponent size={iconSize} color="#FFFFFF" />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative inline-flex items-center justify-center"
      style={{ 
        width: size + 16, 
        height: size + 16,
        backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
        borderRadius: 8,
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="block"
          style={{ 
            borderRadius: config.shape === 'circle' ? '50%' : config.shape === 'squircle' ? '22%' : 0,
          }}
        />
        {renderIconOverlay()}
      </div>
    </motion.div>
  );
}
