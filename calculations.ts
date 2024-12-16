import { CommissionTier, MonthlyStats, AnnualStats } from '../types/commission';
import { COMMISSION_TIERS, RETAINER_RATE } from '../constants/commission';

const AVERAGE_RETENTION_MONTHS = 8.7;
const SALE_VALUE = 597;

export const calculateCommissionRate = (revenue: number): number => {
  for (const tier of COMMISSION_TIERS) {
    if (revenue <= tier.threshold) {
      return tier.rate;
    }
  }
  return COMMISSION_TIERS[COMMISSION_TIERS.length - 1].rate;
};

export const calculateMonthlyStats = (salesPerWeek: number): MonthlyStats => {
  const monthlySales = salesPerWeek * 4;
  const monthlyRevenue = monthlySales * SALE_VALUE;
  const commissionRate = calculateCommissionRate(monthlyRevenue);
  const directCommission = monthlyRevenue * commissionRate;
  
  return {
    sales: monthlySales,
    revenue: monthlyRevenue,
    commission: directCommission
  };
};

const calculateCompoundingRetainerCommission = (monthlyNewSales: number): number => {
  // Calculate how many clients are active in each month throughout the year
  const monthlyRetainerRevenue: number[] = new Array(12).fill(0);
  
  // For each month of the year
  for (let month = 0; month < 12; month++) {
    // Add new clients' revenue for this month
    const newClientsRevenue = monthlyNewSales * SALE_VALUE;
    
    // For each previous month's cohort, add their revenue if they're still retained
    for (let cohortMonth = 0; cohortMonth < month; cohortMonth++) {
      const monthsSinceAcquisition = month - cohortMonth;
      if (monthsSinceAcquisition < AVERAGE_RETENTION_MONTHS) {
        monthlyRetainerRevenue[month] += newClientsRevenue;
      }
    }
    
    // Add current month's new clients
    monthlyRetainerRevenue[month] += newClientsRevenue;
  }
  
  // Calculate total retainer commission for the year
  const totalRetainerCommission = monthlyRetainerRevenue.reduce(
    (total, revenue) => total + (revenue * RETAINER_RATE),
    0
  );
  
  return totalRetainerCommission;
};

export const calculateAnnualStats = (salesPerWeek: number): AnnualStats => {
  const monthly = calculateMonthlyStats(salesPerWeek);
  const annualDirectCommission = monthly.commission * 12;
  const annualRetainerCommission = calculateCompoundingRetainerCommission(monthly.sales);
  
  return {
    directCommission: annualDirectCommission,
    retainerCommission: annualRetainerCommission,
    totalEarnings: annualDirectCommission + annualRetainerCommission
  };
};