import React from 'react';

interface ProgressCircleProps {
  percent: number;
  color: string;
  size?: number;
  label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percent, color, size = 48, label }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="inline-block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {label && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="14"
          fontWeight="bold"
          fill={color}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default ProgressCircle;
