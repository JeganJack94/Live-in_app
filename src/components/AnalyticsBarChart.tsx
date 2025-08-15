
type GroupedBarData = { partner: string; values: { category: string; value: number }[] }[];

const categoryColors: Record<string, string> = {
  Needs: '#f43f5e',
  Wants: '#a78bfa',
  Savings: '#eab308',
};

const AnalyticsBarChart: React.FC<{ groupedData: GroupedBarData; categories: string[] }> = ({ groupedData, categories }) => {
  // Find max value for scaling
  const max = Math.max(...groupedData.flatMap(g => g.values.map(v => v.value)), 1);
  return (
    <div className="w-full h-56 flex flex-col items-center justify-center">
      <div className="text-xs text-center mb-2 text-pink-500">Partner Spend by Category</div>
      <div className="flex items-end h-40 w-full justify-around">
        {groupedData.map((group, i) => (
          <div key={group.partner} className="flex flex-col items-center mx-2">
            <div className="flex space-x-1 items-end">
              {group.values.map((v, idx) => (
                <div
                  key={v.category}
                  className="rounded-t-md"
                  style={{
                    height: `${(v.value / max) * 100}%`,
                    width: '18px',
                    background: categoryColors[v.category] || '#f59e42',
                  }}
                  title={`${v.category}: ₹${v.value}`}
                ></div>
              ))}
            </div>
            <span className="text-xs mt-1 text-gray-900 font-bold">{group.partner}</span>
            <div className="flex flex-col mt-1">
              {group.values.map(v => (
                <span key={v.category} className="text-xs text-gray-500">
                  {v.category}: <span className="font-bold text-pink-500">₹{v.value}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        {categories.map(cat => (
          <div key={cat} className="flex items-center mx-2 text-xs">
            <span style={{ background: categoryColors[cat] || '#f59e42' }} className="inline-block w-2 h-2 rounded-full mr-1"></span>
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsBarChart;
