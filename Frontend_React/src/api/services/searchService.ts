import { request } from "../axios";

export const SEARCH_SERVICE = {
  getSearchList: (page: number, limit: number) =>
    request.get(`/logs?page=${page}&limit=${limit}`),
};
