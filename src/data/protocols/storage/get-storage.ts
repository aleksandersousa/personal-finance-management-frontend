export interface GetStorage {
  get: (key: string) => Promise<unknown>;
}
