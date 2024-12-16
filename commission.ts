export interface CommissionTier {
  threshold: number;
  rate: number;
  description: string;
}

export interface MonthlyStats {
  sales: number;
  revenue: number;
  commission: number;
}

export interface AnnualStats {
  directCommission: number;
  retainerCommission: number;
  totalEarnings: number;
}