import { request } from "../axios";

export const SEARCH_SERVICE = {
  getSearchList: (payload: { page: number; limit: number; query: string }) =>
    request.post(`/logs`, payload),

  uploadLmaParquetFile: (payload: FormData, others: any) =>
    request.post(`/upload`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        ...others,
    }),
};
