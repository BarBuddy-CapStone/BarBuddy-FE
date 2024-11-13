import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { createEvent } from 'src/lib/service/eventManagerService';

const AddEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    barId: JSON.parse(sessionStorage.getItem('userInfo'))?.identityId || '',
    eventName: '',
    description: '',
    eventType: 'specific',
    specificDates: [],
    weeklyDays: [],
    startTime: '',
    endTime: '',
    images: [],
    eventVoucherRequest: {
      eventVoucherName: '',
      voucherCode: '',
      discount: '',
      maxPrice: '',
      quantity: ''
    }
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    if (value && !eventData.specificDates.includes(value)) {
      setEventData(prev => ({
        ...prev,
        specificDates: [...prev.specificDates, value]
      }));
    }
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

  const handleVoucherChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      eventVoucherRequest: {
        ...prev.eventVoucherRequest,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Validate event info
    if (!eventData.eventName.trim()) newErrors.eventName = 'Tên sự kiện không được để trống';
    if (!eventData.description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (eventData.eventType === 'specific' && eventData.specificDates.length === 0) {
      newErrors.specificDates = 'Vui lòng chọn ít nhất một ngày cụ thể';
    }
    if (eventData.eventType === 'weekly' && eventData.weeklyDays.length === 0) {
      newErrors.weeklyDays = 'Vui lòng chọn ít nhất một ngày trong tuần';
    }
    if (!eventData.startTime) newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    if (!eventData.endTime) newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    if (eventData.images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất một hình ảnh';

    // Validate voucher
    const voucher = eventData.eventVoucherRequest;
    if (!voucher.eventVoucherName.trim()) newErrors.eventVoucherName = 'Tên voucher không được để trống';
    if (!voucher.voucherCode.trim()) newErrors.voucherCode = 'Mã voucher không được để trống';
    if (voucher.discount === '' || isNaN(voucher.discount) || voucher.discount < 0 || voucher.discount > 100) {
      newErrors.discount = 'Giảm giá phải nằm trong khoảng 0-100%';
    }
    if (voucher.maxPrice === '' || isNaN(voucher.maxPrice) || voucher.maxPrice < 0) {
      newErrors.maxPrice = 'Giảm tối đa phải lớn hơn hoặc bằng 0';
    }
    if (voucher.quantity === '' || isNaN(voucher.quantity) || voucher.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            setLoading(true);
            
            const eventRequest = {
                barId: eventData.barId,
                eventName: eventData.eventName,
                description: eventData.description,
                isEveryWeek: eventData.eventType === 'weekly',
                eventTimeRequest: [],
                eventVoucherRequest: eventData.eventVoucherRequest
            };

            if (eventData.eventType === 'weekly') {
                eventRequest.eventTimeRequest = eventData.weeklyDays.map(day => ({
                    date: null,
                    startTime: eventData.startTime + ':00',
                    endTime: eventData.endTime + ':00',
                    dayOfWeek: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].indexOf(day)
                }));
            } else {
                eventRequest.eventTimeRequest = eventData.specificDates.map(date => ({
                    date: new Date(date).toISOString(),
                    startTime: eventData.startTime + ':00',
                    endTime: eventData.endTime + ':00',
                    dayOfWeek: null
                }));
            }

            const imagePromises = eventData.images.map(image => 
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(image.file);
                })
            );

            const base64Images = await Promise.all(imagePromises);
            eventRequest.images = base64Images;

            const response = await createEvent(eventRequest);
            
            if (response.data.statusCode === 200) {
                toast.success('Thêm sự kiện thành công!');
                navigate('/manager/event-management');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sự kiện!');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm sự kiện!');
        } finally {
            setLoading(false);
        }
    }
  };

  const renderVoucherForm = () => (
    <div className="mb-6 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Thông tin Voucher</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên Voucher
          </label>
          <input
            type="text"
            value={eventData.eventVoucherRequest.eventVoucherName}
            onChange={(e) => handleVoucherChange('eventVoucherName', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.eventVoucherName && <p className="text-red-500 text-xs italic">{errors.eventVoucherName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mã Voucher (10 ký tự)
          </label>
          <input
            type="text"
            maxLength={10}
            value={eventData.eventVoucherRequest.voucherCode}
            onChange={(e) => handleVoucherChange('voucherCode', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.voucherCode && <p className="text-red-500 text-xs italic">{errors.voucherCode}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Giảm giá (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={eventData.eventVoucherRequest.discount}
            onChange={(e) => handleVoucherChange('discount', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.discount && <p className="text-red-500 text-xs italic">{errors.discount}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Giảm tối đa (VNĐ)
          </label>
          <input
            type="number"
            min="0"
            value={eventData.eventVoucherRequest.maxPrice}
            onChange={(e) => handleVoucherChange('maxPrice', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.maxPrice && <p className="text-red-500 text-xs italic">{errors.maxPrice}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số lượng
          </label>
          <input
            type="number"
            min="1"
            value={eventData.eventVoucherRequest.quantity}
            onChange={(e) => handleVoucherChange('quantity', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.quantity && <p className="text-red-500 text-xs italic">{errors.quantity}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col items-start p-4 sm:p-8 bg-white w-full">
      <div className="flex items-center mb-6 w-full">
        <button
          onClick={() => navigate('/manager/event-management')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowBackIcon />
        </button>
        <h1 className="text-2xl font-bold">Thêm Sự Kiện Mới</h1>
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
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
              min={new Date().toISOString().split('T')[0]}
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

        {renderVoucherForm()}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddEvent;
