export interface DeleteCategory {
  delete(params: DeleteCategoryParams): Promise<DeleteCategoryResult>;
}

export interface DeleteCategoryParams {
  id: string;
}

export interface DeleteCategoryResult {
  deletedAt: Date;
}
