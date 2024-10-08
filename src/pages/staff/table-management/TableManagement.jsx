import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TableService from "../../../lib/service/tableService";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { toast } from 'react-toastify';

function TableManagement() {
  const { tableTypeId } = useParams();

  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [tableTypeName, setTableTypeName] = useState(""); // Thêm state cho tableTypeName
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // Lấy userInfo từ session storage
      const barId = userInfo ? userInfo.identityId : null; // Trích xuất identityId

      const response = await TableService.getTables(barId, tableTypeId, null, pageIndex, pageSize);
      setTableData(response.response);
      setTotalPages(response.totalPage);
      setTableTypeName(response.tableTypeName); // Lưu tableTypeName từ phản hồi
    };
    fetchData();
  }, [pageIndex, tableTypeId]); // Chạy lại khi pageIndex hoặc tableTypeId thay đổi

  const handlePageChange = (event, value) => {
    setPageIndex(value); // Cập nhật pageIndex
    setCurrentPage(value); // Cập nhật currentPage nếu cần
  };

  const filteredTableData = tableData.filter((table) =>
    table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = () => {
    setCurrentTable({
      tableId: null,
      tableName: "",
      tableTypeName: tableTypeName,
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
    if (!currentTable.tableName.trim()) {
      toast.error("Vui lòng nhập tên bàn");
      return;
    }

    setIsLoading(true);
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // Lấy userInfo từ session storage
      const barId = userInfo ? userInfo.identityId : null; // Trích xuất identityId

      const tableData = {
        barId: barId, // Sử dụng barId từ session storage
        tableTypeId: tableTypeId,
        tableName: currentTable.tableName.trim(),
        status: parseInt(currentTable.status)
      };

      let response;
      if (isEditing) {
        response = await TableService.updateTable(currentTable.tableId, tableData);
      } else {
        response = await TableService.addTable(tableData);
      }
      
      if (response.status === 200) {
        toast.success(isEditing ? "Cập nhật bàn thành công!" : "Thêm bàn mới thành công!");
        // Cập nhật lại danh sách bàn
        const updatedTables = await TableService.getTables(barId, tableTypeId, null, pageIndex, pageSize);
        setTableData(updatedTables.response);
        setTotalPages(updatedTables.totalPage);
        closeModal();
      } else {
        toast.error(isEditing ? "Có lỗi xảy ra khi cập nhật bàn" : "Có lỗi xảy ra khi thêm bàn mới");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý bàn:", error);
      toast.error("Có lỗi xảy ra khi xử lý bàn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await TableService.deleteTable(tableToDelete.tableId);
      
      if (response.status === 200) {
        // Xóa thành công
        setTableData((prevData) =>
          prevData.filter((table) => table.tableId !== tableToDelete.tableId)
        );
        toast.success("Xóa bàn thành công!"); // Hiển thị thông báo thành công
      } else if (response.status === 202) {
        // Không thể xóa do ràng buộc
        const message = response.data || "Không thể xóa bàn do có ràng buộc!"; // Lấy thông điệp từ phản hồi
        toast.warn(message); // Hiển thị thông báo cảnh báo
      }
      
      // Đặt lại bàn để xóa và đóng popup
      setTableToDelete(null);
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Đã xảy ra lỗi hệ thống!"); // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden px-8 flex-col pb-10 w-full bg-white max-md:px-5">
            <TableHeader
              openModal={openModal}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              tableTypeName={tableTypeName}
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

              {filteredTableData.length === 0 ? (
                <div className="text-red-500 text-center mt-4">
                  Không có bàn
                </div>
              ) : (
                filteredTableData.map((table, index) => (
                  <TableRow
                    key={table.tableId}
                    {...table}
                    isEven={index % 2 === 0}
                    openEditModal={openEditModal}
                    openDeletePopup={openDeletePopup}
                    index={index}
                  />
                ))
              )}
            </section>

            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>

            {/* Modal thêm/chỉnh sửa bàn */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 w-[500px]">
                  <h2 className="text-2xl font-semibold mb-6">
                    {isEditing ? "Cập nhật bàn" : "Thêm bàn mới"}
                  </h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tên loại bàn</label>
                    <input
                      type="text"
                      value={currentTable.tableTypeName}
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
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
                  <div className="flex justify-end gap-4">
                    <button
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
                      onClick={closeModal}
                      disabled={isLoading}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-full"
                      onClick={handleSaveTable}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : (isEditing ? "Cập nhật" : "Lưu")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Popup xác nhận xóa */}
            {isDeletePopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]">
                  <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
                  <p>
                    Bạn có chắc chắn muốn xóa bàn:{" "}
                    <strong>{tableToDelete?.tableName}</strong>?
                  </p>
                  <div className="flex justify-between mt-6">
                    <button
                      className="bg-gray-400 text-white py-3 w-48 rounded-full"
                      onClick={closeDeletePopup}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      className="bg-blue-600 text-white py-3 w-48 rounded-full"
                      onClick={handleConfirmDelete}
                    >
                      Xóa
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

function TableHeader({ openModal, searchTerm, onSearchChange, tableTypeName }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mt-8 w-full text-black">
      {/* Left section: Back icon and title */}
      <div className="flex items-center gap-4 text-2xl font-bold">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
          className="object-contain cursor-pointer shrink-0 w-8 aspect-square"
          alt="icon"
          onClick={() => navigate("/staff/table-management")}
        />
        <h3 className="basis-auto">{tableTypeName}</h3> {/* Hiển thị tableTypeName từ phản hồi */}
      </div>

      {/* Center section: Search bar */}
      <div className="flex-grow flex justify-center">
        <input
          type="text"
          placeholder="Tìm kiếm bàn..."
          value={searchTerm}
          onChange={onSearchChange}
          className="px-4 py-2 border rounded-full w-1/2 max-w-sm" // Adjusted width and max width
        />
      </div>

      {/* Right section: Add button */}
      <button
        className="flex items-center gap-2.5 px-3 py-2 my-auto text-base bg-white rounded-md border border-black shadow-lg"
        onClick={openModal}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b3a3b60968561c5c184b173073ded83218c326d8daa832d8e11a3cde174d1afd?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
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
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
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
  index // Thêm index để sử dụng cho ID bàn
}) {
  const rowClass = isEven
    ? "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-orange-50 border-b border-gray-200 text-sm min-h-[60px] break-words items-center" // Thêm items-center
    : "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-white border-b border-orange-200 text-sm min-h-[60px] break-words items-center"; // Thêm items-center

  // Chuyển đổi giá trị status thành chuỗi tương ứng
  const statusText = status === 0 ? "Còn trống" : status === 1 ? "Đang phục vụ" : "Đã đặt trước";
  const statusClass = status === 0 ? "bg-green-500" : status === 1 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={rowClass}>
      <div className="text-center font-normal">{index + 1}</div> {/* Hiển thị bộ đếm thứ tự */}
      <div className="text-center font-normal">{tableName}</div>
      <div className="text-center font-normal">{tableTypeName}</div>
      <div className="text-center font-normal">{minimumPrice}</div>
      <div className="text-center font-normal">{minimumGuest}</div>
      <div className="text-center font-normal">{maximumGuest}</div>
      <div className="text-center">
        <span
          className={`inline-block px-4 py-1 rounded-full text-white ${statusClass} font-semibold`}
        >
          {statusText} {/* Hiển thị trạng thái */}
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
          onClick={() => openDeletePopup({ tableId, tableName })} // Đảm bảo tableId được truyền đúng
        />
      </div>
    </div>
  );
}

export default TableManagement;