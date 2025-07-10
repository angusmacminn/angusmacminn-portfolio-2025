import { motion } from 'motion/react';
import { useState } from 'react';

import './LoadingSpinner.css';

function LoadingSpinner() {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div className='spinners'>
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
    );
}

export default LoadingSpinner;