export interface MonthYear {
  year: number;
  month: number;
}

export interface LoadEntriesMonthsYearsResult {
  monthsYears: MonthYear[];
}

export interface LoadEntriesMonthsYears {
  load(): Promise<LoadEntriesMonthsYearsResult>;
}
