export interface DeleteEntry {
  delete(params: DeleteEntryParams): Promise<void>;
}

export interface DeleteEntryParams {
  id: string;
  deleteAllOccurrences?: boolean; // Para entradas fixas - excluir uma ou todas
}
