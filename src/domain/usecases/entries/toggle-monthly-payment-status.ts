export interface ToggleMonthlyPaymentStatus {
  toggle(
    params: ToggleMonthlyPaymentStatusParams
  ): Promise<ToggleMonthlyPaymentStatusResult>;
}

export interface ToggleMonthlyPaymentStatusParams {
  entryId: string;
  year: number;
  month: number;
  isPaid: boolean;
}

export interface ToggleMonthlyPaymentStatusResult {
  entryId: string;
  year: number;
  month: number;
  isPaid: boolean;
  paidAt: Date | null;
}
