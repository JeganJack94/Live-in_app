import React from 'react';

interface ProgressCircleProps {
  percent: number;
  color: string;
  size?: number;
  label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percent, color, size = 48, label }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Handle special cases: infinity, NaN, or negative values
  const safePercent = isFinite(percent) && !isNaN(percent) ? percent : 0;
  const normalizedPercent = Math.min(Math.max(safePercent, 0), 100);
  const displayLabel = isFinite(percent) && !isNaN(percent) ? `${normalizedPercent}%` : '0%';
  const offset = circumference - (normalizedPercent / 100) * circumference;

  return (
    <svg 
      width={size} 
      height={size} 
      className="inline-block transform -rotate-90"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.5s ease'
        }}
      />
      {/* Text label */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fontWeight="bold"
        fill={color}
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        transform={`rotate(90 ${size/2} ${size/2})`}
      >
        {displayLabel}
      </text>
    </svg>
  );
};

export default ProgressCircle;
