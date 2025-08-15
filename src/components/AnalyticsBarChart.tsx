import React from 'react';

const AnalyticsBarChart: React.FC = () => {
  // Dummy data for illustration
  const data = [
    { label: 'Dec', value1: 20, value2: 10 },
    { label: 'Jan', value1: 40, value2: 25 },
    { label: 'Feb', value1: 80, value2: 40 },
    { label: 'Mar', value1: 60, value2: 30 },
    { label: 'Apr', value1: 50, value2: 20 },
  ];
  const max = Math.max(...data.map(d => Math.max(d.value1, d.value2)));

  return (
    <div className="w-full h-48 flex flex-col items-center justify-center">
      <div className="text-xs text-center mb-2 text-pink-500">Spendy | people</div>
      <div className="flex items-end h-32 w-full justify-around">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-col items-center">
            <div className="flex space-x-1">
              <div
                className="bg-pink-500 rounded-t-md"
                style={{ height: `${(d.value1 / max) * 100}%`, width: '16px' }}
              ></div>
              <div
                className="bg-pink-300 rounded-t-md"
                style={{ height: `${(d.value2 / max) * 100}%`, width: '16px' }}
              ></div>
            </div>
            <span className="text-xs mt-1 text-gray-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsBarChart;
