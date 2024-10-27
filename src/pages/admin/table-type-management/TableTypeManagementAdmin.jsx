import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TableTypeService from '../../../lib/service/tableTypeService';
import { toast } from 'react-toastify';
import { CircularProgress, TextField, Button, InputAdornment } from "@mui/material"; // Import CircularProgress từ MUI
import { Search, Add } from "@mui/icons-material"; // Thêm import Search từ MUI

const TableTypeManagementAdmin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedTableType, setSelectedTableType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableTypes, setTableTypes] = useState([]);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [searchInput, setSearchInput] = useState(''); // Thêm state mới cho input tìm kiếm

  useEffect(() => {
    fetchTableTypes();
  }, [status]); 

  const fetchTableTypes = useCallback(async () => {
    setLoading(true); // Bt đầu loading
    try {
      const response = await TableTypeService.getAllTableTypesAdmin({ Status: status });
      setTableTypes(response.data.data.map((tableType) => ({
        ...tableType,
        editIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/85692fa89ec6efbe236367c333447229988de5c950127aab2c346b9cdd885bdb',
        deleteIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/12c72d419b305d862ab6fa5862b71d422877c54c8665826d40efd0e2e2d1840e',
      })));
    } catch {
      notify('Error fetching table types', 'error');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  }, [status]);

  const notify = (message, type = 'success') => toast[type](message);

  const handlePopup = (isOpen, type = null) => {
    setIsPopupOpen(isOpen);
    if (type) setSelectedTableType(type);
  };

  const handleDeletePopup = (isOpen, tableType = null) => {
    setIsDeletePopupOpen(isOpen);
    if (tableType) setSelectedTableType(tableType);
  };

  const handleDelete = async () => {
    if (!selectedTableType) return;

    try {
      const response = await TableTypeService.deleteTableType(selectedTableType.tableTypeId);
      if (response.status === 200) {
        notify('Đã xóa loại bàn thành công');
        fetchTableTypes();
      } else if (response.status === 202) {
        notify(response.data.message || 'Vn còn bàn đang hoạt động thuộc loại bàn này, vui lòng cập nhật lại trước khi xóa.', 'warning');
      } else {
        notify('Có lỗi xảy ra trong quá trình xóa loại bàn', 'error');
      }
    } catch (error) {
      notify(error.response?.data || 'Error deleting table type', 'error');
    } finally {
      handleDeletePopup(false);
    }
  };

  const handleAddTableType = async (event, tableTypeData) => {
    event.preventDefault();
    try {
      await TableTypeService.addTableType(tableTypeData);
      notify('Đã thêm loại bàn thành công');
      fetchTableTypes();
      setResetFormTrigger(true);
      handlePopup(false);
    } catch (error) {
      notify(error.response?.data || 'Error adding table type', 'error');
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleSearchChange = (event) => setSearchInput(event.target.value);

  const handleStatusChange = (event) => {
    setStatus(parseInt(event.target.value, 10));
  };

  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
  <div className="flex flex-col gap-0 max-md:flex-col">
    <BelowHeader 
      onAddTableType={() => handlePopup(true)} 
      searchInput={searchInput} 
      onSearchChange={handleSearchChange}
      onSearch={handleSearch}
      status={status} 
      onStatusChange={handleStatusChange} 
    />
    <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
      <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">Danh Sách Loại Bàn</h2>
      {loading ? ( // Kiểm tra nếu đang loading
        <div className="flex justify-center items-center h-32">
          <CircularProgress /> {/* Hiển thị spinner */}
        </div>
      ) : filteredTableTypes.length === 0 ? ( // Kiểm tra nếu không có dữ liệu
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500 text-lg font-semibold">Không có loại bàn</p>
        </div>
      ) : (
        <TableTypeList
          tableTypes={filteredTableTypes}
          onOpenDeletePopup={(tableType) => handleDeletePopup(true, tableType)}
          onTableTypeUpdated={fetchTableTypes}
          notify={notify}
        />
      )}
    </div>
  </div>
  <AddTableTypePopup
    isOpen={isPopupOpen}
    onClose={() => handlePopup(false)}
    handleAddTableType={handleAddTableType}
    resetFormTrigger={resetFormTrigger}
    setResetFormTrigger={setResetFormTrigger}
  />
  <DeleteTableTypePopup
    isOpen={isDeletePopupOpen}
    onClose={() => handleDeletePopup(false)}
    onDelete={handleDelete}
    tableType={selectedTableType}
  />
</main>

  );
};

const BelowHeader = ({ onAddTableType, searchInput, onSearchChange, onSearch, status, onStatusChange }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mx-4 mt-6">
    <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Tìm kiếm loại bàn..."
          value={searchInput}
          onChange={onSearchChange}
          className="w-full px-4 py-2 pr-10 border border-sky-900 rounded-full"
        />
        <Search 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
          onClick={onSearch}
        />
      </div>
      <select
        value={status}
        onChange={onStatusChange}
        className="px-4 py-2 border border-sky-900 rounded-full w-full sm:w-auto"
      >
        <option value={0}>Tất cả</option>
        <option value={1}>Loại bàn đang được sử dụng</option>
        <option value={2}>Loại bàn không được sử dụng</option>
      </select>
    </div>
    <button
      onClick={onAddTableType}
      className="flex items-center justify-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
    >
      <Add className="w-5 h-5" />
      <span>Thêm loại bàn</span>
    </button>
  </div>
);

BelowHeader.propTypes = {
  onAddTableType: PropTypes.func.isRequired,
  searchInput: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired, // Thêm prop mới
  status: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func.isRequired,
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

const TableTypeList = ({ tableTypes, onOpenDeletePopup, onTableTypeUpdated, notify }) => {
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
            {...tableType}
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
          handleNotification={notify}
        />
      )}
    </section>
  );
};

TableTypeList.propTypes = {
  tableTypes: PropTypes.array.isRequired,
  onOpenDeletePopup: PropTypes.func.isRequired,
  onTableTypeUpdated: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

// TableTypeCard component
const TableTypeCard = ({ typeName, minimumPrice, minimumGuest, maximumGuest, description, editIcon, deleteIcon, onEdit, onDelete }) => {
  const formattedPrice = minimumPrice.toLocaleString('vi-VN');
  const guestCapacity = minimumGuest === maximumGuest ? `${maximumGuest} khách hàng` : `${minimumGuest} - ${maximumGuest} khách hàng`;

  return (
    <div className="flex flex-col px-4 py-5 w-full rounded-xl bg-neutral-200 bg-opacity-50 shadow-md text-base">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{typeName}</div>
        <div className="flex gap-2.5">
          <button 
            onClick={onEdit}
            className="p-1 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            <img loading="lazy" src={editIcon} alt="Edit" className="object-contain w-5 aspect-square cursor-pointer" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1 rounded-full hover:bg-gray-300 transition-colors duration-200"
          >
            <img loading="lazy" src={deleteIcon} alt="Delete" className="object-contain w-5 aspect-square cursor-pointer" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">Từ {formattedPrice} VND</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">Phù hợp cho {guestCapacity}</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/18e31dd061c2c9a5014fa200f3d41a3af7c7be1a1c257c334215ffcda0d6a00c" alt="" className="w-5 aspect-square mt-1" />
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
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]">
        <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa loại bàn: <strong>{tableType?.title}</strong>?</p>
        <div className="flex justify-between mt-6">
          <button type="button" className="bg-gray-400 text-white py-3 w-48 rounded-full" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="button" className="bg-blue-600 text-white py-3 w-48 rounded-full flex items-center justify-center" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Xóa'}
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

const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('vi-VN');
};

const AddTableTypePopup = ({ isOpen, onClose, handleAddTableType, resetFormTrigger, setResetFormTrigger }) => {
  const [typeName, setTypeName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumGuest, setMinimumGuest] = useState('');
  const [maximumGuest, setMaximumGuest] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [minimumPriceDisplay, setMinimumPriceDisplay] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen || resetFormTrigger) {
      setTypeName('');
      setDescription('');
      setMinimumGuest('');
      setMaximumGuest('');
      setMinimumPrice('');
      setMinimumPriceDisplay('');
      setErrors({});
      setResetFormTrigger(false);
    }
  }, [isOpen, resetFormTrigger]);

  const handleMinimumPriceChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setMinimumPrice(value);
    setMinimumPriceDisplay(formatCurrency(value));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!typeName || typeName.length < 1 || typeName.length > 99) {
      formErrors.typeName = 'Tên loại bàn không được bỏ trống và phải trong khoảng 1-99 kí tự';
    }
    if (!description || description.length < 1 || description.length > 999) {
      formErrors.description = 'Mô tả loại bàn không được bỏ trống và phải trong khoảng 1-999 kí tự';
    }
    const minGuest = parseInt(minimumGuest, 10);
    const maxGuest = parseInt(maximumGuest, 10);
    if (!minimumGuest || !maximumGuest || minGuest > maxGuest || minGuest < 1 || maxGuest > 99) {
      formErrors.guests = 'Số lượng khách hàng tối thiểu phải nhỏ hơn hoặc bằng số lượng khách hàng tối đa và cả hai phải trong khoảng 1-99';
    }
    const minPrice = parseFloat(minimumPrice);
    if (!minimumPrice || minPrice < 0 || minPrice > 100000000) {
      formErrors.minimumPrice = 'Mức giá tối thiểu phải nằm trong khoảng 0-100.000.000';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const tableTypeData = {
      typeName,
      description,
      minimumGuest: parseInt(minimumGuest, 10),
      maximumGuest: parseInt(maximumGuest, 10),
      minimumPrice: parseFloat(minimumPrice),
    };
    await handleAddTableType(event, tableTypeData);
    setIsLoading(false);
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Thêm loại bàn</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại bàn</label>
            <TextField
              fullWidth
              variant="outlined"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              error={!!errors.typeName}
              helperText={errors.typeName}
              placeholder="Nhập tên loại bàn"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả loại bàn</label>
            <TextField
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              placeholder="Nhập mô tả loại bàn"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách hàng tối thiểu</label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={minimumGuest}
              onChange={(e) => setMinimumGuest(e.target.value)}
              error={!!errors.guests}
              helperText={errors.guests}
              InputProps={{
                inputProps: { min: 1, max: 99 },
                endAdornment: <InputAdornment position="end">khách</InputAdornment>,
              }}
              placeholder="Nhập số lượng tối thiểu"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách hàng tối đa</label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={maximumGuest}
              onChange={(e) => setMaximumGuest(e.target.value)}
              error={!!errors.guests}
              helperText={errors.guests}
              InputProps={{
                inputProps: { min: 1, max: 99 },
                endAdornment: <InputAdornment position="end">khách</InputAdornment>,
              }}
              placeholder="Nhập số lượng tối đa"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mức giá tối thiểu</label>
            <TextField
              fullWidth
              variant="outlined"
              value={minimumPriceDisplay}
              onChange={handleMinimumPriceChange}
              error={!!errors.minimumPrice}
              helperText={errors.minimumPrice}
              InputProps={{
                inputProps: { min: 0, max: 100000000 },
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
              placeholder="Nhập mức giá tối thiểu"
            />
          </div>
          <div className="flex justify-between mt-6">
            <Button 
              variant="contained" 
              onClick={onClose}
              style={{ backgroundColor: '#9e9e9e', color: 'white' }} // Màu xám cơ bản
            >
              Đóng
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Thêm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

AddTableTypePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddTableType: PropTypes.func.isRequired,
  resetFormTrigger: PropTypes.bool.isRequired,
  setResetFormTrigger: PropTypes.func.isRequired,
};

// EditTableTypePopup component 
const EditTableTypePopup = ({ isOpen, onClose, tableType, onTableTypeUpdated, handleNotification }) => {
  const [typeName, setTypeName] = useState('');
  const [description, setDescription] = useState('');
  const [minimumGuest, setMinimumGuest] = useState('');
  const [maximumGuest, setMaximumGuest] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [minimumPriceDisplay, setMinimumPriceDisplay] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tableType) {
      setTypeName(tableType.typeName);
      setDescription(tableType.description);
      setMinimumGuest(tableType.minimumGuest);
      setMaximumGuest(tableType.maximumGuest);
      setMinimumPrice(tableType.minimumPrice.toString());
      setMinimumPriceDisplay(formatCurrency(tableType.minimumPrice));
      setErrors({});
    }
  }, [tableType]);

  const handleMinimumPriceChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setMinimumPrice(value);
    setMinimumPriceDisplay(formatCurrency(value));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!typeName || typeName.length < 1 || typeName.length > 99) {
      formErrors.typeName = 'Tên loại bàn không được bỏ trống và phải trong khoảng 1-99 kí tự';
    }
    if (!description || description.length < 1 || description.length > 999) {
      formErrors.description = 'Mô tả loại bàn không được bỏ trống và phải trong khoảng 1-999 kí tự';
    }
    const minGuest = parseInt(minimumGuest, 10);
    const maxGuest = parseInt(maximumGuest, 10);
    if (!minimumGuest || !maximumGuest || minGuest > maxGuest || minGuest < 1 || maxGuest > 99) {
      formErrors.guests = 'Số lượng khách hàng tối thiểu phải nhỏ hơn hoặc bằng số lượng khách hàng tối đa và cả hai phải trong khoảng 1-99';
    }
    const minPrice = parseFloat(minimumPrice);
    if (!minimumPrice || minPrice < 0 || minPrice > 100000000) {
      formErrors.minimumPrice = 'Mức giá tối thiểu phải nằm trong khoảng 0-100.000.000';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleEditTableType = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const minGuest = parseInt(minimumGuest, 10);
    const maxGuest = parseInt(maximumGuest, 10);
    const minPrice = parseFloat(minimumPrice);

    try {
      const response = await TableTypeService.updateTableType(tableType.tableTypeId, {
        typeName,
        description,
        minimumGuest: minGuest,
        maximumGuest: maxGuest,
        minimumPrice: minPrice,
      });

      if (response.status === 200) {
        await onTableTypeUpdated();
        handleNotification('Thông tin loại bàn đã được cập nhật thành công', 'success');
        onClose();
      } else {
        handleNotification('Failed to update table type.', 'error');
      }
    } catch (error) {
      handleNotification('Error updating table type.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa loại bàn</h2>
        <form onSubmit={handleEditTableType}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại bàn</label>
            <TextField
              fullWidth
              variant="outlined"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              error={!!errors.typeName}
              helperText={errors.typeName}
              placeholder="Nhập tên loại bàn"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả loại bàn</label>
            <TextField
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              placeholder="Nhập mô tả loại bàn"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách hàng tối thiểu</label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={minimumGuest}
              onChange={(e) => setMinimumGuest(e.target.value)}
              error={!!errors.guests}
              helperText={errors.guests}
              InputProps={{
                inputProps: { min: 1, max: 99 },
                endAdornment: <InputAdornment position="end">khách</InputAdornment>,
              }}
              placeholder="Nhập số lượng tối thiểu"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng khách hàng tối đa</label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={maximumGuest}
              onChange={(e) => setMaximumGuest(e.target.value)}
              error={!!errors.guests}
              helperText={errors.guests}
              InputProps={{
                inputProps: { min: 1, max: 99 },
                endAdornment: <InputAdornment position="end">khách</InputAdornment>,
              }}
              placeholder="Nhập số lượng tối đa"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mức giá tối thiểu</label>
            <TextField
              fullWidth
              variant="outlined"
              value={minimumPriceDisplay}
              onChange={handleMinimumPriceChange}
              error={!!errors.minimumPrice}
              helperText={errors.minimumPrice}
              InputProps={{
                inputProps: { min: 0, max: 100000000 },
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
              placeholder="Nhập mức giá tối thiểu"
            />
          </div>
          <div className="flex justify-between mt-6">
            <Button 
              variant="contained" 
              onClick={onClose}
              style={{ backgroundColor: '#9e9e9e', color: 'white' }} // Màu xám cơ bản
            >
              Đóng
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
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
  handleNotification: PropTypes.func.isRequired,
};

export default TableTypeManagementAdmin;
