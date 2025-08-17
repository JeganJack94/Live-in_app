import React, { useState } from 'react';

interface GroupedBarData {
  partner: string;
  values: { category: string; value: number }[];
}

interface Props {
  groupedData: GroupedBarData[];
  categories: string[];
}

const AnalyticsBarChart: React.FC<Props> = ({ groupedData, categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
  
  // Find max value for scaling and round up for nicer numbers
  const allValues = groupedData.flatMap(g => g.values.map(v => v.value));
  const max = Math.max(...allValues, 1);
  const roundedMax = Math.ceil(max / 1000) * 1000;
  
  // More granular y-axis values
  const divisions = 5;
  const yAxisValues = Array.from({ length: divisions + 1 }, (_, i) => 
    Math.round(roundedMax * (divisions - i) / divisions)
  );

  // Partner colors with improved contrast
  const partnerColors = {
    'Revathy': '#4f46e5', // indigo
    'Jegan': '#e11d48'    // rose
  };

  return (
    <div className="w-full h-[300px]">
      <div className="w-full h-full flex flex-col bg-white rounded-lg p-6">
        {/* Chart title */}
        <div className="text-gray-700 font-medium mb-4">Partner Spending</div>
        
        {/* Chart container */}
        <div className="relative flex-1">
          {/* Y-axis */}
          <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
            {yAxisValues.map((value) => (
              <div key={value} className="flex items-center">
                <span>₹{(value / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>

          {/* Grid lines and bars */}
          <div className="absolute left-16 right-4 top-0 bottom-8 flex flex-col justify-between">
            {/* Grid lines */}
            {yAxisValues.map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-200 w-full absolute"
                style={{ top: `${(index * 100) / (yAxisValues.length - 1)}%` }}
              />
            ))}

            {/* Bars container */}
            <div className="absolute inset-0 flex justify-around items-end">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex-1 flex items-end justify-center gap-2"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {groupedData.map((group) => {
                    const value = group.values.find(v => v.category === category)?.value || 0;
                    const isHovered = hoveredCategory === category || hoveredPartner === group.partner;
                    const height = (value / roundedMax) * 100;

                    return (
                      <div
                        key={`${category}-${group.partner}`}
                        className="relative"
                        onMouseEnter={() => setHoveredPartner(group.partner)}
                        onMouseLeave={() => setHoveredPartner(null)}
                      >
                        <div
                          className={`w-8 rounded-t-sm transition-all duration-200 ${
                            isHovered ? 'brightness-110' : 'brightness-100'
                          }`}
                          style={{
                            height: `${Math.max(height, value > 0 ? 2 : 0)}%`,
                            backgroundColor: partnerColors[group.partner as keyof typeof partnerColors],
                            opacity: isHovered ? 1 : 0.85,
                          }}
                        />
                        
                        {/* Tooltip */}
                        {isHovered && value > 0 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                            px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                            ₹{value.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-around border-t border-gray-200">
              {categories.map(category => (
                <div key={category} className="flex-1 text-center pt-2">
                  <span className="text-sm text-gray-600 font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6">
          {groupedData.map((group) => (
            <div
              key={group.partner}
              className={`flex items-center text-sm ${
                hoveredPartner === group.partner ? 'text-gray-900' : 'text-gray-600'
              }`}
              onMouseEnter={() => setHoveredPartner(group.partner)}
              onMouseLeave={() => setHoveredPartner(null)}
            >
              <div
                className="w-3 h-3 rounded-sm mr-2"
                style={{
                  backgroundColor: partnerColors[group.partner as keyof typeof partnerColors]
                }}
              />
              {group.partner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBarChart;
