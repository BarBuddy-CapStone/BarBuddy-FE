import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const tableData = [
  { id: 1, tableId: 'TCA01', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 2, tableId: 'TCA02', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Đang phục vụ' },
  { id: 3, tableId: 'TCA03', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 4, tableId: 'TCA04', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 5, tableId: 'TCA05', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Đang phục vụ' },
  { id: 6, tableId: 'TCA06', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 7, tableId: 'TCA07', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
  { id: 8, tableId: 'TCA08', name: 'Bàn Tiêu chuẩn 1', price: '600.000 VND', minGuests: 2, maxGuests: 4, status: 'Còn trống' },
];

function TableManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái để phân biệt chỉnh sửa
    const [currentTable, setCurrentTable] = useState({
      tableId: '',
      name: 'Bàn Tiêu chuẩn 1',
      status: 'Còn trống',
    });

    const openModal = () => {
        setCurrentTable({ tableId: '', name: 'Bàn Tiêu chuẩn 1', status: 'Còn trống' }); // Reset form cho thêm mới
        setIsModalOpen(true);
        setIsEditing(false); // Đặt mặc định là thêm mới
    };

    const openEditModal = (table) => {
        setCurrentTable(table); // Đặt bàn hiện tại vào modal
        setIsModalOpen(true);
        setIsEditing(true); // Đặt trạng thái là chỉnh sửa
    };

    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentTable({ ...currentTable, [name]: value });
    };

    const handleSaveTable = () => {
      if (isEditing) {
        // Logic cập nhật bàn
        console.log('Cập nhật bàn:', currentTable);
      } else {
        // Logic thêm bàn mới
        console.log('Thêm bàn mới:', currentTable);
      }
      closeModal();
    };

    return (
      <div className="overflow-hidden bg-white">
        <div className="flex gap-5 max-md:flex-col">
          <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col px-10 pt-7 pb-72 w-full bg-white max-md:px-5 max-md:pb-24">
              <h1 className="self-start text-4xl font-bold text-sky-900">QUẢN LÝ BÀN</h1>
              <TableHeader openModal={openModal} />
              <section className="w-full mt-10">
                {/* Bảng hiển thị */}
                <div className="grid grid-cols-8 gap-4 px-5 w-full font-semibold bg-white text-base min-h-[40px] text-neutral-900 max-md:max-w-full border-b-2 border-gray-200">
                  <div className="whitespace-nowrap text-center">ID Bàn</div>
                  <div className="whitespace-nowrap text-center">Tên Bàn</div>
                  <div className="whitespace-nowrap text-center">Loại bàn</div>
                  <div className="whitespace-nowrap text-center">Mức giá tối thiểu</div>
                  <div className="whitespace-nowrap text-center">Lượng khách tối thiểu</div>
                  <div className="whitespace-nowrap text-center">Lượng khách tối đa</div>
                  <div className="whitespace-nowrap text-center">Trạng thái</div>
                  <div className="whitespace-nowrap text-center">Hành động</div>
                </div>
                {tableData.map((table, index) => (
                  <TableRow key={table.id} {...table} isEven={index % 2 === 0} openEditModal={openEditModal} />
                ))}
              </section>

              {/* Modal thêm/chỉnh sửa bàn */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-[500px]"> {/* Điều chỉnh width thành 500px */}
                    <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}</h2>
      
                    <div className="mb-4">
                    <label className="block mb-2">Tên bàn</label>
                    <input
                        type="text"
                        name="tableId"
                        value={currentTable.tableId}
                        onChange={handleInputChange}
                        className="block w-full p-2 border"
                    />
                    </div>

                    <div className="mb-4">
                    <label className="block mb-2">Loại bàn</label>
                    <input
                        type="text"
                        name="name"
                        value={currentTable.name}
                        readOnly
                        className="block w-full p-2 border bg-gray-100"
                    />
                    </div>

                    {/* Chỉ hiển thị trạng thái nếu là chỉnh sửa */}
                    {isEditing && (
                    <div className="mb-4">
                    <label className="block mb-2">Trạng thái</label>
                    <select
                        name="status"
                        value={currentTable.status}
                        onChange={handleInputChange}
                        className="block w-full p-2 border"
                    >
                        <option value="Còn trống">Còn trống</option>
                        <option value="Đang phục vụ">Đang phục vụ</option>
                        <option value="Không có sẵn">Không có sẵn</option>
                    </select>
                    </div>
                    )}

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

            </div>
          </main>
        </div>
      </div>
    );
  }

  function TableHeader({ openModal }) {
    const navigate = useNavigate();
  
    return (
      <div className="flex justify-between items-center mt-8 w-full text-black">
        <div className="flex items-center gap-4 text-3xl font-bold">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
            className="object-contain cursor-pointer shrink-0 w-16 aspect-square"
            alt="icon"
            onClick={() => navigate('/staff/table-management')}
          />
          <h3 className="basis-auto">Bàn Tiêu chuẩn 1</h3>
        </div>
        <button
          className="flex items-center gap-2.5 px-3 py-2 my-auto text-xl bg-white rounded-md border border-black shadow-lg"
          onClick={openModal}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b3a3b60968561c5c184b173073ded83218c326d8daa832d8e11a3cde174d1afd?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
            className="object-contain w-6"
            alt="add icon"
          />
          <span className="basis-auto">Thêm bàn mới</span>
        </button>
      </div>
    );
  }
  
  TableHeader.propTypes = {
    openModal: PropTypes.func.isRequired, // Thêm xác thực cho props
  };

  function TableRow({ id, tableId, name, price, minGuests, maxGuests, status, isEven, openEditModal }) {
    const rowClass = isEven
      ? "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-white border-b border-gray-200 text-lg min-h-[60px]"
      : "grid grid-cols-8 gap-4 px-5 py-4 w-full bg-orange-50 border-b border-orange-200 text-lg min-h-[60px]";
  
    const statusClass = status === 'Còn trống' ? 'text-green-500' : 'text-yellow-500';
  
    return (
      <div className={rowClass}>
        <div className="text-center font-normal">{id}</div>
        <div className="text-center font-normal">{tableId}</div>
        <div className="text-center font-normal">{name}</div>
        <div className="text-center font-normal">{price}</div>
        <div className="text-center font-normal">{minGuests}</div>
        <div className="text-center font-normal">{maxGuests}</div>
        <div className={`text-center ${statusClass} font-semibold`}>{status}</div>
        <div className="flex justify-center gap-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
            alt="Edit"
            className="cursor-pointer w-6 h-6"
            onClick={() => openEditModal({ id, tableId, name, price, minGuests, maxGuests, status })}
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e"
            alt="Delete"
            className="cursor-pointer w-6 h-6"
          />
        </div>
      </div>
    );
  }

TableRow.propTypes = {
  id: PropTypes.number.isRequired,
  tableId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  minGuests: PropTypes.number.isRequired,
  maxGuests: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  isEven: PropTypes.bool.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

export default TableManagement;
