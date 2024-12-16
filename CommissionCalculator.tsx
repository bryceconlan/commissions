import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar } from 'lucide-react';
import { calculateMonthlyStats, calculateAnnualStats } from '../utils/calculations';
import { formatCurrency } from '../utils/formatting';
import CommissionTiers from './CommissionTiers';
import SalesSlider from './SalesSlider';

const CommissionCalculator: React.FC = () => {
  const [salesPerWeek, setSalesPerWeek] = useState(1);
  const monthly = calculateMonthlyStats(salesPerWeek);
  const annual = calculateAnnualStats(salesPerWeek);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Sales Commission Calculator</h2>
        </div>
        <p className="text-blue-100">Calculate your potential earnings based on sales performance</p>
      </div>

      <div className="p-6">
        <SalesSlider value={salesPerWeek} onChange={setSalesPerWeek} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Monthly Metrics</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Sales: {monthly.sales} deals
              </p>
              <p className="text-sm text-gray-600">
                Revenue: {formatCurrency(monthly.revenue)}
              </p>
              <p className="text-sm text-gray-600">
                Commission: {formatCurrency(monthly.commission)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Annual Projections</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Direct Commission: {formatCurrency(annual.directCommission)}
              </p>
              <p className="text-sm text-gray-600">
                Retainer Commission: {formatCurrency(annual.retainerCommission)}
              </p>
              <p className="font-semibold text-gray-700">
                Total Annual Earnings: {formatCurrency(annual.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <CommissionTiers />
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculator;