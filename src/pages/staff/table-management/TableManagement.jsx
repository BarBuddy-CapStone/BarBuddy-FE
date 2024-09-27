import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const initialTableData = [
  { id: 1, name: 'TCA01', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 2, name: 'TCA02', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Đang phục vụ' },
  { id: 3, name: 'TCA03', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 4, name: 'TCA04', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 5, name: 'TCA05', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Đang phục vụ' },
  { id: 6, name: 'TCA06', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 7, name: 'TCA07', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 8, name: 'TCA08', type: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
];

function TableManagement() {
  const [tableData, setTableData] = useState(initialTableData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [currentTable, setCurrentTable] = useState({
    id: null,
    name: '',
    type: 'Bàn Tiêu chuẩn 1',
    price: '',
    minGuests: 1,
    maxGuests: 1,
    status: 'Còn trống',
  });
  const [tableToDelete, setTableToDelete] = useState(null);

  // Filter table data based on search term
  const filteredTableData = tableData.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = () => {
    setCurrentTable({
      id: null,
      name: '',
      type: 'Bàn Tiêu chuẩn 1',
      price: '',
      minGuests: 1,
      maxGuests: 1,
      status: 'Còn trống',
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

  const handleSaveTable = () => {
    if (isEditing) {
      setTableData((prevData) =>
        prevData.map((table) => (table.id === currentTable.id ? { ...currentTable } : table))
      );
    } else {
      setTableData((prevData) => [
        ...prevData,
        { ...currentTable, id: prevData.length + 1 },
      ]);
    }
    closeModal();
  };

  const handleConfirmDelete = () => {
    setTableData((prevData) => prevData.filter((table) => table.id !== tableToDelete.id));
    setTableToDelete(null);
    closeDeletePopup();
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden px-8 flex-col pb-72 w-full bg-white max-md:px-5 max-md:pb-24">
            <TableHeader openModal={openModal} searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <section className="w-full mt-10">
              <div className="grid grid-cols-8 gap-4 px-5 w-full font-semibold bg-white text-sm min-h-[40px] text-neutral-900 max-md:text-xs">
                <div className="text-center break-words">ID Bàn</div>
                <div className="text-center break-words">Tên Bàn</div>
                <div className="text-center break-words">Loại bàn</div>
                <div className="text-center break-words">Mức giá tối thiểu</div>
                <div className="text-center break-words">Lượng khách tối thiểu</div>
                <div className="text-center break-words">Lượng khách tối đa</div>
                <div className="text-center break-words">Trạng thái</div>
                <div className="text-center break-words">Hành động</div>
              </div>
              {filteredTableData.map((table, index) => (
                <TableRow
                  key={table.id}
                  {...table}
                  isEven={index % 2 === 0}
                  openEditModal={openEditModal}
                  openDeletePopup={openDeletePopup}
                />
              ))}
            </section>

            {/* Modal thêm/chỉnh sửa bàn */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 w-[500px]">
                  <h2 className="text-2xl font-semibold mb-6">
                    {isEditing ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
                  </h2>

                  <div className="mb-4">
                    <label className="block mb-2">Tên bàn</label>
                    <input
                      type="text"
                      name="name"
                      value={currentTable.name}
                      onChange={handleInputChange}
                      className="block w-full p-2 border"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Loại bàn</label>
                    <input
                      type="text"
                      name="type"
                      value={currentTable.type}
                      readOnly
                      className="block w-full p-2 border bg-gray-100"
                    />
                  </div>

                  <div className="flex justify-between mt-10">
                    <button
                      className="bg-gray-400 text-white py-3 w-48 rounded-full"
                      onClick={closeModal}
                    >
                      Hủy
                    </button>
                    <button
                      className="bg-blue-600 text-white py-3 w-48 rounded-full"
                      onClick={handleSaveTable}
                    >
                      {isEditing ? 'Lưu' : 'Thêm'}
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
                  <p>Bạn có chắc chắn muốn xóa bàn: <strong>{tableToDelete?.name}</strong>?</p>
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

function TableHeader({ openModal, searchTerm, onSearchChange }) {
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
          onClick={() => navigate('/staff/table-management')}
        />
        <h3 className="basis-auto">Bàn Tiêu chuẩn 1</h3>
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

function TableRow({ id, name, type, price, minGuests, maxGuests, status, isEven, openEditModal, openDeletePopup }) {
  const rowClass = isEven
    ? "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-orange-50 border-b border-gray-200 text-sm min-h-[60px] break-words"
    : "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-white border-b border-orange-200 text-sm min-h-[60px] break-words";

  const statusClass = status === 'Còn trống' ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className={rowClass}>
      <div className="text-center font-normal">{id}</div>
      <div className="text-center font-normal">{name}</div>
      <div className="text-center font-normal">{type}</div>
      <div className="text-center font-normal">{price}</div>
      <div className="text-center font-normal">{minGuests}</div>
      <div className="text-center font-normal">{maxGuests}</div>
      <div className={`text-center ${statusClass} font-semibold`}>{status}</div>
      <div className="flex justify-center gap-5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
          alt="Edit"
          className="cursor-pointer w-5 h-5"
          onClick={() => openEditModal({ id, name, type, price, minGuests, maxGuests, status })}
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e"
          alt="Delete"
          className="cursor-pointer w-5 h-5"
          onClick={() => openDeletePopup({ id, name })}
        />
      </div>
    </div>
  );
}

TableRow.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  minGuests: PropTypes.number.isRequired,
  maxGuests: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  isEven: PropTypes.bool.isRequired,
  openEditModal: PropTypes.func.isRequired,
  openDeletePopup: PropTypes.func.isRequired,
};

export default TableManagement;
