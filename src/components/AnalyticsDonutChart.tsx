import React from 'react';

const AnalyticsDonutChart: React.FC = () => {
  // Dummy data for illustration
  const data = [
    { label: 'Food', value: 40, color: '#f43f5e' },
    { label: 'Groceries', value: 30, color: '#fbbf24' },
    { label: 'Other', value: 30, color: '#f59e42' },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;

  // SVG arc generator
  const getArc = (value: number) => {
    const radius = 48;
    const angle = (value / total) * 2 * Math.PI;
    const x1 = 60 + radius * Math.cos(startAngle);
    const y1 = 60 + radius * Math.sin(startAngle);
    startAngle += angle;
    const x2 = 60 + radius * Math.cos(startAngle);
    const y2 = 60 + radius * Math.sin(startAngle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    return `M60,60 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  startAngle = 0;

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((d, i) => (
          <path key={d.label} d={getArc(d.value)} fill={d.color} />
        ))}
        <circle cx="60" cy="60" r="32" fill="#fff" />
      </svg>
    </div>
  );
};

export default AnalyticsDonutChart;
