import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Notification } from 'src/components';
import { addBar } from 'src/lib/service/barManagerService'; // API thêm mới
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CircularIndeterminate = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}

const InputField = ({ label, value, onChange, name, type, errorMessage }) => (
    <div className="flex flex-col">
        <label className="text-base font-bold mb-2">{label}</label>
        <div className="flex justify-between items-center px-3 py-3.5 text-sm rounded border border-solid border-stone-300">
            <input
                required
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                className="flex-grow border-none outline-none h-5 px-2"
            />
        </div>
        {errorMessage && <span className="text-red-500 text-sm mt-1">{errorMessage}</span>}
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
        <Fragment>
            <div>
                <div className="flex flex-1 gap-5 items-center">
                    <div
                        className={`flex gap-3 items-center px-2 py-3 rounded-lg border-2 border-neutral-300 cursor-pointer hover:shadow-lg transition-all w-56`}
                        onClick={togglePicker}
                    >
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8edff9b0fe2423f1fa6d271f3dca823bf43f90fa53d5166a49db967a79a8e404?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                            alt=""
                            className="w-6 h-6 object-contain"
                        />
                        <div className="text-base font-semibold text-zinc-800 text-sm">
                            {label}: <span className="text-gray-500">{selectedTime}</span>
                        </div>
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd51fce0e88f2b1a79d30b8bce530411e7cff32f3c94e50c97e9c7724d9ada82?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                            alt=""
                            className="w-6 h-5 object-contain"
                        />

                    </div>
                    {isPickerVisible && (
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={handleTimeChange}
                            className="mt-2 p-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                    )}
                </div>

                {errorMessage && <span className="text-red-500 text-sm mt-1 font-normal">{errorMessage}</span>}

            </div>
        </Fragment>
    );
};


const DiscountField = ({ value, onChange, type, name, errorMessage }) => (
    <Fragment>
        <div className="flex flex-wrap gap-5 justify-between mt-8 w-full max-w-[947px] text-zinc-600 max-md:max-w-full">
            <div className="flex gap-9 align-middle">
                <label htmlFor="discount" className="my-auto text-base font-bold">
                    Chiết khấu
                </label>
                <input
                    id="discount"
                    type={type}
                    name={name}
                    value={value}
                    className="px-2.5 py-2 text-sm whitespace-nowrap rounded border-solid border-[0.7px] border-stone-300"
                    onChange={onChange}
                />
                <label htmlFor="percent" className="my-auto text-base font-bold text-sm">
                    %
                </label>
            </div>

            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                alt=""
                className="object-contain shrink-0 my-auto w-5 aspect-square"
            />
        </div>
        <div>
            {errorMessage && <span className="text-red-500 text-sm mt-1 font-normal">{errorMessage}</span>}
        </div>

        <label htmlFor="percent" className="my-auto text-base font-bold text-sm text-gray-500">
            Note: Chiết khấu này sẽ áp dụng thanh toán online trên tổng số tiền của bill
        </label>
    </Fragment>
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

    const redirect = useNavigate();
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
                redirect('/admin/barmanager')
            } else {
                toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            console.error('Error adding bar:', error);
            setIsLoading(false);
        }
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
                redirect('/admin/barmanager')
            } else {
                toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
            console.error('Error adding bar:', error);
            setIsLoading(false);
        }
    };

    const options = [
        {
            value: true,
            label: 'Đang hoạt động',
            icon: 'https://img.icons8.com/?size=100&id=60362&format=png&color=4ECB71'
        },
        {
            value: false,
            label: 'Đang đóng cửa',
            icon: 'https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000'
        }
    ];

    return (
        <main className="flex flex-col items-start p-8 bg-white">
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
                    <CircularProgress />
                    <p className="text-xl font-semibold ml-4">Đang xử lý...</p>
                </div>
            )}

            <ToastContainer />
            <Fragment>
                <header className="flex justify-between items-center w-full">
                    <h1 className="self-start text-xl font-bold leading-snug text-zinc-600 flex">
                        Thêm quán Bar
                    </h1>
                    <div className="flex items-center">
                        <div className="items-center px-4 py-1 rounded-md border-2 border-solid border-neutral-200 relative">
                            <div className="w-[100%] inline-flex">
                                <img
                                    loading="lazy"
                                    src={options.find(option => option.value === formData.status)?.icon || 'default-icon-url-here'}
                                    alt=""
                                    className="object-contain aspect-square w-[25px] mr-2"
                                />
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="px-2 py-1 border border-none rounded-md outline-none bg-white flex items-center w-full"
                                >
                                    {options.find(option => option.value === formData.status)?.label}
                                    <img
                                        className='w-[18px] h-[20px] ml-2 mt-[4px]'
                                        src={isOpen
                                            ? 'https://img.icons8.com/?size=100&id=p4GKpK6kR11d&format=png&color=000000'
                                            : 'https://img.icons8.com/?size=100&id=wWIe68VyU6Qt&format=png&color=000000'}
                                        alt=""
                                    />
                                </button>
                                {isOpen && (
                                    <div className="absolute left-0 mt-12 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full">
                                        {options
                                            .filter(option => option.value !== formData.status)
                                            .map(option => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => handleStatusChange(option.value)}
                                                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <img
                                                        src={option.icon}
                                                        alt={option.label}
                                                        className="object-contain aspect-square w-[20px] mr-2"
                                                    />
                                                    <span>{option.label}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section className="flex flex-col items-start self-stretch mt-3 w-full text-zinc-600">
                    <div className="shrink-0 max-w-full h-px bg-orange-400 border border-orange-400 border-solid w-full" />

                    <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-[960px]">
                        <InputField errorMessage={errors.barName} name="barName" label="Tên quán" type="text" value={formData.barName} onChange={handleInputChange} />
                        <InputField errorMessage={errors.email} name="email" label="Email" type="text" value={formData.email} onChange={handleInputChange} />
                        <InputField errorMessage={errors.address} name="address" label="Địa chỉ" type="text" value={formData.address} onChange={handleInputChange} />
                        <InputField errorMessage={errors.phoneNumber} name="phoneNumber" label="Số điện thoại" type="number" value={formData.phoneNumber} onChange={handleInputChange} />
                    </div>

                    <div className="mt-8 w-[68%]">
                        <InputField errorMessage={errors.description} name="description" label="Mô tả" type="text" value={formData.description} onChange={handleInputChange} />
                    </div>

                    <label htmlFor="time" className="block text-base font-bold mt-8 ">
                        Chọn thời gian
                    </label>
                    <div className="flex gap-10 mt-3 max-w-full text-sm font-bold leading-6 text-zinc-600 w-[430px]">
                        <TimeSelector errorMessage={errors.startTime} label="Giờ mở cửa" value={formData.startTime} onChange={(newTime) => setFormData({ ...formData, startTime: newTime })} />
                        <TimeSelector errorMessage={errors.endTime} label="Giờ đóng cửa" value={formData.endTime} onChange={(newTime) => setFormData({ ...formData, endTime: newTime })} />
                    </div>

                    <div>
                        <DiscountField errorMessage={errors.discount} name="discount" type="number" value={formData.discount} onChange={handleInputChange} />
                    </div>
                </section>

                <label htmlFor="addImages" className="block text-base font-bold text-gray-700 mt-8 mb-4">
                    Thêm hình ảnh
                </label>

                <section className="flex flex-col items-start w-full max-w-[913px]">
                    <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-[105%]">
                        <DropzoneComponent onDrop={onDrop} />
                    </div>
                    <ImageGallery images={uploadedImages} onDelete={handleDelete} />
                    <button onClick={PopupConfirmAdd} className="px-16 py-2.5 mt-5 text-base font-bold text-center text-white whitespace-nowrap bg-orange-600 rounded w-[105%]">
                        Thêm
                    </button>
                    {isPopupConfirm && (
                        <Notification onCancel={PopupConfirmCancel} onConfirm={handleAddConfirm} />
                    )}
                </section>
            </Fragment>
        </main>
    );
};

export default AddBar;