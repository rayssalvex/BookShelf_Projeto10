"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface InteractiveRatingProps {
  initialRating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

export default function InteractiveRating({
  initialRating,
  onRatingChange,
  size = 24,
  readonly = false,
  showLabel = true,
  className = "",
}: InteractiveRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starRating: number) => {
    if (readonly) return;
    
    const newRating = rating === starRating ? 0 : starRating;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleStarHover = (starRating: number) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Muito ruim";
      case 2: return "Ruim";
      case 3: return "Regular";
      case 4: return "Bom";
      case 5: return "Excelente";
      default: return "Sem avaliação";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starRating) => (
          <motion.button
            key={starRating}
            type="button"
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            disabled={readonly}
            className={`transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            whileHover={readonly ? {} : { scale: 1.1 }}
            whileTap={readonly ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Star
              size={size}
              className={`transition-colors ${
                starRating <= displayRating
                  ? "text-yellow-400 fill-yellow-400"
                  : readonly
                  ? "text-gray-500"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
            />
          </motion.button>
        ))}
        
        {showLabel && (
          <motion.span 
            className="ml-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={displayRating}
          >
            {getRatingLabel(displayRating)}
          </motion.span>
        )}
      </div>
      
      {!readonly && hoverRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xs text-gray-500"
        >
          Clique para avaliar com {hoverRating} estrela{hoverRating > 1 ? 's' : ''}
        </motion.div>
      )}
    </div>
  );
}

