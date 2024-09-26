import React, { useState } from 'react';

const InputField = ({ label, value, onChange, type }) => (
    <div className="flex flex-col">
        <label className="text-sm font-bold mb-2">{label}</label>
        <div className="flex justify-between items-center px-3 py-3.5 text-sm rounded border border-solid border-stone-300">
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="flex-grow border-none outline-none h-5 px-2"
            />
        </div>
    </div>
);


const TimeSelector = ({ label, isCloseTime }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const togglePicker = () => {
        setPickerVisible(!isPickerVisible);
        setIsActive(!isActive);
    };

    return (
        <div className="flex flex-1 gap-5 items-center">
            <div
                className={`flex gap-3 items-center px-4 py-3 rounded-lg border-2 border-neutral-300 cursor-pointer hover:shadow-lg transition-all ${isActive ? (isCloseTime ? 'w-64' : 'w-56') : 'w-56'}`} // Adjust width based on active state and type
                onClick={togglePicker}
            >
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8edff9b0fe2423f1fa6d271f3dca823bf43f90fa53d5166a49db967a79a8e404?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt=""
                    className="w-6 h-6 object-contain"
                />
                <div className="text-base font-semibold text-zinc-800 text-xs">
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
    );
};

const DiscountField = ({ value, onChange, type }) => (
    <div className="flex flex-wrap gap-5 justify-between mt-8 w-full max-w-[947px] text-zinc-600 max-md:max-w-full">
        <div className="flex gap-9 align-middle">
            <label htmlFor="discount" className="my-auto text-base font-bold text-sm">
                Chiết khấu
            </label>
            <input
                id="discount"
                type={type}
                value={value}
                className="px-2.5 py-2 text-sm whitespace-nowrap rounded border-solid border-[0.7px] border-stone-300"
                onChange={onChange}
            />
            <label htmlFor="percent" className="my-auto text-base font-bold text-sm">
                %
            </label>
        </div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain shrink-0 my-auto w-5 aspect-square" />
    </div>
);

const ImageGallery = ({ value }) => {
    const images = [
        { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f93bc9b47df327fb28e22b12d2d89d2d489da1b5407d009fe581167aec8513d8?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f", alt: "Bar image 1" },
        { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b89200b48cadbf477f9eff6083104b270513b50f28839093068539d87dc28706?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f", alt: "Bar image 2" },
        { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f772fe355cde42a2045b42e0c988e05c8f821a6ebfaa37a8512431f5f3dce99c?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f", alt: "Bar image 3" },
        { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/452f6128378f3a34a774813dd667e9a3bbf32e5954a507e2120dfe551b486959?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f", alt: "Bar image 4" }
    ];

    return (
        <div className="mt-4 max-w-full w-[490px] max-md:mt-10">
            <div className="flex gap-5 max-md:flex-col">
                {images.map((image, index) => (
                    <div key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
                        <div className="flex grow max-md:mt-2.5">
                            <img loading="lazy" src={image.src} alt={image.alt} className="object-contain shrink-0 max-w-full rounded-md aspect-square w-[100px]" />
                            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0589e620273b2e652a0dc191ef63970d47917603ab9789d02c3aad8959e9a24?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain shrink-0 self-start aspect-square w-[15px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BarBuddyProfile = () => {
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [barName, setBarName] = useState('');
    const [emailBar, setEmailBar] = useState('');
    const [description, setDescription] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [discount, setDiscount] = useState('');
    const [images, setImages] = useState([]);

    const [status, setStatus] = useState("open");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
    return (
        <main className="flex flex-col items-start p-8 bg-white">
            <header className="flex justify-between items-center w-full">
                <h1 className="self-start text-xl font-bold leading-snug text-zinc-600">Bar Details</h1>
                <div className="flex items-center">
                    <div className="flex items-center px-4 py-2.5 rounded-md border-2 border-solid border-neutral-200">
                        <img
                            loading="lazy"
                            src={
                                status === "open"
                                    ? "https://cdn.builder.io/api/v1/image/assets/TEMP/156e2610bd08d31cc26e11e25e18c7cb73bf92dbf42314c1061a6e53331a4011?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                                    : "https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000"
                            }
                            alt=""
                            className="object-contain aspect-square w-[25px] mr-2"
                        />
                        {/* <span>{status === "open" ? "Đang hoạt động" : "Đang đóng cửa"}</span> */}
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="ml-4 px-2 py-1 border border-none rounded-md"
                        >
                            <option value="open">Đang hoạt động</option>
                            <option value="closed">Đang đóng cửa</option>
                        </select>
                    </div>
                </div>
            </header>

            <section className="flex flex-col items-start self-stretch mt-3 w-full text-zinc-600">
                <div className="shrink-0 max-w-full h-px bg-orange-400 border border-orange-400 border-solid w-full" />

                <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-[960px]">

                    <InputField label="Tên quán" type="text" value={barName} onChange={(e) => setBarName(e.target.value)} />
                    <InputField label="Email" type="text" value={emailBar} onChange={(e) => setEmailBar(e.target.value)} />
                    <InputField label="Địa chỉ" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <InputField label="Số điện thoại" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>

                <div className="mt-8 w-[85%]">
                    <label htmlFor="description" className="block text-sm font-bold mb-2">
                        Mô tả
                    </label>
                    <div className="w-[82%]">
                        <div className="w-[97%]">
                            <InputField
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="p-4 text-sm rounded border border-solid border-stone-300 h-40 overflow-y-auto w-[85%]"
                            />
                        </div>
                    </div>
                </div>

                <label htmlFor="time" className="block text-sm font-bold mt-8 ">
                    Chọn thời gian
                </label>
                <div className="flex gap-10 mt-3 max-w-full text-sm font-bold leading-6 text-zinc-600 w-[430px]">

                    <TimeSelector label="Giờ mở cửa" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                    <TimeSelector label="Giờ đóng cửa" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                </div>
                <div>
                    <DiscountField type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                </div>
            </section>

            <label htmlFor="addImages" className="block text-sm font-bold text-gray-700 mt-8 mb-4">
                Thêm hình ảnh
            </label>

            <section className="flex flex-col items-start w-full max-w-[913px]">
                <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-[105%]">
                    <div className="text-center h-32 text-gray-500">Drop images or click to upload</div>
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain -mb-5 w-5 aspect-square" />
                </div>
                <ImageGallery />
                <button className="px-16 py-2.5 mt-5 text-base font-bold text-center text-white whitespace-nowrap bg-orange-600 rounded w-[105%]">
                    Lưu
                </button>
            </section>
        </main>
    );
};

export default BarBuddyProfile;