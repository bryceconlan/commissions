import React from 'react';
import { Info } from 'lucide-react';
import { COMMISSION_TIERS } from '../constants/commission';

const CommissionTiers: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-700">Commission Structure</h3>
      </div>
      <ul className="text-sm text-gray-600 space-y-1">
        {COMMISSION_TIERS.map((tier, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {tier.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommissionTiers;