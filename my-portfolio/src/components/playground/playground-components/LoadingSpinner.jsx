import { motion } from 'motion/react';
import { useState } from 'react';

import './LoadingSpinner.css';

function LoadingSpinner() {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div className='spinners'>
            <div className='spinner-container'>
              <h4>Pixel Grid</h4>
              <div className='pixel-grid'>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {    
                      return (
                          <motion.div
                              key={i}
                              className='pixel'
                              animate={{
                                  scale: [0.2, 1.2, 0.2],
                                  opacity: [0.1, 1, 0.1],
                              }}
                              transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: i * 0.08,
                                  ease: [0.4, 0, 0.6, 1],
                              }}
                          />
                      );
                  })}
              </div>
            </div>

            <div className='spinner-container'>
              <h4>Radial</h4>
              <div className='radial-pixel-grid'>
                {Array.from({ length: 25 }, (_, i) => {    
                  
                  const rows = 5;
                  const cols = 5;

                  // convert into x, y coords
                  const x = i % cols
                  const y = Math.floor(i / cols)

                  // find center point
                  const centerX = (cols - 1) / 2
                  const centerY = (rows - 1) / 2

                  // calculate dist from center
                  const distance = Math.sqrt(
                    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                  )

                  return (
                    <motion.div
                      key={i}
                      className='radial-pixel'
                      animate={{
                        scale: [0.2, 1.2, 0.2],
                        opacity: [0.1, 1, 0.1],
                        
                      }}
                      transition={{
                        duration: 2.0,
                        repeat: Infinity,
                        delay: distance * 0.15,  // Tighter timing
                        ease: [0.4, 0, 0.6, 1],  // Custom bezier for smoother feel
                      }}
                    />
                      );
                  })}
              </div>
            </div>

            {/* Circular Rotating Spinner */}
            <div className='spinner-container'>
                <h4>Orbital</h4>
                <div className='circular-spinner'>
                    {Array.from({ length: 8 }, (_, i) => {
                        const angle = (i / 8) * 2 * Math.PI; // Convert to radians
                        const radius = 25;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        return (
                            <motion.div
                                key={i}
                                className='orbital-dot'
                                style={{
                                    position: 'absolute',
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                animate={{
                                    scale: [0.3, 1, 0.3],
                                    opacity: [0.2, 1, 0.2],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Wave Loading Bar */}
            <div className='spinner-container'>
                <h4>Wave Bar</h4>
                <div className='wave-bar'>
                    {Array.from({ length: 12 }, (_, i) => (
                        <motion.div
                            key={i}
                            className='wave-segment'
                            animate={{
                                scaleY: [0.3, 1.8, 0.3],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 1.0,
                                repeat: Infinity,
                                delay: i * 0.05,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Spiral Spinner */}
            <div className='spinner-container'>
                <h4>Spiral</h4>
                <div className='spiral-grid'>
                    {Array.from({ length: 16 }, (_, i) => {
                        // Create spiral pattern for 4x4 grid
                        const spiralOrder = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];
                        const spiralIndex = spiralOrder.indexOf(i);
                        
                        return (
                            <motion.div
                                key={i}
                                className='spiral-pixel'
                                animate={{
                                    scale: [0.1, 1.3, 0.1],
                                    rotate: [0, 180, 360],
                                    opacity: [0.1, 1, 0.1],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: spiralIndex * 0.1,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            />
                        );
                    })}
                </div>
            </div>

          

            {/* Matrix Rain Effect */}
            <div className='spinner-container'>
                <h4>Matrix</h4>
                <div className='matrix-grid'>
                    {Array.from({ length: 35 }, (_, i) => {
                        const col = i % 7;
                        const row = Math.floor(i / 7);
                        
                        return (
                            <motion.div
                                key={i}
                                className='matrix-pixel'
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: col * 0.1 + Math.random() * 0.5,
                                    ease: "linear",
                                }}
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    );
}

export default LoadingSpinner;