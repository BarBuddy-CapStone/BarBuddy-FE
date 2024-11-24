import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TableService from "../../../lib/service/tableService";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { message } from 'antd';
import { CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAllTableTypes, getTableTypeOfBar } from "src/lib/service/tableTypeService";

function TableManagementManager() {
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTableType, setSelectedTableType] = useState("all");
  const [tableTypes, setTableTypes] = useState([]);
  const [currentTable, setCurrentTable] = useState({
    tableId: null,
    tableName: "",
    tableTypeName: "",
    minimumPrice: "",
    minimumGuest: 1,
    maximumGuest: 1,
    status: "Còn trống",
  });
  const [tableToDelete, setTableToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({
    tableName: ""
  });
  const [barId, setBarId] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo && userInfo.identityId) {
      setBarId(userInfo.identityId);
    }
  }, []);

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

  useEffect(() => {
    const fetchTables = async () => {
      if (!barId) return;
      
      setIsLoading(true);
      try {
        const tableTypeId = selectedTableType === "all" ? null : selectedTableType;
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

    fetchTables();
  }, [pageIndex, selectedTableType, barId]);

  const filteredTableData = tableData.filter((table) => {
    const matchesSearch = table.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTableType = selectedTableType === "all" || table.tableTypeId === selectedTableType;
    return matchesSearch && matchesTableType;
  });

  const openModal = () => {
    setCurrentTable({
      tableId: null,
      tableName: "",
      tableTypeId: tableTypes[0]?.tableTypeId,
      tableTypeName: tableTypes[0]?.typeName,
      minimumPrice: "",
      minimumGuest: 1,
      maximumGuest: 1,
      status: 0,
    });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const openEditModal = (table) => {
    setCurrentTable(table);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const openDeletePopup = (table) => {
    setTableToDelete(table);
    setIsDeletePopupOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeDeletePopup = () => setIsDeletePopupOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTable({ ...currentTable, [name]: value });
  };

  const handleSaveTable = async () => {
    const trimmedTableName = currentTable.tableName.trim();
    setErrors({ tableName: "" });
    
    if (!trimmedTableName) {
      setErrors({ tableName: "Vui lòng nhập tên bàn" });
      return;
    }
    
    if (trimmedTableName.length < 6) {
      setErrors({ tableName: "Tên bàn phải có ít nhất 6 ký tự" });
      return;
    }
    
    setIsSaving(true);
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const barId = userInfo ? userInfo.identityId : null;

      const tableData = {
        tableTypeId: currentTable.tableTypeId,
        tableName: trimmedTableName,
        status: parseInt(currentTable.status)
      };

      console.log('Payload:', tableData);

      let response;
      if (isEditing) {
        response = await TableService.updateTable(currentTable.tableId, tableData);
      } else {
        response = await TableService.addTable(tableData);
      }
      
      if (response.status === 200) {
        message.success(isEditing ? "Cập nhật bàn thành công!" : "Thêm bàn mới thành công!");
        const updatedResponse = await TableService.getTables(selectedTableType === "all" ? null : selectedTableType, null, pageIndex, pageSize);
        setTableData(updatedResponse.data.data.response);
        setTotalPages(updatedResponse.data.data.totalPage);
        closeModal();
      } else {
        throw new Error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bàn:", error);
      if (error.response?.status === 500 && error.response?.data?.message?.includes("Trùng tên bàn")) {
        setErrors({ tableName: "Tên bàn đã tồn tại, vui lòng chọn tên khác" });
      } else {
        message.error(error.response?.data?.message || "Có lỗi xảy ra khi xử lý bàn");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!tableToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await TableService.deleteTable(tableToDelete.tableId);
      
      if (response.status === 200) {
        message.success("Xóa bàn thành công!");
        const updatedResponse = await TableService.getTables(selectedTableType === "all" ? null : selectedTableType, null, pageIndex, pageSize);
        setTableData(updatedResponse.data.data.response);
        setTotalPages(updatedResponse.data.data.totalPage);
      } else {
        throw new Error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bàn:", error);
      message.error(error.message || "Có lỗi xảy ra khi xóa bàn");
    } finally {
      setIsDeleting(false);
      closeDeletePopup();
    }
  };

  const handleTableTypeChange = (value) => {
    setSelectedTableType(value);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (event, newPage) => {
    setPageIndex(newPage);
    setCurrentPage(newPage);
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden px-8 flex-col pb-10 w-full bg-white max-md:px-5">
            <TableHeader
              openModal={openModal}
              onSearch={handleSearch}
              onTableTypeChange={handleTableTypeChange}
              selectedTableType={selectedTableType}
              tableTypes={tableTypes}
            />

            <section className="w-full mt-10">
              <div className="grid grid-cols-8 gap-4 px-5 w-full font-semibold bg-white text-sm min-h-[40px] text-neutral-900 max-md:text-xs py-1">
                <div className="text-center break-words">STT</div>
                <div className="text-center break-words">Tên Bàn</div>
                <div className="text-center break-words">Loại bàn</div>
                <div className="text-center break-words">Mức giá tối thiểu</div>
                <div className="text-center break-words">Lượng khách tối thiểu</div>
                <div className="text-center break-words">Lượng khách tối đa</div>
                <div className="text-center break-words">Trạng thái</div>
                <div className="text-center break-words">Hành động</div>
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
                <>
                  {filteredTableData.map((table, index) => (
                    <TableRow
                      key={table.tableId}
                      {...table}
                      isEven={index % 2 === 0}
                      openEditModal={openEditModal}
                      openDeletePopup={openDeletePopup}
                      index={(pageIndex - 1) * pageSize + index + 1}
                    />
                  ))}

                  <div className="flex justify-center mt-4">
                    <Stack spacing={2}>
                      <Pagination
                        count={totalPages}
                        page={pageIndex}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Stack>
                  </div>
                </>
              )}
            </section>

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                  <h2 className="text-2xl font-semibold mb-6">
                    {isEditing ? "Cập nhật bàn" : "Thêm bàn mới"}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Loại bàn</label>
                    <select
                      name="tableTypeId"
                      value={currentTable.tableTypeId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {tableTypes.map((type) => (
                        <option key={type.tableTypeId} value={type.tableTypeId}>
                          {type.typeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên bàn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tableName"
                      value={currentTable.tableName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.tableName ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      required
                    />
                    <p className={`mt-1 text-sm ${errors.tableName ? 'text-red-500' : 'text-gray-500'}`}>
                      {errors.tableName || "Tên bàn phải có ít nhất 6 ký tự"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select
                      name="status"
                      value={currentTable.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={0}>Còn trống</option>
                      <option value={1}>Đang phục vụ</option>
                      <option value={2}>Đã đặt trước</option>
                    </select>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full mr-2 w-32"
                      onClick={closeModal}
                      disabled={isSaving}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 w-32 text-white rounded-full flex items-center justify-center"
                      onClick={handleSaveTable}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        isEditing ? "Cập nhật" : "Lưu"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isDeletePopupOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <h2 className="text-2xl font-semibold mb-4">Xác nhận xóa</h2>
                  <p>Bạn có chắc chắn muốn xóa bàn: <strong>{tableToDelete?.tableName}</strong>?</p>
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full mr-2"
                      onClick={closeDeletePopup}
                      disabled={isDeleting}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-full flex items-center justify-center w-32"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Xóa"
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

function TableHeader({ openModal, onSearch, onTableTypeChange, selectedTableType, tableTypes }) {
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
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
          {tableTypes.map((type) => (
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
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>

      <button
        className="flex items-center gap-2.5 px-4 py-2 my-auto text-base bg-white rounded-full border border-black shadow-lg"
        onClick={openModal}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b3a3b60968561c5c184b173073ded83218c326d8daa832d8e11a3cde174d1afd"
          className="object-contain w-5"
          alt="add icon"
        />
        <span className="basis-auto">Thêm bàn mới</span>
      </button>
    </div>
  );
}

TableHeader.propTypes = {
  openModal: PropTypes.func.isRequired,
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
  openEditModal,
  openDeletePopup,
  index
}) {
  const rowClass = isEven
    ? "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-orange-50 border-b border-gray-200 text-sm min-h-[60px] break-words items-center"
    : "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-white border-b border-orange-200 text-sm min-h-[60px] break-words items-center";

  const statusText = status === 0 ? "Còn trống" : status === 1 ? "Đang phục vụ" : "Đã đặt trước";
  const statusClass = status === 0 ? "bg-green-500" : status === 1 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={rowClass}>
      <div className="text-center font-normal">{index}</div>
      <div className="text-center font-normal">{tableName}</div>
      <div className="text-center font-normal">{tableTypeName}</div>
      <div className="text-center font-normal">{minimumPrice.toLocaleString('vi-VN')} VND</div>
      <div className="text-center font-normal">{minimumGuest}</div>
      <div className="text-center font-normal">{maximumGuest}</div>
      <div className="text-center flex justify-center items-center">
        <span
          className={`inline-block px-2 py-1 rounded-full text-white ${statusClass} font-semibold text-xs w-24`}
        >
          {statusText}
        </span>
      </div>
      <div className="flex justify-center gap-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
          alt="Edit"
          className="cursor-pointer w-5 h-5"
          onClick={() =>
            openEditModal({
              tableId,
              tableName,
              tableTypeName,
              minimumPrice,
              minimumGuest,
              maximumGuest,
              status,
            })
          }
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e"
          alt="Delete"
          className="cursor-pointer w-5 h-5"
          onClick={() => openDeletePopup({ tableId, tableName })}
        />
      </div>
    </div>
  );
}

export default TableManagementManager;
