import { ChevronLeft } from '@mui/icons-material';
import { Button, Chip, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Notification } from "src/components";
import { getAllDrinkCate, getOneDrinkCate } from "src/lib/service/drinkCateService";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { getOneDrink, updateDrink } from "src/lib/service/managerDrinksService";
import { message } from 'antd';

const InputField = ({ label, value, onChange, name, type, errorMessage, multiline, rows }) => (
    <TextField
        fullWidth
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

const PriceInput = ({ value, onChange, error }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    };

    const handleChange = (e) => {
        const input = e.target.value.replace(/[^\d]/g, '');
        onChange(input);
    };

    return (
        <TextField
            fullWidth
            label="Giá tiền"
            variant="outlined"
            value={formatPrice(value)}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
            }}
            margin="normal"
        />
    );
};

function DrinkDetail() {
    const { drinkId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [cateId, setCateId] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isPopupConfirm, setIsPopupConfirm] = useState(false)
    const [uploadedImages, setUploadedImages] = useState([]);
    const [dataBars, setDataBar] = useState([]);
    const [dataDrinkCate, setDataDrinkCate] = useState([]);
    const [dataDrink, setDataDrink] = useState([]);
    const [dataEmoCate, setDataEmoCate] = useState([])
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [emotionChecked, setEmotionChecked] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [selectedEmotion, setSelectedEmotion] = useState('');
    const [showEmotionSelect, setShowEmotionSelect] = useState(false);

    const [formData, setFormData] = useState({
        drinkName: '',
        drinkCategoryId: '',
        barId: '',
        description: '',
        price: '',
        drinkBaseCate: '',
        status: true,
        images: []
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('cateId');
        setCateId(id);
    }, [location]);

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo?.identityId) {
            setFormData(prev => ({
                ...prev,
                barId: userInfo.identityId
            }));
        }
    }, []);

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

    const handleSaveEmotions = (checkedEmotions) => {
        setEmotionChecked(checkedEmotions);
    };

    const options = [
        {
            value: true,
            label: "Hoạt Động",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=4ECB71"
        },
        {
            value: false,
            label: "Không Hoạt Động",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch emotions
                const emotionsResponse = await getAllEmotionCategory();
                if (emotionsResponse?.data?.data?.emotionCategoryResponses) {
                    setEmotions(emotionsResponse.data.data.emotionCategoryResponses);
                } else {
                    console.error('Invalid emotions data:', emotionsResponse);
                    setEmotions([]);
                }

                // Fetch drink categories
                const drinkCatesResponse = await getAllDrinkCate(1, 100);
                if (drinkCatesResponse?.data?.data?.drinkCategoryResponses) {
                    setDataDrinkCate(drinkCatesResponse.data.data.drinkCategoryResponses);
                } else {
                    console.error('Invalid drink categories data:', drinkCatesResponse);
                    setDataDrinkCate([]);
                }

                // Fetch drink detail
                const drinkResponse = await getOneDrink(drinkId);
                if (drinkResponse?.data?.data) {
                    const drinkData = drinkResponse.data.data;
                    setDataDrink(drinkData);
                    setFormData({
                        drinkName: drinkData.drinkName,
                        drinkCategoryId: drinkData.drinkCategoryResponse.drinksCategoryId,
                        description: drinkData.description,
                        price: drinkData.price.toString(),
                        status: drinkData.status
                    });

                    if (drinkData.images) {
                        setUploadedImages(drinkData.images.split(',').map((url) => ({
                            src: url.trim()
                        })));
                    }

                    // Set emotions
                    if (drinkData.emotionsDrink) {
                        setEmotionChecked(drinkData.emotionsDrink.map(emotion => ({
                            emotionalDrinksCategoryId: emotion.emotionalDrinksCategoryId,
                            categoryName: emotion.categoryName
                        })));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Có lỗi xảy ra khi tải dữ liệu');
            }
        };

        fetchData();
    }, [drinkId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin drink category từ cateId trong URL
                if (cateId) {
                    const response = await getOneDrinkCate(cateId);
                    if (response?.data?.data) {
                        const category = response.data.data;
                        setDataDrinkCate([category]); // Set vào mảng để dùng cho dropdown
                        setFormData((prevData) => ({
                            ...prevData,
                            drinkCategoryId: category.drinksCategoryId
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Không thể tải thông tin loại đồ uống');
            }
        };
        fetchData();
    }, [cateId]);

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

    const PopupConfirmUpdate = () => {
        setIsPopupConfirm(true);
    };

    const PopupConfirmCancel = () => {
        setIsPopupConfirm(false);
    };

    const handleUpdateConfirm = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            const barId = userInfo?.identityId;

            if (!barId) {
                throw new Error('Không tìm thấy thông tin quán bar');
            }

            // Thay đổi: Chuyển emotionChecked thành mảng các ID thay vì chuỗi
            const drinkBaseEmo = emotionChecked.map(emotion => 
                emotion.emotionalDrinksCategoryId
            );

            // Tách riêng oldImages và images mới
            const oldImages = uploadedImages
                .filter(img => !img.file)
                .map(img => img.src)
                .join(',');

            // Xử lý ảnh mới
            const newImagePromises = uploadedImages
                .filter(img => img.file)
                .map(image => 
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

            const newImagesBase64 = await Promise.all(newImagePromises);
            const newImages = newImagesBase64.join(',');

            const drinkData = {
                ...formData,
                barId: barId,
                drinkBaseEmo: drinkBaseEmo, // Gửi mảng ID thay vì chuỗi
                oldImages: oldImages,
                images: newImages
            };

            const response = await updateDrink(drinkId, drinkData);
            if (response.data.statusCode === 200) {
                message.success(response.data.message);
                const categoryId = response.data.data.drinkCategoryResponse.drinksCategoryId;
                navigate(`/manager/managerDrinkCategory/managerDrink/${categoryId}`);
            }
        } catch (error) {
            console.error('Error updating drink:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đồ uống');
        } finally {
            setIsLoading(false);
            setIsPopupConfirm(false);
        }
    };

    const handleGoBack = () => {
        if (cateId) {
            navigate(`/manager/managerDrinkCategory/managerDrink/${cateId}`);
        } else {
            // Fallback nếu không có cateId
            navigate('/manager/managerDrinkCategory');
        }
    };

    const validateForm = () => {
        let newErrors = {};
        
        // Validate drinkName (7-50 ký tự)
        if (!formData.drinkName) {
            newErrors.drinkName = 'Tên đồ uống không được để trống';
        } else if (formData.drinkName.length < 7) {
            newErrors.drinkName = 'Tên đồ uống phải có ít nhất 7 ký tự';
        } else if (formData.drinkName.length > 50) {
            newErrors.drinkName = 'Tên đồ uống không được vượt quá 50 ký tự';
        }

        if (!formData.price) newErrors.price = 'Giá không được để trống';
        if (!formData.description) newErrors.description = 'Mô tả không được để trống';
        if (!formData.drinkCategoryId) newErrors.drinkCategoryId = 'Vui lòng chọn loại đồ uống';
        if (emotionChecked.length === 0) newErrors.emotion = 'Cảm xúc chưa được thêm';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShowEmotionSelect = () => {
        setShowEmotionSelect(true);
    };

    const handleHideEmotionSelect = () => {
        setShowEmotionSelect(false);
        setSelectedEmotion('');
    };

    const handleEmotionChange = (event) => {
        const selectedEmotionId = event.target.value;
        const selectedEmotion = emotions.find(emotion => 
            emotion.emotionalDrinksCategoryId === selectedEmotionId
        );
        if (selectedEmotion) {
            setEmotionChecked(prev => [...prev, selectedEmotion]);
            setSelectedEmotion('');
        }
    };

    const handleDeleteEmotion = (emotionToDelete) => {
        setEmotionChecked(prev => 
            prev.filter(emotion => 
                emotion.emotionalDrinksCategoryId !== emotionToDelete.emotionalDrinksCategoryId
            )
        );
    };

    // Lọc ra các cảm xúc chưa được chọn để hiển thị trong dropdown
    const availableEmotions = Array.isArray(emotions) ? emotions.filter(emotion => 
        !emotionChecked.some(checked => checked.emotionalDrinksCategoryId === emotion.emotionalDrinksCategoryId)
    ) : [];

    return (
        <main className="flex flex-col items-start p-8 bg-white w-full">
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
                    <h1 className="text-2xl font-bold text-zinc-600">Cập Nhật Đồ Uống</h1>
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

                <h2 className="text-xl font-bold mt-6 mb-4">Thông tin thức uống</h2>

                <div className="grid grid-cols-2 gap-6 mt-2 w-full max-w-[960px]">
                    <InputField 
                        errorMessage={errors.drinkName} 
                        name="drinkName" 
                        label="Tên nước" 
                        type="text" 
                        value={formData.drinkName} 
                        onChange={handleInputChange} 
                    />
                    <PriceInput
                        value={formData.price}
                        onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                        error={errors.price}
                    />

                    <FormControl fullWidth error={!!errors.drinkCategoryId} margin="normal">
                        <InputLabel id="drink-category-label">Loại đồ uống</InputLabel>
                        <Select
                            labelId="drink-category-label"
                            id="drink-category-select"
                            name="drinkCategoryId"
                            value={formData.drinkCategoryId}
                            onChange={handleInputChange}
                            label="Loại đồ uống"
                        >
                            <MenuItem value="" disabled>Chọn loại đồ uống</MenuItem>
                            {Array.isArray(dataDrinkCate) && dataDrinkCate.length > 0 ? (
                                dataDrinkCate.map((option) => (
                                    <MenuItem key={option.drinksCategoryId} value={option.drinksCategoryId}>
                                        {option.drinksCategoryName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="">No category drink available</MenuItem>
                            )}
                        </Select>
                        {errors.drinkCategoryId && <FormHelperText>{errors.drinkCategoryId}</FormHelperText>}
                    </FormControl>

                    <InputField
                        errorMessage={errors.description}
                        name="description"
                        label="Mô tả"
                        type="text"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={1}
                        sx={{ height: '56px' }}
                    />
                </div>

                <hr className="w-full border-t border-gray-300 my-6" />

                <h2 className="text-xl font-bold mb-4">Cảm xúc</h2>

                <div className="w-full max-w-[960px]">
                    {availableEmotions.length > 0 ? (
                        !showEmotionSelect ? (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleShowEmotionSelect}
                                className="mt-2"
                            >
                                Thêm cảm xúc
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FormControl style={{ minWidth: 200 }}>
                                    <InputLabel id="emotion-select-label">Chọn cảm xúc</InputLabel>
                                    <Select
                                        labelId="emotion-select-label"
                                        id="emotion-select"
                                        value={selectedEmotion}
                                        onChange={handleEmotionChange}
                                        label="Chọn cảm xúc"
                                    >
                                        {availableEmotions.map((emotion) => (
                                            <MenuItem key={emotion.emotionalDrinksCategoryId} value={emotion.emotionalDrinksCategoryId}>
                                                {emotion.categoryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="outlined"
                                    style={{ 
                                        color: '#d32f2f', 
                                        borderColor: '#d32f2f',
                                        height: '56px',
                                    }}
                                    onClick={handleHideEmotionSelect}
                                >
                                    Hủy
                                </Button>
                            </div>
                        )
                    ) : (
                        <p className="text-green-600 font-semibold">Tất cả cảm xúc đã được chọn</p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                        {emotionChecked.map((emotion) => (
                            <Chip
                                key={emotion.emotionalDrinksCategoryId}
                                label={emotion.categoryName}
                                onDelete={() => handleDeleteEmotion(emotion)}
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                    </div>
                    {emotionChecked.length === 0 && <p className="text-red-500 text-sm mt-1">{errors.emotion}</p>}
                </div>

                <hr className="w-full border-t border-gray-300 my-6" />

                <h2 className="text-xl font-bold mb-4">Hình ảnh</h2>

                <div className="w-full">
                    <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-full">
                        <DropzoneComponent onDrop={onDrop} />
                    </div>
                    <ImageGallery images={uploadedImages} onDelete={handleDelete} />
                </div>
            </section>

            <div className="w-full mt-5">
                <button 
                    onClick={PopupConfirmUpdate} 
                    className="w-full px-16 py-2.5 text-base font-bold text-center text-white whitespace-nowrap bg-orange-600 rounded hover:bg-orange-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                    Lưu
                </button>
            </div>

            {isPopupConfirm &&
                <Notification
                    onCancel={PopupConfirmCancel} onConfirm={handleUpdateConfirm} />
            }
        </main>
    );
}

export default DrinkDetail;
