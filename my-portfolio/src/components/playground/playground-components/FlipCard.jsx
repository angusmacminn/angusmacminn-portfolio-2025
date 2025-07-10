import { motion } from 'motion/react';
import { useState } from 'react';
import './FlipCard.css';

function FlipCard() {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div 
            className="flip-card-container"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="flip-card-inner"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="flip-card-front">
                    <h3>Hover Me</h3>
                </div>
                <div className="flip-card-back">
                    <h3>Surprise!</h3>
                </div>
            </motion.div>
        </div>
    );
}

export default FlipCard;