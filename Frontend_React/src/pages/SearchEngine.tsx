import Table, { ColumnProps } from "antd/es/table";
import { useState } from "react";
import { Pagination, Space, Tag, Typography } from "antd";
import { useFetchQuery } from "../hooks/useFetchQuery";
import {
  LoadingMap,
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
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isOpenParamsDrawer, setIsOpenParamsDrawer] = useState<boolean>(false);
  const [paramsData, setParamsData] = useState<any>({});
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({
    isDeletingTemplateParam: null,
    isAddingTemplateParam: false,
    isAddingTemplate: false,
    isDeletingTemplate: null,
  });

  const handleChangePage = (page: number) => {
    setFilters((prev) => ({
      ...prev,

      page: page - 1,
    }));
  };

  const handlePageSizeChange = (_: any, size: number) => {
    setFilters((prev) => ({
      ...prev,

      limit: size,
    }));
  };

  const columns: ColumnProps<LogEntry>[] = [
    {
      title: "Message",
      dataIndex: "Message",
      key: "Message",
      align: "center",
    },
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
        const message =
          error?.data || "Unable to fetch data right now! Try again later.";
        message.error(message);
        return [];
      }
    },
  });

  const handleFiltersChange = (
    pagination: any,
    changedFilters: Record<string, any>,
    sorter: Record<string, any>
  ) => {
    // const updatedFilter: SearchingFilters = {
    //   ...filters,
    //   name: changedFilters.name?.[0] || "",
    // };
    // setFilters(updatedFilter);
  };

  console.log(data, "data frm the api ")

  return (
    <div>
      <Table
        title={() => (
          <Space>
            <Typography.Title>Parquet File List </Typography.Title>
          </Space>
        )}
        columns={columns}
        bordered
        // @ts-ignore
        className="ranking-table"
        loading={isSearching}
        dataSource={data?.logs}
        scroll={{ x: "max-content" }}
        onChange={handleFiltersChange}
        // expandable={{
        // 	expandedRowRender,
        // 	expandedRowKeys,
        // 	onExpand: handleExpand,
        // 	rowExpandable: record => record.params?.length > 0,
        // }}
        rowKey="id"
      />

      <Pagination
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        align="end"
        current={filters.page + 1}
        total={data?.total ? data?.total : 0}
        pageSize={data?.page}
        onChange={handleChangePage}
        onShowSizeChange={handlePageSizeChange}
        showSizeChanger
        className="mt-6 text-right"
      />
    </div>
  );
};

export default SearchEngine;
