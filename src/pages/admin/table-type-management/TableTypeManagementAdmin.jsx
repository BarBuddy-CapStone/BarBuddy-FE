import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // Import axios for API calls

const TableTypeManagementAdmin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableTypes, setTableTypes] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Fetch table types from the API when the component mounts
  useEffect(() => {
    fetchTableTypes();
  }, []);

  const fetchTableTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7069/api/TableType');
      const tableTypesWithIcons = response.data.map((tableType) => ({
        ...tableType,
        editIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e',
        deleteIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e',
      }));
      setTableTypes(tableTypesWithIcons);
    } catch (error) {
      handleNotification('Error fetching table types', 'error');
    }
  };

  const handleNotification = (message, type) => {
    setNotification({ message, type });
    setIsNotificationVisible(true);

    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 5000);
  };

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

  const handleDelete = async () => {
    if (!selectedTableType) return;
  
    try {
      const response = await axios.delete(`https://localhost:7069/api/TableType/${selectedTableType.tableTypeId}`);
      if (response.status === 200) {
        handleNotification('Đã xóa loại bàn thành công', 'success');
        await fetchTableTypes();
      } else if (response.status === 202) {
        handleNotification(response.data || 'Vẫn còn bàn đang hoạt động thuộc loại bàn này, vui lòng cập nhật lại tất cả bàn của các chi nhánh trước khi xóa loại bàn này', 'warning');
      }
    } catch (error) {
      handleNotification(error.response?.data || 'Error deleting table type', 'error');
    } finally {
      setIsDeletePopupOpen(false);
      setSelectedTableType(null);
    }
  };

  const handleAddTableType = async (event, tableTypeData) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7069/api/TableType', tableTypeData);
      if (response.status === 201 || response.status === 200) {
        handleNotification('Đã thêm loại bàn thành công', 'success');
        await fetchTableTypes();
        handleClosePopup();
      }
    } catch (error) {
      handleNotification(error.response?.data || 'Error adding table type', 'error');
    }
  };

  const handleEditTableType = async (event, tableTypeData) => {
    event.preventDefault();

    try {
      const response = await axios.put(`https://localhost:7069/api/TableType/${selectedTableType.tableTypeId}`, tableTypeData);
      if (response.status === 200) {
        handleNotification('Đã cập nhật loại bàn thành công', 'success');
        await fetchTableTypes();
        handleClosePopup();
      }
    } catch (error) {
      handleNotification(error.response?.data || 'Error updating table type', 'error');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-6 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <BelowHeader onAddTableType={handleOpenPopup} searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
            <TableTypeList 
              tableTypes={filteredTableTypes} 
              onOpenDeletePopup={handleOpenDeletePopup} 
              onTableTypeUpdated={fetchTableTypes} 
              handleNotification={handleNotification} // Thêm dòng này
            />
          </div>
        </div>
      </div>
      <AddTableTypePopup isOpen={isPopupOpen} onClose={handleClosePopup} onTableTypeAdded={fetchTableTypes} handleAddTableType={handleAddTableType} />
      <DeleteTableTypePopup isOpen={isDeletePopupOpen} onClose={handleCloseDeletePopup} onDelete={handleDelete} tableType={selectedTableType} />

      {/* Notification Popup */}
      {isNotificationVisible && (
  <div
    className={`fixed top-4 right-4 p-4 rounded shadow-md ${
      notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
    } text-white flex items-center justify-between`}
  >
    <span>{notification.message}</span>
    {/* Nút đóng */}
    <button
      className="ml-4 text-lg font-bold"
      onClick={() => setIsNotificationVisible(false)}
    >
      &times;
    </button>
  </div>
)}

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
        className="px-4 py-2 border rounded-full w-1/6"
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
// const tableTypes = [
//   {
//     title: "Bàn SVIP",
//     price: "Từ 10.000.000 VND",
//     capacity: "1 - 20 Khách hàng",
//     description: "Bàn SVIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao nhất tại quán, phù hợp cho nhóm khách hàng từ 1-20 người, mức giá tối thiểu chỉ từ 20.000.000 VND.",
//     editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
//     deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
//   },
//   {
//     title: "Bàn VIP",
//     price: "Từ 5.000.000 VND",
//     capacity: "1 - 15 Khách hàng",
//     description: "Bàn VIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao tại quán, phù hợp cho nhóm khách hàng từ 1-15 người, mức giá tối thiểu chỉ từ 10.000.000 VND.",
//     editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
//     deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
//   },
//   {
//     title: "Bàn Tiêu chuẩn 1",
//     price: "Từ 600.000 VND",
//     capacity: "2 - 4 Khách hàng",
//     description: "Bàn Tiêu chuẩn 1 phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán, phù hợp cho nhóm khách hàng từ 1-4 người, mức giá tối thiểu chỉ từ 600.000 VND.",
//     editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
//     deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3051512a340f35676686c616a2fbdbd5e87b25a04103e57f5ada2f119f872569?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
//   },
//   {
//     title: "Bàn Quầy Bar",
//     price: "Từ 150.000 VND",
//     capacity: "1 Khách hàng",
//     description: "Bàn Quầy Bar phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán và được phụ vụ trực tiếp bởi các Bartender, mức giá tối thiểu chỉ từ 300.000 VND.",
//     editIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e",
//     deleteIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
//   }
// ];

const TableTypeList = ({ tableTypes, onOpenDeletePopup, onTableTypeUpdated, handleNotification }) => {
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
          <TableTypeCard
            key={index}
            typeName={tableType.typeName}
            minimumPrice={tableType.minimumPrice}
            minimumGuest={tableType.minimumGuest}
            maximumGuest={tableType.maximumGuest}
            description={tableType.description}
            editIcon={tableType.editIcon}
            deleteIcon={tableType.deleteIcon}
            onEdit={() => handleEdit(tableType)}
            onDelete={() => onOpenDeletePopup(tableType)}
          />
        ))}
      </div>
      {selectedTableType && (
        <EditTableTypePopup
          isOpen={isEditPopupOpen}
          onClose={handleCloseEditPopup}
          tableType={selectedTableType}
          onTableTypeUpdated={onTableTypeUpdated}
          handleNotification={handleNotification} // Truyền hàm handleNotification xuống
        />
      )}
    </section>
  );
};

TableTypeList.propTypes = {
  tableTypes: PropTypes.array.isRequired,
  onOpenDeletePopup: PropTypes.func.isRequired,
  onTableTypeUpdated: PropTypes.func.isRequired,
  handleNotification: PropTypes.func.isRequired, // Thêm prop này
};


// TableTypeCard component
const TableTypeCard = ({ typeName, minimumPrice, minimumGuest, maximumGuest, description, editIcon, deleteIcon, onEdit, onDelete }) => {
  // Format minimumPrice using toLocaleString
  const formattedPrice = minimumPrice.toLocaleString('vi-VN'); 

  // Determine guest capacity display
  const guestCapacity = minimumGuest === maximumGuest ? `${maximumGuest} khách hàng` : `${minimumGuest} - ${maximumGuest} khách hàng`;

  return (
    <div className="flex flex-col px-4 py-5 w-full rounded-xl bg-zinc-300 bg-opacity-50 shadow-md text-base">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{typeName}</div>
        <div className="flex gap-2.5">
          <img loading="lazy" src={editIcon} alt="Edit" className="object-contain w-5 aspect-square cursor-pointer mt-1" onClick={onEdit} />
          <img loading="lazy" src={deleteIcon} alt="Delete" className="object-contain w-5 aspect-square cursor-pointer mt-1" onClick={onDelete} />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">Từ {formattedPrice} VND</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">Phù hợp cho {guestCapacity}</div>
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
  typeName: PropTypes.string.isRequired,
  minimumPrice: PropTypes.number.isRequired,
  minimumGuest: PropTypes.number.isRequired,
  maximumGuest: PropTypes.number.isRequired,
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
const AddTableTypePopup = ({ isOpen, onClose, onTableTypeAdded, handleAddTableType }) => {
  const [typeName, setTypeName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumGuest, setMinimumGuest] = useState('');
  const [maximumGuest, setMaximumGuest] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const tableTypeData = {
      typeName,
      description,
      minimumGuest: parseInt(minimumGuest, 10),
      maximumGuest: parseInt(maximumGuest, 10),
      minimumPrice: parseFloat(minimumPrice),
    };
    handleAddTableType(event, tableTypeData);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Thêm loại bàn</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên loại bàn</label>
            <input
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả loại bàn</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối thiểu</label>
            <input
              type="number"
              value={minimumGuest}
              onChange={(e) => setMinimumGuest(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="99"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối đa</label>
            <input
              type="number"
              value={maximumGuest}
              onChange={(e) => setMaximumGuest(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="99"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mức giá tối thiểu</label>
            <input
              type="number"
              value={minimumPrice}
              onChange={(e) => setMinimumPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="1000000000"
              required
            />
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" className="bg-gray-400 text-white py-3 w-64 rounded-full" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="bg-blue-600 text-white py-3 w-64 rounded-full">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

AddTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTableTypeAdded: PropTypes.func.isRequired,
  handleAddTableType: PropTypes.func.isRequired,
};

// EditTableTypePopup component 
const EditTableTypePopup = ({ isOpen, onClose, tableType, onTableTypeUpdated, handleNotification }) => {
  const [typeName, setTypeName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumGuest, setMinimumGuest] = useState('');
  const [maximumGuest, setMaximumGuest] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');

  useEffect(() => {
    if (tableType) {
      setTypeName(tableType.typeName);
      setDescription(tableType.description);
      setMinimumGuest(tableType.minimumGuest);
      setMaximumGuest(tableType.maximumGuest);
      setMinimumPrice(tableType.minimumPrice);
    }
  }, [tableType]);

  const handleEditTableType = async (event) => {
    event.preventDefault();

    if (!typeName || !description || minimumGuest === '' || maximumGuest === '' || minimumPrice === '') {
      handleNotification('All fields are required.', 'error');
      return;
    }

    const minGuest = parseInt(minimumGuest, 10);
    const maxGuest = parseInt(maximumGuest, 10);
    const minPrice = parseFloat(minimumPrice);

    if (minGuest > maxGuest) {
      handleNotification('Minimum guests must be less than or equal to maximum guests.', 'error');
      return;
    }

    try {
      const response = await axios.put(`https://localhost:7069/api/TableType/${tableType.tableTypeId}`, {
        typeName,
        description,
        minimumGuest: minGuest,
        maximumGuest: maxGuest,
        minimumPrice: minPrice,
      });

      if (response.status === 200) {
        await onTableTypeUpdated();
        handleNotification('Thông tin loại bàn đã được cập nhật thành công', 'success'); // Hiển thị thông báo thành công
        onClose();
      } else {
        handleNotification('Failed to update table type.', 'error');
      }
    } catch (error) {
      handleNotification('Error updating table type.', 'error');
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa loại bàn</h2>
        <form onSubmit={handleEditTableType}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên loại bàn</label>
            <input
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mô tả loại bàn</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối thiểu</label>
            <input
              type="number"
              value={minimumGuest}
              onChange={(e) => {
                const value = Math.max(0, Math.min(99, e.target.value));
                setMinimumGuest(value);
              }}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="99"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số lượng khách hàng tối đa</label>
            <input
              type="number"
              value={maximumGuest}
              onChange={(e) => {
                const value = Math.max(0, Math.min(99, e.target.value));
                setMaximumGuest(value);
              }}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="99"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mức giá tối thiểu</label>
            <input
              type="number"
              value={minimumPrice}
              onChange={(e) => {
                const value = Math.max(0, Math.min(1000000000, e.target.value));
                setMinimumPrice(value);
              }}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="1000000000"
              required
            />
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
  ) : null;
};

EditTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableType: PropTypes.object.isRequired,
  onTableTypeUpdated: PropTypes.func.isRequired,
  handleNotification: PropTypes.func.isRequired, // Thêm prop này để đảm bảo hàm handleNotification được truyền vào
};

export default TableTypeManagementAdmin;