export interface ToggleMonthlyPaymentStatus {
  toggle(
    params: ToggleMonthlyPaymentStatusParams
  ): Promise<ToggleMonthlyPaymentStatusResult>;
}

export interface ToggleMonthlyPaymentStatusParams {
  entryId: string;
  isPaid: boolean;
}

export interface ToggleMonthlyPaymentStatusResult {
  entryId: string;
  isPaid: boolean;
  paidAt: Date | null;
}
