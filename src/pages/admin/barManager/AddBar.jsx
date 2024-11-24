import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Notification } from 'src/components';
import { addBar } from 'src/lib/service/barManagerService';
import { CircularProgress, TextField, Button, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft } from '@mui/icons-material';
import { convertFileToBase64 } from 'src/lib/Utils/Utils';

const InputField = ({ label, value, onChange, name, type, errorMessage }) => (
    <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <TextField
            fullWidth
            size="small"
            variant="outlined"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            error={!!errorMessage}
            helperText={errorMessage}
            placeholder={`Nhập ${label.toLowerCase()}`}
        />
    </div>
);
const InputFieldv2 = ({ label, value, onChange, name, type, errorMessage, multiline, rows }) => (
    <TextField
        fullWidth
        size="small"
        label={label}
        variant="outlined"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        error={!!errorMessage}
        helperText={errorMessage}
        margin="normal"
        multiline={multiline}
        rows={rows}
    />
);
const TimeSelector = ({ label, value, onChange, errorMessage }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value ? value.slice(0, 5) : '');

    useEffect(() => {
        if (value) {
            setSelectedTime(value.slice(0, 5));
        }
    }, [value]);

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setSelectedTime(newTime);
        onChange(newTime);
    };

    const togglePicker = () => {
        setPickerVisible(!isPickerVisible);
    };

    return (
        <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center">
                <input
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
            {errorMessage && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
        </div>
    );
};

const DiscountField = ({ value, onChange, type, name, errorMessage }) => (
    <div className="mb-2">
        <div className="flex items-center">
            <TextField
                fullWidth
                size="small"
                label="Chiết khấu"
                variant="outlined"
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                error={!!errorMessage}
                helperText={errorMessage}
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
        </div>
        <p className="mt-1 text-xs text-gray-500">
            Note: Chiết khấu này sẽ áp dụng thanh toán online trên tổng số tiền của bill
        </p>
    </div>
);

const ImageGallery = ({ images, onDelete }) => {

    if (images.length === 0) {
        return (
            <Fragment>
                <div className="text-center font-bold text-sm text-red-400">Không có hình ảnh nào</div>
            </Fragment>
        );
    }

    return (
        <div className="mt-4 max-w-full w-[490px] max-md:mt-10">
            <div className="flex gap-5 max-md:flex-col">

                {images.map((image, index) => (
                    <div key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
                        <div className="flex grow max-md:mt-2.5">
                            <img
                                loading="lazy"
                                src={image.src}
                                alt={image.alt}
                                className="object-contain shrink-0 max-w-full rounded-md aspect-square w-[100px]"
                            />
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0589e620273b2e652a0dc191ef63970d47917603ab9789d02c3aad8959e9a24?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                                alt=""
                                className="object-contain shrink-0 self-start aspect-square w-[15px] cursor-pointer"
                                onClick={() => onDelete(index)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const DropzoneComponent = ({ onDrop }) => {
    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop,
        multiple: true
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="text-center h-32 text-gray-500 cursor-pointer">Drop images or click to upload</div>
        </div>
    );
};

// Thêm constant cho các ngày trong tuần
const DAYS_OF_WEEK = [
    { value: 0, label: 'Chủ nhật' },
    { value: 1, label: 'Thứ 2' },
    { value: 2, label: 'Thứ 3' },
    { value: 3, label: 'Thứ 4' },
    { value: 4, label: 'Thứ 5' },
    { value: 5, label: 'Thứ 6' },
    { value: 6, label: 'Thứ 7' },
];

// Tạo component mới để quản lý thời gian cho từng ngày
const DayTimeSelector = ({ day, times, onTimeChange, onDayToggle }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        setIsEnabled(times !== null);
    }, [times]);

    const handleToggle = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        onDayToggle(day.value, newState);
    };

    // Hàm để format thời gian từ HH:mm:ss về HH:mm để hiển thị
    const formatTimeForDisplay = (time) => {
        if (!time) return '';
        return time.substring(0, 5); // Lấy 5 ký tự đầu (HH:mm)
    };

    return (
        <div className="flex items-center gap-4 p-2 border-b last:border-b-0">
            <div className="flex items-center gap-2 min-w-[100px]">
                <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={handleToggle}
                    className="w-4 h-4"
                />
                <span className="text-sm font-medium">{day.label}</span>
            </div>
            
            {isEnabled ? (
                <div className="flex gap-4 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-600 min-w-[60px]">Mở cửa:</span>
                        <input
                            type="time"
                            value={formatTimeForDisplay(times?.startTime)}
                            onChange={(e) => onTimeChange(day.value, 'startTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-600 min-w-[60px]">Đóng cửa:</span>
                        <input
                            type="time"
                            value={formatTimeForDisplay(times?.endTime)}
                            onChange={(e) => onTimeChange(day.value, 'endTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex-1 text-sm text-gray-500 italic">Không hoạt động</div>
            )}
        </div>
    );
};

const AddBar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        phoneNumber: '',
        barName: '',
        email: '',
        description: '',
        discount: '',
        timeSlot: '',
        status: true,
        images: [],
        barTimeRequest: {}
    });
    const [isPopupConfirm, setIsPopupConfirm] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateOperatingHours = (barTimeRequest) => {
        let errors = [];
        Object.entries(barTimeRequest).forEach(([dayOfWeek, times]) => {
            if (times !== null) {
                const dayLabel = DAYS_OF_WEEK.find(day => day.value === parseInt(dayOfWeek))?.label;
                if (!times.startTime || !times.endTime) {
                    errors.push(`${dayLabel} phải chọn cả giờ mở cửa và đóng cửa`);
                }
            }
        });
        return errors;
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Validate các trường input
        if (!formData.barName) newErrors.barName = 'Tên quán không được để trống';
        if (!formData.email) newErrors.email = 'Email không được để trống';
        if (!formData.address) newErrors.address = 'Địa chỉ không được để trống';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống';
        if (!formData.description) newErrors.description = 'Mô tả không được để trống';
        if (!formData.discount) newErrors.discount = 'Chiết khấu không được để trống';
        
        // Validate images
        if (uploadedImages.length === 0) {
            toast.error("Vui lòng thêm ít nhất một hình ảnh", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            isValid = false;
        }

        // Hiển thị lỗi cho các trường input
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        // Kiểm tra thời gian hoạt động
        const timeErrors = validateOperatingHours(formData.barTimeRequest);
        if (timeErrors.length > 0) {
            timeErrors.forEach(error => {
                toast.error(error, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
            isValid = false;
        }

        return isValid;
    };

    const handleStatusChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            status: value,
        }));
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map(file => ({
            src: URL.createObjectURL(file),
            file: file,
        }));

        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handleDelete = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const PopupConfirmAdd = () => {
        setIsPopupConfirm(true);
    };

    const PopupConfirmCancel = () => {
        setIsPopupConfirm(false);
    };

    // Thêm hàm xử lý thay đổi thời gian
    const handleTimeChange = (dayOfWeek, timeType, newTime) => {
        console.log('handleTimeChange called:', { dayOfWeek, timeType, newTime });
        setFormData(prev => {
            const updatedBarTimeRequest = {
                ...prev.barTimeRequest,
                [dayOfWeek]: {
                    ...prev.barTimeRequest[dayOfWeek],
                    [timeType]: newTime
                }
            };
            console.log('Updated barTimeRequest:', updatedBarTimeRequest);
            return {
                ...prev,
                barTimeRequest: updatedBarTimeRequest
            };
        });
    };

    // Thêm hàm xử lý toggle ngày
    const handleDayToggle = (dayOfWeek, enabled) => {
        console.log('handleDayToggle called:', { dayOfWeek, enabled });
        setFormData(prev => {
            const updatedBarTimeRequest = {
                ...prev.barTimeRequest,
                [dayOfWeek]: enabled ? { startTime: '', endTime: '' } : null
            };
            console.log('Updated barTimeRequest:', updatedBarTimeRequest);
            return {
                ...prev,
                barTimeRequest: updatedBarTimeRequest
            };
        });
    };

    // Cập nhật hàm handleAddConfirm
    const handleAddConfirm = async () => {
        console.log('Starting handleAddConfirm');
        console.log('Current formData:', formData);
        
        if (!validateForm()) {
            console.log('Form validation failed');
            setIsPopupConfirm(false);
            return;
        }

        try {
            setIsLoading(true);
            setIsPopupConfirm(false);

            const base64Images = await Promise.all(
                uploadedImages.map(async (image) => {
                    const base64 = await convertFileToBase64(image.file);
                    return base64;
                })
            );

            // Lọc và format thời gian hoạt động
            const barTimes = Object.entries(formData.barTimeRequest)
                .filter(([_, times]) => times !== null && times.startTime && times.endTime)
                .map(([dayOfWeek, times]) => ({
                    dayOfWeek: parseInt(dayOfWeek),
                    startTime: `${times.startTime}:00`,
                    endTime: `${times.endTime}:00`
                }));

            console.log('Formatted barTimes:', barTimes);

            const payload = {
                barName: formData.barName,
                email: formData.email,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                description: formData.description,
                discount: formData.discount,
                timeSlot: formData.timeSlot,
                status: formData.status,
                images: base64Images,
                barTimeRequest: barTimes
            };

            console.log('Sending payload:', payload);
            const response = await addBar(payload);
            console.log('Response:', response);

            if (response.status === 200) {
                toast.success("Thêm quán bar thành công!", {
                    type: "success",
                    autoClose: 1500,
                    onClose: () => {
                        navigate('/admin/barmanager');
                    }
                });
            } else if (response.status === 400) {
                const errors = response.data.errors;
                if (errors) {
                    Object.values(errors).forEach(messages => {
                        messages.forEach(message => {
                            toast.error(message, {
                                type: "error",
                                autoClose: 3000
                            });
                        });
                    });
                } else {
                    toast.error(response.data.message || "Dữ liệu không hợp lệ!");
                }
            } else {
                toast.error(response.data?.message || "Có lỗi xảy ra! Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Error adding bar:', error);
            toast.error(error.message || "Có lỗi xảy ra! Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/admin/barmanager');
    };

    const options = [
        {
            value: true,
            label: "Đang hoạt động",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=4ECB71"
        },
        {
            value: false,
            label: "Đang đóng cửa",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000"
        }
    ];

    // Thêm useEffect để khởi tạo barTimeRequest ngay khi component mount
    useEffect(() => {
        const initialBarTimeRequest = {};
        DAYS_OF_WEEK.forEach(day => {
            initialBarTimeRequest[day.value] = null;
        });

        setFormData(prev => ({
            ...prev,
            barTimeRequest: initialBarTimeRequest
        }));
    }, []);

    return (
        <main className="flex flex-col items-start p-8 bg-white w-full">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
                limit={3}
            />

            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
                    <CircularProgress />
                    <p className="text-xl font-semibold ml-4">Đang xử lý...</p>
                </div>
            )}

            <header className="flex justify-between items-center w-full mb-6">
                <div className="flex items-center">
                    <button
                        onClick={handleGoBack}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <ChevronLeft className="text-gray-600 hover:text-gray-800 transition-colors duration-300" />
                    </button>
                    <h1 className="text-2xl font-bold text-zinc-600">Thêm Quán Bar</h1>
                </div>
                <div className="flex items-center">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <img
                                src={options.find(option => option.value === formData.status)?.icon || 'default-icon-url-here'}
                                alt=""
                                className="w-5 h-5 mr-2"
                            />
                            <span className="mr-2">{options.find(option => option.value === formData.status)?.label}</span>
                            <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out overflow-hidden">
                                <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    {options
                                        .filter(option => option.value !== formData.status)
                                        .map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    handleStatusChange(option.value);
                                                    setIsOpen(false);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                                                role="menuitem"
                                            >
                                                <img
                                                    src={option.icon}
                                                    alt={option.label}
                                                    className="w-5 h-5 mr-2"
                                                />
                                                {option.label}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <section className="flex flex-col items-start self-stretch mt-3 w-full text-zinc-600">
                <div className="shrink-0 max-w-full h-px bg-orange-400 border border-orange-400 border-solid w-full" />

                <h2 className="text-xl font-bold mt-6 mb-4">Thông tin quán bar</h2>

                <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-[960px]">
                    <InputFieldv2 errorMessage={errors.barName} name="barName" label="Tên quán" type="text" value={formData.barName} onChange={handleInputChange} />
                    <InputFieldv2 errorMessage={errors.email} name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} />
                    <InputFieldv2 errorMessage={errors.address} name="address" label="Địa chỉ" type="text" value={formData.address} onChange={handleInputChange} />
                    <InputFieldv2 errorMessage={errors.phoneNumber} name="phoneNumber" label="Số điện thoại" type="tel" value={formData.phoneNumber} onChange={handleInputChange} />
                    <InputFieldv2 errorMessage={errors.description} name="description" label="Mô tả" type="text" value={formData.description} onChange={handleInputChange}/>
                    <InputFieldv2 errorMessage={errors.timeSlot} name="timeSlot" label="Thời gian tồn tại của slot" type="number" value={formData.timeSlot} onChange={handleInputChange}/>
                    <DiscountField errorMessage={errors.discount} name="discount" type="number" value={formData.discount} onChange={handleInputChange} />
                </div>

                <div className="mt-6 w-full">
                    <h2 className="text-lg font-bold mb-3">Thời gian hoạt động</h2>
                    <div className="border rounded-lg overflow-hidden w-[84%]">
                        {DAYS_OF_WEEK.map(day => (
                            <DayTimeSelector
                                key={day.value}
                                day={day}
                                times={formData.barTimeRequest[day.value]}
                                onTimeChange={handleTimeChange}
                                onDayToggle={handleDayToggle}
                            />
                        ))}
                    </div>
                </div>

            </section>

            <section className="flex flex-col items-start w-full max-w-[84%] mt-8">
                <h2 className="text-xl font-bold mb-4">Thêm hình ảnh</h2>
                <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-full">
                    <DropzoneComponent onDrop={onDrop} />
                </div>
                <ImageGallery images={uploadedImages} onDelete={handleDelete} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={PopupConfirmAdd}
                    className="mt-5 w-full"
                    style={{ backgroundColor: '#f97316', color: 'white' }}
                >
                    Thêm
                </Button>
                {isPopupConfirm && (
                    <Notification onCancel={PopupConfirmCancel} onConfirm={handleAddConfirm} />
                )}
            </section>
        </main>
    );
};

export default AddBar;
