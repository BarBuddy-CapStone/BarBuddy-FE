import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Notification } from 'src/components';
import { addBar } from 'src/lib/service/barManagerService';
import { CircularProgress, TextField, Button, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft } from '@mui/icons-material';

const InputField = ({ label, value, onChange, name, type, errorMessage }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <TextField
            fullWidth
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
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center">
                <input
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
        </div>
    );
};

const DiscountField = ({ value, onChange, type, name, errorMessage }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Chiết khấu</label>
        <div className="flex items-center">
            <TextField
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                error={!!errorMessage}
                helperText={errorMessage}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                placeholder="Nhập chiết khấu"
            />
        </div>
        <p className="mt-1 text-sm text-gray-500">
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

const AddBar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        phoneNumber: '',
        barName: '',
        email: '',
        description: '',
        startTime: '',
        endTime: '',
        discount: '',
        status: true,
        images: []
    });
    const [isPopupConfirm, setIsPopupConfirm] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.barName) newErrors.barName = 'Tên quán không được để trống';
        if (!formData.email) newErrors.email = 'Email không được để trống';
        if (!formData.address) newErrors.address = 'Địa chỉ không được để trống';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống';
        if (!formData.description) newErrors.description = 'Mô tả không được để trống';
        if (!formData.startTime) newErrors.startTime = 'Giờ mở cửa không được để trống';
        if (!formData.endTime) newErrors.endTime = 'Giờ đóng cửa không được để trống';
        if (!formData.discount) newErrors.discount = 'Chiết khấu không được để trống';
        if (!formData.images) newErrors.images = 'Ảnh không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const handleAddConfirm = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setIsPopupConfirm(false);

        const formDatas = new FormData();
        formDatas.append('barName', formData.barName);
        formDatas.append('email', formData.email);
        formDatas.append('address', formData.address);
        formDatas.append('phoneNumber', formData.phoneNumber);
        formDatas.append('description', formData.description);
        formDatas.append('startTime', formData.startTime);
        formDatas.append('endTime', formData.endTime);
        formDatas.append('discount', formData.discount);
        formDatas.append('status', formData.status);

        if (uploadedImages.length > 0) {
            uploadedImages.forEach(image => {
                formDatas.append('images', image.file);
            });
        }

        try {
            var response = await addBar(formDatas);
            if (response.data.status === 200) {
                setIsLoading(false);
                toast.success("Cập nhật thành công!");
                navigate('/admin/barmanager')
            } else {
                toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            console.error('Error adding bar:', error);
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

    return (
        <main className="flex flex-col items-start p-8 bg-white w-full">
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
                    <CircularProgress />
                    <p className="text-xl font-semibold ml-4">Đang xử lý...</p>
                </div>
            )}

            <ToastContainer />

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

                <div className="grid grid-cols-2 gap-6 mt-2 w-full max-w-[960px]">
                    <InputField errorMessage={errors.barName} name="barName" label="Tên quán" type="text" value={formData.barName} onChange={handleInputChange} />
                    <InputField errorMessage={errors.email} name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} />
                    <InputField errorMessage={errors.address} name="address" label="Địa chỉ" type="text" value={formData.address} onChange={handleInputChange} />
                    <InputField errorMessage={errors.phoneNumber} name="phoneNumber" label="Số điện thoại" type="tel" value={formData.phoneNumber} onChange={handleInputChange} />
                </div>

                <div className="mt-8 w-full">
                    <InputField errorMessage={errors.description} name="description" label="Mô tả" type="text" value={formData.description} onChange={handleInputChange} multiline rows={4} />
                </div>

                <div className="flex gap-10 mt-8 w-full">
                    <TimeSelector errorMessage={errors.startTime} label="Giờ mở cửa" value={formData.startTime} onChange={(newTime) => setFormData({ ...formData, startTime: newTime })} />
                    <TimeSelector errorMessage={errors.endTime} label="Giờ đóng cửa" value={formData.endTime} onChange={(newTime) => setFormData({ ...formData, endTime: newTime })} />
                </div>

                <DiscountField errorMessage={errors.discount} name="discount" type="number" value={formData.discount} onChange={handleInputChange} />
            </section>

            <section className="flex flex-col items-start w-full max-w-[913px] mt-8">
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
