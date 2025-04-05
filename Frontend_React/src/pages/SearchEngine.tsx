import Table, { ColumnProps } from "antd/es/table";
import { useState } from "react";
import { message, Pagination, Space, Tag, Typography } from "antd";
import { useFetchQuery } from "../hooks/useFetchQuery";
import {
  LogEntry,
  LogResponse,
  SearchingFilters,
} from "../types/searchType";
import { SEARCH_SERVICE } from "../api/services/searchService";

const SearchEngine = () => {
  const [filters, setFilters] = useState<SearchingFilters>({
    page: 1,
    limit: 10,
  });

  const handleChangePage = (page: number, size: any) => {
    if (typeof page !== "number" || isNaN(page) || page <= 0) return;

    setFilters((prev) => ({
      ...prev,
      page: page - 1,
    }));
  };

  const handlePageSizeChange = (_: any, size: number) => {
    if (typeof size !== "number" || isNaN(size) || size <= 0) return;

    setFilters((prev) => ({
      ...prev,
      limit: size,
      page: 0,
    }));
  };

  const columns: ColumnProps<LogEntry>[] = [
    {
      title: "Sender",
      dataIndex: "Sender",
      key: "Sender",
      render: (text) => text || "-",
    },
    {
      title: "Time Stamp",
      dataIndex: "NanoTimeStamp",
      key: "NanoTimeStamp",
      render: (text) => text || "-",
    },
    {
      title: "Namespace",
      dataIndex: "Namespace",
      key: "Namespace",
      render: (text) => text || "-",
    },
    {
      title: "Host",
      dataIndex: ["MessageRaw", "host"],
      key: "MessageRaw",
      render: (text) => text || "-",
    },
    {
      title: "Log",
      dataIndex: ["MessageRaw", "log"],
      key: "MessageRaw",
      render: (text) => text || "-",
    },
    {
      title: "Message",
      dataIndex: "Message",
      key: "Message",
      align: "left",
    },
  ];

  const {
    data,
    isLoading: isSearching,
    refetch,
  } = useFetchQuery<LogResponse>({
    queryKey: ["searchListing", filters],
    staleTime: 0,
    queryFn: async () => {
      try {
        const { data = [] } = await SEARCH_SERVICE.getSearchList(
          filters.page,
          filters.limit
        );

        return data;
      } catch (error: any) {
        const errorMesssage =
          error?.data || "Unable to fetch data right now! Try again later.";
        message.error(errorMesssage);
        return [];
      }
    },
  });

  return (
    <div>
      <Table
        title={() => (
          <Space>
            <Typography.Title level={4}>Parquet File List </Typography.Title>
          </Space>
        )}
        columns={columns}
        bordered
        // @ts-ignore
        className="ranking-table"
        loading={isSearching}
        dataSource={data?.logs}
        scroll={{ x: "max-content" }}
        pagination={false}
      />
      <Pagination
        showTotal={(total, range) =>
          `${range?.[0] || 0}-${range?.[1] || 0} of ${total || 0} items`
        }
        align="end"
        current={
          typeof filters?.page === "number" && filters.page >= 0
            ? filters.page + 1
            : 1
        }
        total={typeof data?.total === "number" ? data.total : 0}
        pageSize={
          typeof data?.limit === "number"
            ? data.limit
            : typeof data?.page === "number"
            ? data.page
            : 10
        }
        onChange={(page, pageSize) => {
          if (handleChangePage) {
            handleChangePage(page - 1, pageSize);
          }
        }}
        onShowSizeChange={(current, size) => {
          if (handlePageSizeChange) {
            handlePageSizeChange(current - 1, size);
          }
        }}
        showSizeChanger
        className="mt-10 text-right"
      />
    </div>
  );
};

export default SearchEngine;
