// src/components/RatingBar.tsx

import React from 'react';
import { FaStar } from 'react-icons/fa'; 

interface RatingBarProps {
  star: number;
  percentage: number; // Phần trăm của rating này (0-100)
}

const RatingBar: React.FC<RatingBarProps> = ({ star, percentage }) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex items-center space-x-2 w-full">
      <div className="flex items-center space-x-1 min-w-max">
        <span className="text-xl font-bold">{star}</span>
        <FaStar className="text-yellow" size={20} /> {/* Màu vàng cho ngôi sao */}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue rounded-full" 
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>

      <span className="text-xl font-bold min-w-max">
        {clampedPercentage}%
      </span>
    </div>
  );
};

export default RatingBar;