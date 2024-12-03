import React from 'react';

const RevenueChart = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const data = [15000, 17000, 19000, 22000, 24000, 25000, 27000, 28000, 29000, 31000, 32000, 35000];
  const maxValue = Math.max(...data);

  return (
    <div className="h-full flex items-end space-x-1 sm:space-x-2 px-2">
      {data.map((value, index) => (
        <div
          key={months[index]}
          className="flex-1 flex flex-col items-center"
        >
          <div
            className="w-full bg-primary-200 rounded-t hover:bg-primary-300 transition-all duration-200"
            style={{
              height: `${(value / maxValue) * 100}%`,
            }}
          />
          <div className="text-[10px] sm:text-xs text-gray-500 mt-2 rotate-45 sm:rotate-0">
            {months[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueChart;