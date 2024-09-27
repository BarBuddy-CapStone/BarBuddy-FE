import { useState } from 'react';
import PropTypes from 'prop-types';

const TableTypeManagementAdmin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleOpenDeletePopup = (tableType) => {
    setSelectedTableType(tableType);
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedTableType(null);
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(false);
    setSelectedTableType(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term state
  };

  // Filter table types based on search term
  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-6 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <BelowHeader onAddTableType={handleOpenPopup} searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
            <TableTypeList tableTypes={filteredTableTypes} onOpenDeletePopup={handleOpenDeletePopup} />
          </div>
        </div>
      </div>
      <AddTableTypePopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      <DeleteTableTypePopup
        isOpen={isDeletePopupOpen}
        onClose={handleCloseDeletePopup}
        onDelete={handleDelete}
        tableType={selectedTableType}
      />
    </main>
  );
};


const BelowHeader = ({ onAddTableType, searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center justify-between ml-4 mr-4 mt-6">
      <input
        type="text"
        placeholder="Tìm kiếm loại bàn..."
        value={searchTerm}
        onChange={onSearchChange}
        className="px-4 py-2 border rounded-full w-1/6" // Increased border-radius and adjusted width
      />
      <button
        onClick={onAddTableType}
        className="flex items-center gap-2 px-4 py-2 text-base text-black bg-white rounded-md border border-blue-500 shadow hover:bg-gray-300"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/05719b0bc8adf147a0e97f780bea0ba2d2f701cac417ada50303bc5f38458fc4?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
          alt=""
          className="object-contain w-4 h-4 align-middle"
        />
        <span>Thêm loại bàn</span>
      </button>
    </div>
  );
};

BelowHeader.propTypes = {
  onAddTableType: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

// TableTypeList component
const tableTypes = [
  {
    title: "Bàn SVIP",
    price: "Từ 10.000.000 VND",
    capacity: "1 - 20 Khách hàng",
    description: "Bàn SVIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao nhất tại quán, phù hợp cho nhóm khách hàng từ 1-20 người, mức giá tối thiểu chỉ từ 20.000.000 VND.",
    editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
    deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
  },
  {
    title: "Bàn VIP",
    price: "Từ 5.000.000 VND",
    capacity: "1 - 15 Khách hàng",
    description: "Bàn VIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao tại quán, phù hợp cho nhóm khách hàng từ 1-15 người, mức giá tối thiểu chỉ từ 10.000.000 VND.",
    editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
    deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
  },
  {
    title: "Bàn Tiêu chuẩn 1",
    price: "Từ 600.000 VND",
    capacity: "2 - 4 Khách hàng",
    description: "Bàn Tiêu chuẩn 1 phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán, phù hợp cho nhóm khách hàng từ 1-4 người, mức giá tối thiểu chỉ từ 600.000 VND.",
    editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
    deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3051512a340f35676686c616a2fbdbd5e87b25a04103e57f5ada2f119f872569?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
  },
  {
    title: "Bàn Quầy Bar",
    price: "Từ 150.000 VND",
    capacity: "1 Khách hàng",
    description: "Bàn Quầy Bar phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán và được phụ vụ trực tiếp bởi các Bartender, mức giá tối thiểu chỉ từ 300.000 VND.",
    editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
    deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
  }
];

const TableTypeList = ({ tableTypes, onOpenDeletePopup }) => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState(null);

  const handleEdit = (tableType) => {
    setSelectedTableType(tableType);
    setIsEditPopupOpen(true);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedTableType(null);
  };

  return (
    <section className="mt-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tableTypes.map((tableType, index) => (
          <TableTypeCard key={index} {...tableType} onEdit={() => handleEdit(tableType)} onDelete={() => onOpenDeletePopup(tableType)} />
        ))}
      </div>
      {selectedTableType && (
        <EditTableTypePopup
          isOpen={isEditPopupOpen}
          onClose={handleCloseEditPopup}
          tableType={selectedTableType}
        />
      )}
    </section>
  );
};

TableTypeList.propTypes = {
  tableTypes: PropTypes.array.isRequired,
  onOpenDeletePopup: PropTypes.func.isRequired,
};

// TableTypeCard component
const TableTypeCard = ({ title, price, capacity, description, editIcon, deleteIcon, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col px-4 py-5 w-full rounded-xl bg-zinc-300 bg-opacity-50 shadow-md text-base">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{title}</div>
        <div className="flex gap-2.5">
          <img loading="lazy" src={editIcon} alt="Edit" className="object-contain w-5 aspect-square cursor-pointer mt-1" onClick={onEdit} />
          <img loading="lazy" src={deleteIcon} alt="Delete" className="object-contain w-5 aspect-square cursor-pointer mt-1" onClick={onDelete} />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{price}</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{capacity}</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/18e31dd061c2c9a5014fa200f3d41a3af7c7be1a1c257c334215ffcda0d6a00c?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{description}</div>
        </div>
      </div>
    </div>
  );
};

TableTypeCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  capacity: PropTypes.string.isRequired,
  description: PropTypes.string,
  editIcon: PropTypes.string.isRequired,
  deleteIcon: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// DeleteTableTypePopup component
const DeleteTableTypePopup = ({ isOpen, onClose, onDelete, tableType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]">
        <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa loại bàn: <strong>{tableType?.title}</strong>?</p>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-400 text-white py-3 w-48 rounded-full"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white py-3 w-48 rounded-full"
            onClick={onDelete}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  tableType: PropTypes.object,
};


// AddTableTypePopup component  
const AddTableTypePopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Thêm loại bàn</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Tên loại bàn</label>
            <input type="text" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả loại bàn</label>
            <textarea className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mức giá tối thiểu</label>
            <input type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối thiểu</label>
            <input type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối đa</label>
            <input type="number" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white py-3 w-64 rounded-full"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 w-64 rounded-full"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// EditTableTypePopup component 
const EditTableTypePopup = ({ isOpen, onClose, tableType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa loại bàn</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Tên loại bàn</label>
            <input type="text" defaultValue={tableType.title} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả loại bàn</label>
            <textarea defaultValue={tableType.description} className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mức giá tối thiểu</label>
            <input type="number" defaultValue={tableType.price} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối thiểu</label>
            <input type="number" defaultValue={tableType.minCapacity} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối đa</label>
            <input type="number" defaultValue={tableType.maxCapacity} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white py-3 w-64 rounded-full"
              onClick={onClose}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 w-64 rounded-full"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


EditTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableType: PropTypes.object.isRequired,
};


export default TableTypeManagementAdmin;