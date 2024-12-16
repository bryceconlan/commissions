import React from 'react';

interface SalesSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const SalesSlider: React.FC<SalesSliderProps> = ({ value, onChange }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-gray-700">
          New Sales Per Week
        </label>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold min-w-[60px] text-center">
          {value}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};

export default SalesSlider;