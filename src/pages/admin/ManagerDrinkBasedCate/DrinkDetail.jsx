import { CircularProgress } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Notification } from "src/components";
import { getAllBar } from "src/lib/service/barManagerService";
import { getAllDrinkCate } from "src/lib/service/drinkCateService";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { getOneDrink, updateDrink } from "src/lib/service/managerDrinksService";

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

function DrinkDetail() {

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

    const redirect = useNavigate()
    const searchParams = new URLSearchParams(location.search);
    const drinkId = searchParams.get('drinkId');

    const handleStatusChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            status: value,
        }));
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Updating ${name} with value:`, value); // Thêm log này
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
            label: "Active",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=4ECB71"
        },
        {
            value: false,
            label: "Inactive",
            icon: "https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000"
        }
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataBar = await getAllBar();
                const dataDrinkCate = await getAllDrinkCate();
                const getDrink = await getOneDrink(drinkId);
                const dataEmosCate = await getAllEmotionCategory();
                const drinkData = getDrink.data.data;

                setDataEmoCate(dataEmosCate.data.data)
                setDataBar(dataBar.data.data);
                setDataDrinkCate(dataDrinkCate.data.data);
                setDataDrink(drinkData);

                setFormData({
                    drinkName: drinkData.drinkName,
                    drinkCategoryId: drinkData.drinkCategoryResponse.drinksCategoryId || '',
                    barId: dataBar.data.data.find(bar => bar.barName === drinkData.barName)?.barId || '',
                    description: drinkData.description,
                    price: drinkData.price,
                    status: drinkData.status,
                });
                if (drinkData.images) {
                    setUploadedImages(drinkData?.images.split(',').map((url) => ({
                        src: url.trim(),
                    })));
                }
                if (drinkData.emotionsDrink) {
                    setEmotionChecked(drinkData.emotionsDrink.map(emotion => ({
                        emotionalDrinksCategoryId: emotion.emotionalDrinksCategoryId,
                        categoryName: emotion.categoryName
                    })));
                }

                console.log("drinkData", drinkData)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [drinkId]);


    useEffect(() => {
        if (uploadedImages.length > 0) {
            setFormData((prevData) => ({
                ...prevData,
                images: uploadedImages.map(image => image.file)
            }));
        }
    }, [uploadedImages]);

    const EmotionPopup = ({ onClose, onSave, initialCheckedEmotions }) => {
        const [emotions, setEmotions] = useState(() => {
            return (Array.isArray(dataEmoCate) ? dataEmoCate : []).map(emotion => ({
                ...emotion,
                checked: initialCheckedEmotions.some(e => e.emotionalDrinksCategoryId === emotion.emotionalDrinksCategoryId),
            }));
        });

        const handleCheckboxChange = (index) => {
            setEmotions((prevEmotions) =>
                prevEmotions.map((emotion, i) => {
                    if (i === index) {
                        return { ...emotion, checked: !emotion.checked };
                    }
                    return emotion;
                })
            );
        };

        const handleSave = () => {
            const checkedEmotions = emotions
                .filter((emotion) => emotion.checked)
                .map((emotion) => ({
                    categoryName: emotion.categoryName,
                    emotionalDrinksCategoryId: emotion.emotionalDrinksCategoryId,
                }));

            onSave(checkedEmotions);
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                    <h2 className="text-lg text-center font-semibold mb-4 border-b border-yellow-500 pb-2">Danh sách cảm xúc</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="px-2 py-1"></th>
                                <th className="px-2 py-1">STT</th>
                                <th className="px-2 py-1">Cảm xúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(emotions) && emotions.length > 0 ? (
                                emotions.map((emotion, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b ${emotion.checked ? 'bg-orange-100' : 'hover:bg-orange-100'} `}
                                    >
                                        <td className="px-2 py-2">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={emotion.checked}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td className="px-2 py-2">{index + 1}</td>
                                        <td className="px-2 py-2">{emotion.categoryName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500">No emotions available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-evenly">
                        <button
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-blue-700"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const handleTestClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const validateForm = () => {
        let newErrors = {};
        console.log("Validating form. drinkCategoryId:", formData.drinkCategoryId); // Thêm log này
        if (!formData.drinkName) newErrors.drinkName = 'Tên đồ uống không được để trống';
        if (!formData.price) newErrors.price = 'Giá không được để trống';
        if (!formData.description) newErrors.description = 'Mô tả không được để trống';
        if (!formData.drinkCategoryId) newErrors.drinkCategoryId = 'Vui lòng chọn loại đồ uống';
        if (emotionChecked.length === 0) newErrors.emotion = 'Cảm xúc không chưa được thêm';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const PopupConfirmUpdate = () => {
        setIsPopupConfirm(true);
    };

    const PopupConfirmCancel = () => {
        setIsPopupConfirm(false);
    };


    const handleUpdateConfirm = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            console.log("Form validation failed"); // Thêm log này
            setIsPopupConfirm(false);
            return;
        }

        setIsLoading(true);
        setIsPopupConfirm(false);

        const formDatas = new FormData();
        formDatas.append('barId', formData.barId);
        formDatas.append('drinkCategoryId', formData.drinkCategoryId);
        formDatas.append('drinkName', formData.drinkName);
        formDatas.append('description', formData.description);
        formDatas.append('price', formData.price);
        formDatas.append('status', formData.status);

        if (emotionChecked.length > 0) {
            emotionChecked.forEach(emotion => {
                formDatas.append("drinkBaseEmo", emotion.emotionalDrinksCategoryId)
            })
        } else {
            setIsLoading(false)
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
        }
        if (uploadedImages.length > 0) {
            uploadedImages.forEach(image => {
                if (image.file && image.src) {
                    formDatas.append('images', image.file);
                    if (image.src.startsWith('http')) {
                        formDatas.append('oldImages', image.src);
                    }
                } else if (!image.file && image.src) {
                    formDatas.append('oldImages', image.src);
                } else if (image.file && !image.src) {
                    formDatas.append('images', image.file);
                }
            });
        } else {
            setIsLoading(false);
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
        }
        var response = await updateDrink(drinkId, formDatas)
        if (response.status === 200) {
            setIsLoading(false);
            toast.success("Cập nhật thành công!");
            setIsPopupConfirm(false);
        } else {
            setIsPopupConfirm(false);
            toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
        }
    }

    return (
        <main className="flex flex-col items-start p-8 bg-white">
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
                    <CircularProgress />
                    <p className="text-xl font-semibold ml-4">Đang xử lý...</p>
                </div>
            )}
            <header className="flex justify-between items-center w-full">
                <h1 className="self-start text-xl font-bold leading-snug text-zinc-600">Thông tin đồ uống</h1>
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
                                                    src={option?.icon}
                                                    alt={option?.label}
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

                    <InputField errorMessage={errors.drinkName} name="drinkName" label="Tên nước" type="text" value={formData.drinkName} onChange={handleInputChange} />
                    <InputField errorMessage={errors.price} name="price" label="Giá tiền" type="number" value={formData.price} onChange={handleInputChange} />

                    <div className="flex flex-col">
                        <label className="text-base font-bold mb-2 ">Loại đồ uống</label>
                        <div className="flex justify-between items-center px-3 py-3.5 text-sm rounded border border-solid border-stone-300">
                            <select
                                name="drinkCategoryId"
                                value={formData.drinkCategoryId || ''} // Thêm || '' để đảm bảo giá trị không bao giờ là undefined
                                onChange={handleInputChange}
                                className="flex-grow border-none outline-none h-5 px-2 w-[50%]"
                            >
                                <option value="" disabled>Chọn loại đồ uống</option>
                                {Array.isArray(dataDrinkCate) && dataDrinkCate.length > 0 ? (
                                    dataDrinkCate.map((option, index) => (
                                        <option key={index} value={option.drinksCategoryId}>
                                            {option.description}
                                        </option>
                                    ))
                                ) : (
                                    <option>No category drink available</option>
                                )}
                            </select>
                        </div>
                        {errors.drinkCategoryId && <span className="text-red-500 text-sm mt-1">{errors.drinkCategoryId}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-base font-bold">Mô tả</label>
                        <InputField
                            errorMessage={errors.description}
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="p-4 text-sm rounded border border-solid border-stone-300 h-40 overflow-y-auto w-[85%]"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <label htmlFor="description" className="block text-base font-bold mb-2">
                        Cảm xúc
                    </label>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex gap-4">
                            {emotionChecked.length > 0 && (
                                <div className="flex gap-2 items-center">
                                    {emotionChecked.map((emotion, index) => (
                                        <button
                                            onClick={handleTestClick}
                                            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-md border-2 border-solid border-neutral-200`}
                                        >
                                            {emotion.categoryName}{index < emotionChecked.length - 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={handleTestClick}
                                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-md border-2 border-solid border-neutral-200 text-orange-600`}
                            >
                                {emotionChecked.length > 0 ? "Chỉnh sửa" : "Thêm"}
                            </button>

                            {showPopup && (
                                <EmotionPopup
                                    onClose={handleClosePopup}
                                    onSave={handleSaveEmotions}
                                    initialCheckedEmotions={emotionChecked}
                                />
                            )}
                        </div>                        
                        {emotionChecked.length === 0 && <p className="text-red-500 text-sm mt-1">{errors.emotion}</p>}
                    </div>
                </div>
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain self-end mt-4 w-5 aspect-square" />
            </section>

            <section className="flex flex-col items-start w-full max-w-[913px]">
                <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-[105%]">
                    <DropzoneComponent onDrop={onDrop} />
                </div>
                <ImageGallery images={uploadedImages} onDelete={handleDelete} />
                <button onClick={PopupConfirmUpdate} className="px-16 py-2.5 mt-5 text-base font-bold text-center text-white whitespace-nowrap bg-orange-600 rounded w-[105%]">
                    Lưu
                </button>
                {isPopupConfirm &&
                    <Notification
                        onCancel={PopupConfirmCancel} onConfirm={handleUpdateConfirm} />
                }
            </section>
        </main>
    );
}

export default DrinkDetail;
