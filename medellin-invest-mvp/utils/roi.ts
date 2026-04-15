/**
 * ROI calculation utilities.
 * All monetary values in USD. Logic is pure and framework-free so it can
 * be unit-tested and reused across screens (calculator, listing detail, dashboards).
 */

export type FinancingInputs = {
  /** 0..1 — fraction of purchase price paid up front. 1 means all-cash. */
  downPaymentRatio: number;
  /** Annual interest rate as a decimal (e.g. 0.07 for 7%). */
  interestRate: number;
  /** Loan term in years. */
  termYears: number;
};

export type ROIInputs = {
  purchasePrice: number;
  // Short-term rental
  nightlyRate: number;
  occupancyRate: number; // 0..1
  cleaningCostPerStay: number;
  averageStayNights?: number; // default 4
  // Long-term rental
  longTermMonthlyRent: number;
  // Recurring monthly expenses
  hoaMonthly: number;
  utilitiesMonthly: number;
  managementMonthly: number;
  maintenanceReserveMonthly: number;
  // Optional financing
  financing?: FinancingInputs;
};

export type ROIBreakdown = {
  // Short-term
  monthlyGrossShortTerm: number;
  annualGrossShortTerm: number;
  monthlyNetShortTerm: number;
  annualNetShortTerm: number;
  // Long-term
  monthlyGrossLongTerm: number;
  annualGrossLongTerm: number;
  monthlyNetLongTerm: number;
  annualNetLongTerm: number;
  // Best of both
  bestStrategy: 'shortTerm' | 'longTerm';
  bestAnnualNet: number;
  // Returns (using best strategy unless noted)
  capRate: number; // % — NOI / purchase price
  cashOnCashReturn: number; // % — annual cash flow / cash invested
  roiPercent: number; // alias of cashOnCashReturn for display parity
  paybackYears: number;
  // Mortgage
  monthlyMortgagePayment: number;
  cashInvested: number;
};

const round2 = (v: number) => Math.round(v * 100) / 100;
const safeDiv = (n: number, d: number) => (d === 0 ? 0 : n / d);

/**
 * Standard amortization payment — returns 0 when there's no loan.
 */
export const monthlyMortgage = (
  loanAmount: number,
  annualRate: number,
  termYears: number
) => {
  if (loanAmount <= 0 || termYears <= 0) return 0;
  const r = annualRate / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export function calculateROI(inputs: ROIInputs): ROIBreakdown {
  const {
    purchasePrice,
    nightlyRate,
    occupancyRate,
    cleaningCostPerStay,
    averageStayNights = 4,
    longTermMonthlyRent,
    hoaMonthly,
    utilitiesMonthly,
    managementMonthly,
    maintenanceReserveMonthly,
    financing,
  } = inputs;

  const nightsPerMonth = 30 * Math.max(0, Math.min(1, occupancyRate));
  const monthlyGrossShortTerm = nightlyRate * nightsPerMonth;
  const turnoversPerMonth =
    averageStayNights > 0 ? nightsPerMonth / averageStayNights : 0;
  const cleaningMonthly = turnoversPerMonth * cleaningCostPerStay;

  const recurringMonthlyExpenses =
    hoaMonthly +
    utilitiesMonthly +
    managementMonthly +
    maintenanceReserveMonthly;

  // Mortgage
  const downPaymentRatio = financing?.downPaymentRatio ?? 1;
  const downPayment = purchasePrice * downPaymentRatio;
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgagePayment = financing
    ? monthlyMortgage(loanAmount, financing.interestRate, financing.termYears)
    : 0;

  const monthlyOpex = recurringMonthlyExpenses + monthlyMortgagePayment;

  const monthlyNetShortTerm =
    monthlyGrossShortTerm - cleaningMonthly - monthlyOpex;
  const monthlyNetLongTerm = longTermMonthlyRent - monthlyOpex;

  const annualGrossShortTerm = monthlyGrossShortTerm * 12;
  const annualGrossLongTerm = longTermMonthlyRent * 12;
  const annualNetShortTerm = monthlyNetShortTerm * 12;
  const annualNetLongTerm = monthlyNetLongTerm * 12;

  const bestStrategy: 'shortTerm' | 'longTerm' =
    annualNetShortTerm >= annualNetLongTerm ? 'shortTerm' : 'longTerm';
  const bestAnnualNet = Math.max(annualNetShortTerm, annualNetLongTerm);

  // Cap rate uses NOI = annual net before debt service
  const annualOpexBeforeDebt = (recurringMonthlyExpenses + cleaningMonthly) * 12;
  const annualGrossBest =
    bestStrategy === 'shortTerm' ? annualGrossShortTerm : annualGrossLongTerm;
  const noi =
    annualGrossBest -
    (bestStrategy === 'shortTerm'
      ? annualOpexBeforeDebt
      : recurringMonthlyExpenses * 12);

  const capRate = safeDiv(noi, purchasePrice) * 100;

  const cashInvested =
    downPayment > 0 ? downPayment : purchasePrice; // all-cash if no financing
  const cashOnCashReturn = safeDiv(bestAnnualNet, cashInvested) * 100;

  const paybackYears = bestAnnualNet > 0 ? cashInvested / bestAnnualNet : Infinity;

  return {
    monthlyGrossShortTerm: round2(monthlyGrossShortTerm),
    annualGrossShortTerm: round2(annualGrossShortTerm),
    monthlyNetShortTerm: round2(monthlyNetShortTerm),
    annualNetShortTerm: round2(annualNetShortTerm),
    monthlyGrossLongTerm: round2(longTermMonthlyRent),
    annualGrossLongTerm: round2(annualGrossLongTerm),
    monthlyNetLongTerm: round2(monthlyNetLongTerm),
    annualNetLongTerm: round2(annualNetLongTerm),
    bestStrategy,
    bestAnnualNet: round2(bestAnnualNet),
    capRate: round2(capRate),
    cashOnCashReturn: round2(cashOnCashReturn),
    roiPercent: round2(cashOnCashReturn),
    paybackYears: Number.isFinite(paybackYears) ? round2(paybackYears) : Infinity,
    monthlyMortgagePayment: round2(monthlyMortgagePayment),
    cashInvested: round2(cashInvested),
  };
}

/**
 * Build default ROI inputs from a Property record.
 * Useful when seeding the calculator from a listing.
 */
export const defaultInputsFromProperty = (p: {
  price: number;
  nightlyRateEstimate: number;
  occupancyRateEstimate: number;
  monthlyLongTermRent: number;
  hoaMonthly: number;
  utilitiesMonthly: number;
  managementMonthly: number;
  maintenanceReserveMonthly: number;
  cleaningCostPerStay: number;
}): ROIInputs => ({
  purchasePrice: p.price,
  nightlyRate: p.nightlyRateEstimate,
  occupancyRate: p.occupancyRateEstimate,
  cleaningCostPerStay: p.cleaningCostPerStay,
  averageStayNights: 4,
  longTermMonthlyRent: p.monthlyLongTermRent,
  hoaMonthly: p.hoaMonthly,
  utilitiesMonthly: p.utilitiesMonthly,
  managementMonthly: p.managementMonthly,
  maintenanceReserveMonthly: p.maintenanceReserveMonthly,
});

export const ROI_DISCLAIMER =
  'Estimates only. Returns depend on local regulations, occupancy, financing terms, and market conditions. Validate with your accountant before investing.';
