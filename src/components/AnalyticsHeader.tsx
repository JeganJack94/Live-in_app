import React from 'react';
import { formatCurrency } from '../utils/transactionUtils';

interface AnalyticsHeaderProps {
    timeframe: 'month' | 'year';
    setTimeframe: (timeframe: 'month' | 'year') => void;
    totalSpend: number;
    comparisonData: {
        previousPeriod: number;
        currentPeriod: number;
        percentageChange: number;
    };
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
    timeframe,
    setTimeframe,
    totalSpend,
    comparisonData
}) => {
    return (
        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-500 -mx-4 px-4 pt-12 pb-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            
            {/* Time Period Selector */}
            <div className="bg-white/20 rounded-lg p-1 mb-6 inline-block">
                <button 
                    onClick={() => setTimeframe('month')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        timeframe === 'month' ? 'bg-white text-violet-600' : 'text-white'
                    }`}
                >
                    Month
                </button>
                <button 
                    onClick={() => setTimeframe('year')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        timeframe === 'year' ? 'bg-white text-violet-600' : 'text-white'
                    }`}
                >
                    Year
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Total Spend */}
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90">Total {timeframe === 'month' ? 'Monthly' : 'Yearly'} Spend</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpend)}</p>
                    <div className={`text-sm mt-2 flex items-center ${
                        comparisonData.percentageChange > 0 ? 'text-red-200' : 'text-green-200'
                    }`}>
                        <span className="mr-1">
                            {comparisonData.percentageChange > 0 ? '↑' : '↓'}
                        </span>
                        {Math.abs(comparisonData.percentageChange).toFixed(1)}% vs last {timeframe}
                    </div>
                </div>

                {/* Average Daily Spend */}
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90">Average Daily Spend</p>
                    <p className="text-2xl font-bold mt-1">
                        {formatCurrency(totalSpend / (timeframe === 'month' ? 30 : 365))}
                    </p>
                    <p className="text-sm mt-2 opacity-75">
                        Based on {timeframe === 'month' ? '30 days' : '365 days'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsHeader;
