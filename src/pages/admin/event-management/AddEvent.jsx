import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { getBars } from 'src/lib/service/adminService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const AddEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: '',
    description: '',
    selectedBars: [],
    eventType: 'specific',
    specificDates: [],
    weeklyDays: [],
    startTime: '',
    endTime: '',
    images: [],
    vouchers: {}
  });
  const [errors, setErrors] = useState({});
  const [bars, setBars] = useState([]);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await getBars();
        if (response.data && response.data.data) {
          setBars(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bars:', error);
        toast.error('Không thể tải danh sách quán bar');
      }
    };

    fetchBars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarSelection = (barId) => {
    setEventData(prev => {
      const updatedBars = prev.selectedBars.includes(barId)
        ? prev.selectedBars.filter(id => id !== barId)
        : [...prev.selectedBars, barId];
      return { ...prev, selectedBars: updatedBars };
    });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    if (value && !eventData.specificDates.includes(value)) {
      setEventData(prev => ({
        ...prev,
        specificDates: [...prev.specificDates, value]
      }));
    }
    // Reset giá trị của input date sau khi đã thêm
    e.target.value = '';
  };

  const handleDeleteDate = (dateToDelete) => {
    setEventData(prev => ({
      ...prev,
      specificDates: prev.specificDates.filter(date => date !== dateToDelete)
    }));
  };

  const handleWeeklyDayChange = (day) => {
    setEventData(prev => ({
      ...prev,
      weeklyDays: prev.weeklyDays.includes(day)
        ? prev.weeklyDays.filter(d => d !== day)
        : [...prev.weeklyDays, day]
    }));
  };

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      src: URL.createObjectURL(file),
      file: file,
    }));
    setEventData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880,
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0].errors[0].code === 'file-invalid-type') {
        setErrors(prev => ({ ...prev, images: 'Chỉ chấp nhận các file ảnh có định dạng JPEG, JPG, PNG hoặc GIF' }));
      } else if (rejectedFiles[0].errors[0].code === 'file-too-large') {
        setErrors(prev => ({ ...prev, images: 'Kích thước file không được vượt quá 5MB' }));
      }
    }
  });

  const handleDelete = (index) => {
    setEventData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateEventForm = () => {
    let newErrors = {};
    if (!eventData.eventName.trim()) newErrors.eventName = 'Tên sự kiện không được để trống';
    if (!eventData.description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (eventData.selectedBars.length === 0) newErrors.selectedBars = 'Vui lòng chọn ít nhất một quán bar';
    if (eventData.eventType === 'specific' && eventData.specificDates.length === 0) {
      newErrors.specificDates = 'Vui lòng chọn ít nhất một ngày cụ thể';
    }
    if (eventData.eventType === 'weekly' && eventData.weeklyDays.length === 0) {
      newErrors.weeklyDays = 'Vui lòng chọn ít nhất một ngày trong tuần';
    }
    if (!eventData.startTime) newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    if (!eventData.endTime) newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    if (eventData.images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất một hình ảnh';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateEventForm()) {
      // Xóa vouchers cho các ngày không còn tồn tại
      const updatedVouchers = { ...eventData.vouchers };
      const validDates = eventData.eventType === 'specific' ? eventData.specificDates : eventData.weeklyDays;
      
      Object.keys(updatedVouchers).forEach(date => {
        if (!validDates.includes(date)) {
          delete updatedVouchers[date];
        }
      });

      setEventData(prev => ({
        ...prev,
        vouchers: updatedVouchers
      }));

      setStep(2);
    } else {
      toast.error('Vui lòng kiểm tra lại thông tin sự kiện');
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleAddVoucher = (date) => {
    const newVoucher = {
      voucherName: '',
      voucherCode: '',
      discount: '',
      maxPrice: '',
      quantity: '',
      status: true
    };
    setEventData(prev => ({
      ...prev,
      vouchers: {
        ...prev.vouchers,
        [date]: prev.vouchers[date] ? [...prev.vouchers[date], newVoucher] : [newVoucher]
      }
    }));
  };

  const handleRemoveVoucher = (date, index) => {
    setEventData(prev => ({
      ...prev,
      vouchers: {
        ...prev.vouchers,
        [date]: prev.vouchers[date].filter((_, i) => i !== index)
      }
    }));
  };

  const handleVoucherChange = (date, index, field, value) => {
    setEventData(prev => ({
      ...prev,
      vouchers: {
        ...prev.vouchers,
        [date]: prev.vouchers[date].map((voucher, i) => 
          i === index ? { ...voucher, [field]: value } : voucher
        )
      }
    }));
  };

  const validateVouchers = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.entries(eventData.vouchers).forEach(([date, vouchers]) => {
      vouchers.forEach((voucher, index) => {
        if (!voucher.voucherName.trim()) {
          newErrors[`${date}_${index}_voucherName`] = 'Tên voucher không được để trống';
          isValid = false;
        }
        if (!voucher.voucherCode.trim()) {
          newErrors[`${date}_${index}_voucherCode`] = 'Mã voucher không được để trống';
          isValid = false;
        }
        if (voucher.discount === '' || isNaN(voucher.discount) || voucher.discount < 0 || voucher.discount > 100) {
          newErrors[`${date}_${index}_discount`] = 'Giảm giá phải nằm trong khoảng 0-100%';
          isValid = false;
        }
        if (voucher.maxPrice === '' || isNaN(voucher.maxPrice) || voucher.maxPrice < 0) {
          newErrors[`${date}_${index}_maxPrice`] = 'Giảm tối đa phải lớn hơn hoặc bằng 0';
          isValid = false;
        }
        if (voucher.quantity === '' || isNaN(voucher.quantity) || voucher.quantity <= 0) {
          newErrors[`${date}_${index}_quantity`] = 'Số lượng phải lớn hơn 0';
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateVouchers()) {
      // Xử lý logic gửi dữ liệu lên server ở đây
      console.log('Form data:', eventData);
      toast.success('Sự kiện đã được thêm thành công!');
      // navigate('/admin/event-management');
    } else {
      toast.error('Vui lòng kiểm tra lại thông tin voucher');
    }
  };

  const renderVoucherFields = (date) => (
    <div key={date} className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{date}</h3>
      <div className="flex flex-wrap -mx-2">
        {eventData.vouchers[date]?.map((voucher, index) => (
          <div key={index} className={`px-2 mb-4 ${eventData.vouchers[date].length === 1 ? 'w-full' : 'w-full md:w-1/2'}`}>
            <div className="bg-gray-100 p-4 rounded relative">
              <div className="flex items-start">
                <div className="flex-grow pr-2">
                  <input
                    type="text"
                    placeholder="Tên voucher"
                    value={voucher.voucherName}
                    onChange={(e) => handleVoucherChange(date, index, 'voucherName', e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  {errors[`${date}_${index}_voucherName`] && <p className="text-red-500 text-xs italic">{errors[`${date}_${index}_voucherName`]}</p>}
                  <input
                    type="text"
                    placeholder="Mã voucher"
                    value={voucher.voucherCode}
                    onChange={(e) => handleVoucherChange(date, index, 'voucherCode', e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  {errors[`${date}_${index}_voucherCode`] && <p className="text-red-500 text-xs italic">{errors[`${date}_${index}_voucherCode`]}</p>}
                  <input
                    type="number"
                    placeholder="Giảm giá (%)"
                    value={voucher.discount}
                    onChange={(e) => handleVoucherChange(date, index, 'discount', e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  {errors[`${date}_${index}_discount`] && <p className="text-red-500 text-xs italic">{errors[`${date}_${index}_discount`]}</p>}
                  <input
                    type="number"
                    placeholder="Giảm tối đa"
                    value={voucher.maxPrice}
                    onChange={(e) => handleVoucherChange(date, index, 'maxPrice', e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  {errors[`${date}_${index}_maxPrice`] && <p className="text-red-500 text-xs italic">{errors[`${date}_${index}_maxPrice`]}</p>}
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={voucher.quantity}
                    onChange={(e) => handleVoucherChange(date, index, 'quantity', e.target.value)}
                    className="mb-2 w-full p-2 border rounded"
                  />
                  {errors[`${date}_${index}_quantity`] && <p className="text-red-500 text-xs italic">{errors[`${date}_${index}_quantity`]}</p>}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={voucher.status}
                      onChange={(e) => handleVoucherChange(date, index, 'status', e.target.checked)}
                      className="mr-2"
                    />
                    Kích hoạt
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVoucher(date, index)}
                  className="ml-2 text-gray-500 hover:text-gray-700 transition duration-300"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => handleAddVoucher(date)}
        className="bg-sky-900 hover:bg-sky-800 text-white px-6 py-2 rounded-full hover:bg-sky-600 mt-2 transition duration-300 ease-in-out"
      >
        Thêm Voucher
      </button>
    </div>
  );

  return (
    <main className="flex flex-col items-start p-4 sm:p-8 bg-white w-full">
      <div className="flex items-center mb-6 w-full">
        <button
          onClick={() => navigate('/admin/event-management')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowBackIcon />
        </button>
        <h1 className="text-2xl font-bold">Thêm Sự Kiện Mới</h1>
      </div>
      {step === 1 ? (
        <form className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
              Tên Sự Kiện
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={eventData.eventName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.eventName && <p className="text-red-500 text-xs italic">{errors.eventName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Mô Tả Sự Kiện
            </label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Chọn Quán Bar
            </label>
            <div className="max-h-60 overflow-y-auto border rounded p-2">
              {bars.map((bar) => (
                <label key={bar.barId} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={eventData.selectedBars.includes(bar.barId)}
                    onChange={() => handleBarSelection(bar.barId)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">
                    {bar.barName} - {bar.address}
                  </span>
                </label>
              ))}
            </div>
            {errors.selectedBars && <p className="text-red-500 text-xs italic">{errors.selectedBars}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Loại Sự Kiện
            </label>
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="eventType"
                  value="specific"
                  checked={eventData.eventType === 'specific'}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Ngày cụ thể</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="eventType"
                  value="weekly"
                  checked={eventData.eventType === 'weekly'}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2">Hàng tuần</span>
              </label>
            </div>
          </div>

          {eventData.eventType === 'specific' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Chọn Ngày
              </label>
              <input
                type="date"
                onChange={handleDateChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <div className="mt-2 flex flex-wrap">
                {eventData.specificDates.map((date, index) => (
                  <span key={index} className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {date}
                    <button
                      type="button"
                      onClick={() => handleDeleteDate(date)}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.specificDates && <p className="text-red-500 text-xs italic">{errors.specificDates}</p>}
            </div>
          )}

          {eventData.eventType === 'weekly' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Chọn Ngày Trong Tuần
              </label>
              <div className="flex flex-wrap">
                {['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day, index) => (
                  <label key={index} className="inline-flex items-center mr-6 mb-2">
                    <input
                      type="checkbox"
                      checked={eventData.weeklyDays.includes(day)}
                      onChange={() => handleWeeklyDayChange(day)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{day}</span>
                  </label>
                ))}
              </div>
              {errors.weeklyDays && <p className="text-red-500 text-xs italic">{errors.weeklyDays}</p>}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center">
            <div className="w-full sm:w-auto mr-4 mb-2 sm:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                Giờ Bắt Đầu
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.startTime && <p className="text-red-500 text-xs italic mt-1">{errors.startTime}</p>}
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                Giờ Kết Thúc
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.endTime && <p className="text-red-500 text-xs italic mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Thêm Hình Ảnh
            </label>
            <div {...getRootProps()} className="dropzone border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer">
              <input {...getInputProps()} />
              <p>Kéo và thả hình ảnh vào đây, hoặc click để chọn hình</p>
              <p className="text-sm text-gray-500">Chỉ chấp nhận file ảnh JPEG, JPG, PNG hoặc GIF, kích thước tối đa 5MB</p>
            </div>
            {errors.images && <p className="text-red-500 text-xs italic mt-1">{errors.images}</p>}
          </div>

          <div className="mb-4 flex flex-wrap">
            {eventData.images.map((image, index) => (
              <div key={index} className="relative m-2">
                <img src={image.src} alt={`preview ${index}`} className="h-20 w-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleNext}
              className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Tiếp theo
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-xl font-semibold mb-4">Thêm Voucher cho Sự Kiện</h2>
          {eventData.eventType === 'specific'
            ? eventData.specificDates.map(date => renderVoucherFields(date))
            : eventData.weeklyDays.map(day => renderVoucherFields(day))
          }
          <div className="flex justify-end items-center mt-6 space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Hoàn tất
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default AddEvent;
