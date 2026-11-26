export type DefinedEvPlanUnits = 2 | 5 | 10 | 25 | 50;

export interface DefinedPlanConfig {
  readonly evUnits: DefinedEvPlanUnits;
  readonly rentalPerEvMonthly: number;
  readonly highlightBadge?: "Entry Plan" | "Flagship Scale";
  readonly highlightTone?: "emerald" | "gold";
}

export interface ComputedInvestmentPlan extends DefinedPlanConfig {
  readonly investment: number;
  readonly gst: number;
  readonly totalInvestment: number;
  readonly monthlyRental: number;
  readonly annualRental: number;
  readonly totalRental48Months: number;
  readonly projectedRentalSurplus: number;
}

export const INVESTMENT_MODEL_CONSTANTS = {
  investmentPerEv: 66_500,
  gstPerEv: 3_500,
  totalInvestmentPerEv: 70_000,
  gstLabel: "GST (5%)",
  agreementMonths: 48,
} as const;

/**
 * Exact defined investment tiers. Do not interpolate or derive rates
 * for unit quantities outside these five specified plans.
 */
export const DEFINED_INVESTMENT_PLANS: readonly DefinedPlanConfig[] = [
  {
    evUnits: 2,
    rentalPerEvMonthly: 4_300,
    highlightBadge: "Entry Plan",
    highlightTone: "emerald",
  },
  {
    evUnits: 5,
    rentalPerEvMonthly: 4_600,
  },
  {
    evUnits: 10,
    rentalPerEvMonthly: 5_000,
  },
  {
    evUnits: 25,
    rentalPerEvMonthly: 5_200,
  },
  {
    evUnits: 50,
    rentalPerEvMonthly: 5_500,
    highlightBadge: "Flagship Scale",
    highlightTone: "gold",
  },
] as const;

export function calculateInvestmentPlan(units: DefinedEvPlanUnits): ComputedInvestmentPlan {
  const plan = DEFINED_INVESTMENT_PLANS.find((p) => p.evUnits === units);
  if (!plan) {
    throw new Error(`Unsupported EV plan quantity: ${String(units)}`);
  }

  const investment = plan.evUnits * INVESTMENT_MODEL_CONSTANTS.investmentPerEv;
  const gst = plan.evUnits * INVESTMENT_MODEL_CONSTANTS.gstPerEv;
  const totalInvestment = investment + gst;
  const monthlyRental = plan.evUnits * plan.rentalPerEvMonthly;
  const annualRental = monthlyRental * 12;
  const totalRental48Months = monthlyRental * INVESTMENT_MODEL_CONSTANTS.agreementMonths;
  const projectedRentalSurplus = totalRental48Months - totalInvestment;

  return {
    ...plan,
    investment,
    gst,
    totalInvestment,
    monthlyRental,
    annualRental,
    totalRental48Months,
    projectedRentalSurplus,
  };
}

export const ALL_COMPUTED_PLANS: readonly ComputedInvestmentPlan[] =
  DEFINED_INVESTMENT_PLANS.map((p) => calculateInvestmentPlan(p.evUnits));

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatIndianCompact(amount: number): string {
  if (amount >= 1_00_00_000) {
    const crores = Number((amount / 1_00_00_000).toFixed(2));
    return `₹${crores} Crore`;
  }
  if (amount >= 1_00_000) {
    const lakhs = Number((amount / 1_00_000).toFixed(2));
    return `₹${lakhs} Lakh`;
  }
  return formatINR(amount);
}
