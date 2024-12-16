// Create a self-contained calculator widget
(function() {
  // Inject required styles
  const styles = `
    .commission-calc-widget {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }
    .commission-calc-widget * {
      box-sizing: border-box;
    }
    .commission-calc-header {
      background: linear-gradient(to right, #2563eb, #1d4ed8);
      color: white;
      padding: 1.5rem;
    }
    .commission-calc-content {
      padding: 1.5rem;
    }
    .commission-calc-slider {
      width: 100%;
      margin: 1rem 0;
    }
    .commission-calc-grid {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }
    @media (min-width: 768px) {
      .commission-calc-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .commission-calc-card {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
    }
    .commission-calc-info {
      background: #eff6ff;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
  `;

  // Create and inject stylesheet
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Calculator logic
  const SALE_VALUE = 597;
  const AVERAGE_RETENTION_MONTHS = 8.7;
  const COMMISSION_TIERS = [
    { threshold: 5000, rate: 0.15 },
    { threshold: 15000, rate: 0.20 },
    { threshold: Infinity, rate: 0.30 }
  ];
  const RETAINER_RATE = 0.10;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateCommissionRate(revenue) {
    for (const tier of COMMISSION_TIERS) {
      if (revenue <= tier.threshold) {
        return tier.rate;
      }
    }
    return COMMISSION_TIERS[COMMISSION_TIERS.length - 1].rate;
  }

  function calculateMonthlyStats(salesPerWeek) {
    const monthlySales = salesPerWeek * 4;
    const monthlyRevenue = monthlySales * SALE_VALUE;
    const commissionRate = calculateCommissionRate(monthlyRevenue);
    const directCommission = monthlyRevenue * commissionRate;
    
    return {
      sales: monthlySales,
      revenue: monthlyRevenue,
      commission: directCommission
    };
  }

  function calculateCompoundingRetainerCommission(monthlyNewSales) {
    const monthlyRetainerRevenue = new Array(12).fill(0);
    
    for (let month = 0; month < 12; month++) {
      const newClientsRevenue = monthlyNewSales * SALE_VALUE;
      
      for (let cohortMonth = 0; cohortMonth < month; cohortMonth++) {
        const monthsSinceAcquisition = month - cohortMonth;
        if (monthsSinceAcquisition < AVERAGE_RETENTION_MONTHS) {
          monthlyRetainerRevenue[month] += newClientsRevenue;
        }
      }
      
      monthlyRetainerRevenue[month] += newClientsRevenue;
    }
    
    return monthlyRetainerRevenue.reduce(
      (total, revenue) => total + (revenue * RETAINER_RATE),
      0
    );
  }

  function calculateAnnualStats(salesPerWeek) {
    const monthly = calculateMonthlyStats(salesPerWeek);
    const annualDirectCommission = monthly.commission * 12;
    const annualRetainerCommission = calculateCompoundingRetainerCommission(monthly.sales);
    
    return {
      directCommission: annualDirectCommission,
      retainerCommission: annualRetainerCommission,
      totalEarnings: annualDirectCommission + annualRetainerCommission
    };
  }

  // Create and render the calculator
  function createCalculator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentSales = 1;

    function updateCalculator() {
      const monthly = calculateMonthlyStats(currentSales);
      const annual = calculateAnnualStats(currentSales);

      container.innerHTML = `
        <div class="commission-calc-widget">
          <div class="commission-calc-header">
            <h2 style="font-size: 1.5rem; font-weight: bold; margin: 0 0 0.5rem 0">
              Sales Commission Calculator
            </h2>
            <p style="margin: 0; opacity: 0.9">
              Calculate your potential earnings based on sales performance
            </p>
          </div>
          
          <div class="commission-calc-content">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <label style="font-weight: 500">New Sales Per Week</label>
                <span style="background: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600">
                  ${currentSales}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value="${currentSales}" 
                class="commission-calc-slider"
                style="width: 100%"
              />
            </div>

            <div class="commission-calc-grid">
              <div class="commission-calc-card">
                <h3 style="margin: 0 0 0.75rem 0; font-weight: 600">Monthly Metrics</h3>
                <div style="display: grid; gap: 0.5rem">
                  <p style="margin: 0">Sales: ${monthly.sales} deals</p>
                  <p style="margin: 0">Revenue: ${formatCurrency(monthly.revenue)}</p>
                  <p style="margin: 0">Commission: ${formatCurrency(monthly.commission)}</p>
                </div>
              </div>

              <div class="commission-calc-card">
                <h3 style="margin: 0 0 0.75rem 0; font-weight: 600">Annual Projections</h3>
                <div style="display: grid; gap: 0.5rem">
                  <p style="margin: 0">Direct Commission: ${formatCurrency(annual.directCommission)}</p>
                  <p style="margin: 0">Retainer Commission: ${formatCurrency(annual.retainerCommission)}</p>
                  <p style="margin: 0; font-weight: 600">
                    Total Annual Earnings: ${formatCurrency(annual.totalEarnings)}
                  </p>
                </div>
              </div>
            </div>

            <div class="commission-calc-info">
              <h3 style="margin: 0 0 0.75rem 0; font-weight: 600">Commission Structure</h3>
              <ul style="margin: 0; padding: 0; list-style: none">
                <li style="margin-bottom: 0.25rem">• Less than $5,000: 15% commission</li>
                <li style="margin-bottom: 0.25rem">• $5,001 to $15,000: 20% commission</li>
                <li>• Over $15,000: 30% commission</li>
              </ul>
            </div>
          </div>
        </div>
      `;

      // Add event listener to the slider
      container.querySelector('input[type="range"]').addEventListener('input', (e) => {
        currentSales = parseInt(e.target.value);
        updateCalculator();
      });
    }

    updateCalculator();
  }

  // Make the calculator function globally available
  window.createCommissionCalculator = createCalculator;
})();