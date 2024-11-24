import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { message } from "antd";
import { CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import TableService from "src/lib/service/tableService";
import { getTableTypeOfBar } from "src/lib/service/tableTypeService";
import { useAuthStore } from "src/lib";

function TableManagementStaff() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  const barId = userInfo?.identityId;

  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableTypeName, setTableTypeName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState("all");
  const [tableTypes, setTableTypes] = useState([]);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!barId) return;

      setIsLoading(true);
      try {
        const tableTypeId =
          selectedTableType === "all" ? null : selectedTableType;
        const response = await TableService.getTablesOfBar(
          barId,
          tableTypeId,
          null,
          pageIndex,
          pageSize
        );
        setTableData(response.data.data.response);
        setTotalPages(response.data.data.totalPage);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pageIndex, selectedTableType, barId]);

  useEffect(() => {
    const fetchTableTypes = async () => {
      if (!barId) return;
      
      try {
        const response = await getTableTypeOfBar(barId);
        if (response?.data?.data?.tableTypeResponses) {
          setTableTypes(response.data.data.tableTypeResponses);
        } else {
          setTableTypes([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại bàn:", error);
        message.error("Có lỗi xảy ra khi tải danh sách loại bàn");
      }
    };

    fetchTableTypes();
  }, [barId]);

  const handlePageChange = (event, value) => {
    setPageIndex(value);
    setCurrentPage(value);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTableData = tableData.filter((table) => {
    const matchesSearch = table.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTableType = selectedTableType === "all" || table.tableTypeId === selectedTableType;
    return matchesSearch && matchesTableType;
  });

  const openStatusModal = (table) => {
    setSelectedTable(table);
    setNewStatus(table.status);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedTable(null);
    setNewStatus(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTable) return;

    setIsUpdating(true);
    try {
      const response = await TableService.updateTableStatus(
        selectedTable.tableId,
        parseInt(newStatus)
      );

      if (response.status === 200) {
        message.success("Cập nhật trạng thái bàn thành công!");
        // Refresh data với API mới
        const tableTypeId =
          selectedTableType === "all" ? null : selectedTableType;
        const updatedResponse = await TableService.getTables(
          tableTypeId,
          null,
          pageIndex,
          pageSize
        );
        if (updatedResponse.data?.data) {
          setTableData(updatedResponse.data.data.response);
          setTotalPages(updatedResponse.data.data.totalPage);
        }
        closeStatusModal();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden px-8 flex-col pb-10 w-full bg-white max-md:px-5">
            <TableHeader
              onSearch={handleSearch}
              onTableTypeChange={setSelectedTableType}
              selectedTableType={selectedTableType}
              tableTypes={tableTypes || []}
            />

            <section className="w-full mt-10">
              <div className="grid grid-cols-7 gap-4 px-5 w-full font-semibold bg-white text-sm min-h-[40px] text-neutral-900 max-md:text-xs py-1">
                <div className="text-center break-words">STT</div>
                <div className="text-center break-words">Tên Bàn</div>
                <div className="text-center break-words">Loại bàn</div>
                <div className="text-center break-words">Mức giá tối thiểu</div>
                <div className="text-center break-words">
                  Lượng khách tối thiểu
                </div>
                <div className="text-center break-words">
                  Lượng khách tối đa
                </div>
                <div className="text-center break-words">Trạng thái</div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <CircularProgress />
                </div>
              ) : filteredTableData.length === 0 ? (
                <div className="text-red-500 text-center mt-4">
                  Không có bàn
                </div>
              ) : (
                filteredTableData.map((table, index) => (
                  <TableRow
                    key={table.tableId}
                    {...table}
                    isEven={index % 2 === 0}
                    index={index}
                    onStatusClick={() => openStatusModal(table)}
                  />
                ))
              )}
            </section>

            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>

            {isStatusModalOpen && selectedTable && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-[400px]">
                  <h2 className="text-xl font-semibold mb-4">
                    Cập nhật trạng thái bàn
                  </h2>
                  <p className="mb-4">Bàn: {selectedTable.tableName}</p>
                  <div className="space-y-2">
                    <button
                      className={`w-full p-2 rounded ${
                        newStatus === 0
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setNewStatus(0)}
                      disabled={isUpdating}
                    >
                      Còn trống
                    </button>
                    <button
                      className={`w-full p-2 rounded ${
                        newStatus === 1
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setNewStatus(1)}
                      disabled={isUpdating}
                    >
                      Đang phục vụ
                    </button>
                    <button
                      className={`w-full p-2 rounded ${
                        newStatus === 2
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setNewStatus(2)}
                      disabled={isUpdating}
                    >
                      Đã đặt trước
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
                      onClick={closeStatusModal}
                      disabled={isUpdating}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center justify-center min-w-[100px]"
                      onClick={() => handleStatusChange(newStatus)}
                      disabled={isUpdating || newStatus === null}
                    >
                      {isUpdating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Lưu"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function TableHeader({
  onSearch,
  onTableTypeChange,
  selectedTableType,
  tableTypes = []
}) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex justify-between items-center mt-8 w-full text-black">
      <div className="flex items-center gap-4 text-2xl font-bold">
        <h3 className="basis-auto">Quản lý bàn</h3>
      </div>

      <div className="flex-grow flex justify-center gap-4">
        <select
          className="px-4 py-2 border rounded-full w-48"
          value={selectedTableType}
          onChange={(e) => onTableTypeChange(e.target.value)}
        >
          <option value="all">Tất cả loại bàn</option>
          {tableTypes && tableTypes.map((type) => (
            <option key={type.tableTypeId} value={type.tableTypeId}>
              {type.typeName}
            </option>
          ))}
        </select>

        <div className="relative w-1/2 max-w-sm">
          <input
            type="text"
            placeholder="Tìm kiếm bàn..."
            onChange={handleSearchChange}
            className="px-4 py-2 pr-10 border rounded-full w-full"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

TableHeader.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onTableTypeChange: PropTypes.func.isRequired,
  selectedTableType: PropTypes.string.isRequired,
  tableTypes: PropTypes.array.isRequired,
};

function TableRow({
  tableId,
  tableName,
  tableTypeName,
  minimumPrice,
  minimumGuest,
  maximumGuest,
  status,
  isEven,
  index,
  onStatusClick,
}) {
  const rowClass = isEven
    ? "grid grid-cols-7 gap-4 px-5 py-4 w-full bg-orange-50 border-b border-gray-200 text-sm min-h-[60px] break-words items-center cursor-pointer hover:bg-orange-100"
    : "grid grid-cols-7 gap-4 px-5 py-4 w-full bg-white border-b border-orange-200 text-sm min-h-[60px] break-words items-center cursor-pointer hover:bg-gray-50";

  const statusText =
    status === 0 ? "Còn trống" : status === 1 ? "Đang phục vụ" : "Đã đặt trước";
  const statusClass =
    status === 0
      ? "bg-green-500"
      : status === 1
      ? "bg-yellow-500"
      : "bg-red-500";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={rowClass} onClick={onStatusClick}>
      <div className="text-center font-normal">{index + 1}</div>
      <div className="text-center font-normal">{tableName}</div>
      <div className="text-center font-normal">{tableTypeName}</div>
      <div className="text-center font-normal">
        {formatCurrency(minimumPrice)} VND
      </div>
      <div className="text-center font-normal">{minimumGuest}</div>
      <div className="text-center font-normal">{maximumGuest}</div>
      <div className="text-center flex justify-center items-center">
        <span
          className={`inline-block px-2 py-1 rounded-full text-white ${statusClass} font-semibold text-xs w-24`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}

TableRow.propTypes = {
  tableId: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  tableTypeName: PropTypes.string.isRequired,
  minimumPrice: PropTypes.number.isRequired,
  minimumGuest: PropTypes.number.isRequired,
  maximumGuest: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  isEven: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onStatusClick: PropTypes.func.isRequired,
};

export default TableManagementStaff;
