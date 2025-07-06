import { EntryModel } from '../models';

export interface LoadEntriesByMonth {
  load: (params: LoadEntriesParams) => Promise<EntryModel[]>;
}

export type LoadEntriesParams = {
  month: string; // YYYY-MM
  userId: string;
};
