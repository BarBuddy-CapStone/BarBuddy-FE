import React, { useState } from "react";
import { actionButtons, branches, images, waterTypes } from "src/lib/service/drinkDetail";

const InputField = ({ label, value, onChange, type }) => (
    <div className="flex flex-col">
        <label className="text-xs font-bold mb-2">{label}</label>
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
function DrinkDetail() {

    const [drinkName, setDrinkName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState("active");

    const handleStatusChange = (event) => {
      setStatus(event.target.value);
    };


    return (
        <main className="flex flex-col items-start p-8 bg-white">
            <header className="flex justify-between items-center w-full">
                <h1 className="self-start text-xl font-bold leading-snug text-zinc-600">Drink Details</h1>
                <div className="flex items-center">
                    <div className="flex items-center px-4 py-2.5 rounded-md border-2 border-solid border-neutral-200">
                        <img
                            loading="lazy"
                            src={
                                status === "active"
                                    ? "https://cdn.builder.io/api/v1/image/assets/TEMP/156e2610bd08d31cc26e11e25e18c7cb73bf92dbf42314c1061a6e53331a4011?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                                    : "https://img.icons8.com/?size=100&id=60362&format=png&color=FF0000"
                            }
                            alt=""
                            className="object-contain aspect-square w-[25px] mr-2"
                        />
                        {/* <span>{status === "active" ? "Đang hoạt động" : "Đang đóng cửa"}</span> */}
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="ml-4 px-2 py-1 border border-none rounded-md"
                        >
                            <option value="active">Active</option>
                            <option value="closed">Inactive</option>
                        </select>
                    </div>
                </div>
            </header>

            <section className="flex flex-col items-start self-stretch mt-3 w-full text-zinc-600">
                <div className="shrink-0 max-w-full h-px bg-orange-400 border border-orange-400 border-solid w-full" />

                <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-[960px]">

                    <InputField label="Tên nước" type="text" value={drinkName} onChange={(e) => setDrinkName(e.target.value)} />
                    <InputField label="Giá tiền" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />


                    {waterTypes.map((detail, index) => (
                        <div key={index} className="flex flex-col">
                            <label className="text-xs font-bold mb-2">{detail.label}</label>
                            <div className="flex justify-between items-center px-3 py-3.5 text-sm rounded border border-solid border-stone-300">
                                <select className="flex-grow border-none outline-none h-5 px-2">  
                                    {detail.options.map((option, idx) => (
                                        <option key={idx} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    {branches.map((detail, index) => (
                        <div key={index} className="flex flex-col">
                            <label className="text-xs font-bold mb-2">{detail.label}</label>
                            <div className="flex justify-between items-center px-3 py-3.5 text-sm rounded border border-solid border-stone-300">
                                <select className="flex-grow border-none outline-none h-5 px-2"> 
                                    {detail.options.map((option, idx) => (
                                        <option key={idx} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 w-[85%]">
                    <label htmlFor="description" className="block text-xs font-bold mb-2">
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
                <div className="mt-8">
                    <label htmlFor="description" className="block text-xs font-bold mb-2">
                        Cảm xúc
                    </label>
                    <div className="flex gap-4 mt-4">
                        {actionButtons.map((button, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-md border-2 border-solid border-neutral-200 ${button === "Chỉnh sửa" ? "text-orange-600" : ""
                                    }`}
                            >
                                {button}
                            </button>
                        ))}
                    </div>
                </div>
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain self-end mt-4 w-5 aspect-square" />
            </section>

            <section className="flex flex-col items-start w-full max-w-[913px]">
                <div className="">
                    <label htmlFor="description" className="block text-xs font-bold mb-2 text-gray-700">
                        Thêm hình ảnh
                    </label>

                </div>
                <div className="flex flex-col items-center self-stretch px-20 rounded border border-dashed border-stone-300 w-[105%]">
                    <div className="text-center h-32 text-gray-500">Drop images or click to upload</div>
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/013784721bbb86b82d66b83d6b3f93365b12b768110ceb6a6a559c5674645320?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" alt="" className="object-contain -mb-5 w-5 aspect-square" />
                </div>
                <div className="flex gap-4 mt-8">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                loading="lazy"
                                src={image.src}
                                alt={image.alt}
                                className="object-cover rounded-md w-[100px] h-[100px]"
                            />
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0589e620273b2e652a0dc191ef63970d47917603ab9789d02c3aad8959e9a24?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                                alt=""
                                className="absolute top-1 right-1 w-[15px] h-[15px]"
                            />
                        </div>
                    ))}
                </div>

                <button className="px-16 py-2.5 mt-5 text-base font-bold text-center text-white whitespace-nowrap bg-orange-600 rounded w-[105%]">
                    Lưu
                </button>
            </section>
        </main>
    );
}

export default DrinkDetail;