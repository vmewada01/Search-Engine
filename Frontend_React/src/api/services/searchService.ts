import { request } from "../axios";

export const SEARCH_SERVICE = {
  getSearchList: (payload: { page: number; limit: number; query: string }) =>
    request.post(`/logs`, payload),
};
