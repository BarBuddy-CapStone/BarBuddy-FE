import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDropzone } from 'react-dropzone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createEvent } from 'src/lib/service/eventManagerService';
import { 
    TextField, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Thêm hàm format và parse tiền
const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('vi-VN');
};

const parseCurrency = (value) => {
  return value.replace(/[^\d]/g, '');
};

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
  const [maxPriceDisplay, setMaxPriceDisplay] = useState('');

  const handleInputChange = (name, value) => {
    setEventData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'eventType') {
        setEventData(prev => ({
            ...prev,
            specificDates: [],  // Reset ngày cụ thể
            weeklyDays: [],     // Reset ngày trong tuần
            [name]: value
        }));
    }
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
    if (field === 'maxPrice') {
      const numericValue = parseCurrency(value);
      setEventData(prev => ({
        ...prev,
        eventVoucherRequest: {
          ...prev.eventVoucherRequest,
          maxPrice: numericValue
        }
      }));
      setMaxPriceDisplay(formatCurrency(numericValue));
    } else {
      setEventData(prev => ({
        ...prev,
        eventVoucherRequest: {
          ...prev.eventVoucherRequest,
          [field]: value
        }
      }));
    }
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
                message.success(response.data.message);
                navigate('/manager/event-management');
            } else {
                message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm sự kiện!');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm sự kiện!');
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <main className="flex flex-col items-start p-4 sm:p-8 bg-white w-full max-w-6xl mx-auto">
      <div className="flex items-center mb-6 w-full">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/manager/event-management')}
          variant="text"
          color="inherit"
        >
          Quay lại
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center w-full">Thêm Sự Kiện Mới</h1>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <TextField
          size="medium"
          fullWidth
          label="Tên Sự Kiện"
          value={eventData.eventName}
          onChange={(e) => handleInputChange('eventName', e.target.value)}
          error={!!errors.eventName}
          helperText={errors.eventName}
        />

        <TextField
          size="medium"
          fullWidth
          label="Mô Tả Sự Kiện"
          multiline
          rows={4}
          value={eventData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Loại Sự Kiện</InputLabel>
          <Select
            value={eventData.eventType}
            onChange={(e) => handleInputChange('eventType', e.target.value)}
            label="Loại Sự Kiện"
          >
            <MenuItem value="specific">Ngày cụ thể</MenuItem>
            <MenuItem value="weekly">Hàng tuần</MenuItem>
          </Select>
        </FormControl>

        {eventData.eventType === 'specific' ? (
          <TextField
            type="date"
            fullWidth
            label="Chọn Ngày"
            InputLabelProps={{ shrink: true }}
            onChange={handleDateChange}
            error={!!errors.specificDates}
            helperText={errors.specificDates}
          />
        ) : (
          <FormGroup row>
            {['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map((day, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={eventData.weeklyDays.includes(day)}
                    onChange={() => handleWeeklyDayChange(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex gap-4">
            <TimePicker
              label="Giờ bắt đầu"
              value={eventData.startTime ? dayjs(eventData.startTime, 'HH:mm') : null}
              onChange={(newValue) => handleInputChange('startTime', newValue?.format('HH:mm'))}
            />
            <TimePicker
              label="Giờ kết thúc"
              value={eventData.endTime ? dayjs(eventData.endTime, 'HH:mm') : null}
              onChange={(newValue) => handleInputChange('endTime', newValue?.format('HH:mm'))}
            />
          </div>
        </LocalizationProvider>

        {/* Voucher Section */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Thông tin Voucher</h3>
          <TextField
            size="small"
            fullWidth
            label="Tên Voucher"
            value={eventData.eventVoucherRequest.eventVoucherName}
            onChange={(e) => handleVoucherChange('eventVoucherName', e.target.value)}
            error={!!errors.eventVoucherName}
            helperText={errors.eventVoucherName}
          />

          <TextField
            size="small"
            fullWidth
            label="Mã Voucher"
            value={eventData.eventVoucherRequest.voucherCode}
            onChange={(e) => handleVoucherChange('voucherCode', e.target.value)}
            error={!!errors.voucherCode}
            helperText={errors.voucherCode}
            inputProps={{ maxLength: 10 }}
          />

          <div className="grid grid-cols-3 gap-4">
            <TextField
              size="small"
              label="Giảm giá (%)"
              value={eventData.eventVoucherRequest.discount}
              onChange={(e) => handleVoucherChange('discount', e.target.value)}
              error={!!errors.discount}
              helperText={errors.discount}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />

            <TextField
              size="small"
              label="Giảm tối đa"
              value={maxPriceDisplay}
              onChange={(e) => handleVoucherChange('maxPrice', e.target.value)}
              error={!!errors.maxPrice}
              helperText={errors.maxPrice}
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />

            <TextField
              size="small"
              label="Số lượng"
              value={eventData.eventVoucherRequest.quantity}
              onChange={(e) => handleVoucherChange('quantity', e.target.value)}
              error={!!errors.quantity}
              helperText={errors.quantity}
              type="number"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors">
            <input {...getInputProps()} />
            <p className="text-base">Kéo và thả hình ảnh vào đây, hoặc click để chọn hình</p>
            <p className="text-sm text-gray-500 mt-2">Chỉ chấp nhận file ảnh JPEG, JPG, PNG hoặc GIF, kích thước tối đa 5MB</p>
          </div>
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          <div className="flex flex-wrap gap-4">
            {eventData.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.src} alt={`preview ${index}`} className="h-24 w-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            size="large"
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddEvent;
