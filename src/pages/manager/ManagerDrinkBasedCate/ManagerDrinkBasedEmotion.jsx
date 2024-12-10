import React, { useEffect, useState } from "react";
// import { wineData } from "../../../lib/service/managerDrinksService";
import { ChevronRight } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import { getAllDrinkEmo } from "src/lib/service/drinkCateService";

function Header() {
    const redirect = useNavigate();

    const backCateEmotionalHandle = () => {
        redirect("/emotional")
    }

    return (
        <header className="m-[0px] flex flex-wrap gap-5 justify-between items-center w-full text-black max-w-[1485px] mx-auto p-4 bg-gray-50 shadow-md">
            <div className="flex items-center justify-center gap-4 text-lg font-bold">
                <button onClick={backCateEmotionalHandle}>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                        alt="Logo"
                        className="object-contain w-8 aspect-square"
                    />
                </button>
                <h3 className="text-lg text-center">Vui vẻ</h3>
            </div>
            <div className="relative inline-flex">
                <select className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none">
                    <option>Filter by ALL</option>
                    <option>Filter by Active</option>
                    <option>Filter by Inactive</option>
                </select>
            </div>
        </header>

    );
}

function TableHeader() {
    return (
        <div className="grid grid-cols-8 gap-3 items-center py-4 px-10 text-sm font-bold text-black bg-neutral-200">
            <div>Tên</div>
            <div>Mô tả</div>
            <div>Giá</div>
            <div>Thời gian tạo</div>
            <div>Thời gian cập nhật</div>
            <div>Danh mục</div>
            <div>Trạng thái</div>
            <div></div>
        </div>
    );
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date?.getDate()).padStart(2, '0');
    const month = String(date?.getMonth() + 1).padStart(2, '0');
    const year = date?.getFullYear();
    return `${day}-${month}-${year}`;
};

function DrinkItems({
    drinkName,
    description,
    price,
    image,
    createdDate,
    updatedDate,
    drinksCategoryName,
    status,
    drinkId,
    bgColor,
}) {

    const redirect = useNavigate()
    const handleChevronClick = (drinkId) => {
        redirect(`/manager/managerDrink/DrinkDetail?drinkId=${drinkId}`);
    }
    return (
        <div
            className={`grid grid-cols-8 gap-3 py-3 px-10 items-center text-sm text-black ${bgColor}`}
        >
            <div className="flex items-center">
                {drinkName}
            </div>
            <div>{description}</div>
            <div>
                <span>{price}</span>
            </div>
            <div>{formatDate(createdDate)}</div>
            <div>{formatDate(updatedDate)}</div>
            <div>{drinksCategoryName}</div>
            <div>
                <span
                    className={`flex justify-center items-center w-20 px-2 py-1 rounded-full text-white text-sm font-notoSansSC ${status === true ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {status === true ? "Hoạt Động" : "Không Hoạt Động"}
                </span>
            </div>
            <div
                className="justify-self-end cursor-pointer"
                onClick={() => handleChevronClick(drinkId)}
            >
                <ChevronRight />
            </div>
        </div>
    );
}


function ManagerDrinkBasedEmo() {
    const loction = useLocation();
    const searchParams = new URLSearchParams(loction.search)
    const emoId = searchParams.get('emoId');

    const [dataDrinkEmo, setDataDrinkEmo] = useState([])
    useEffect(() => {
        const fetchDataDrinkEmo = async () => {
            const response = await getAllDrinkEmo(emoId)
            const dataFetch = response?.data?.data
            setDataDrinkEmo(dataFetch)
        }
        fetchDataDrinkEmo();
    }, [emoId])

    useEffect(() => {
    }, [dataDrinkEmo])
    return (
        <main className="flex overflow-hidden flex-col">
            <Header />
            <div className="pt-[40px]">
                <table class="w-full text-xl text-black">
                    <TableHeader />
                    {dataDrinkEmo.map((drink, index) => (
                        <DrinkItems
                            key={index}
                            {...drink}
                            drinksCategoryName={drink?.drinkCategoryResponse?.drinksCategoryName}
                            bgColor={index % 2 === 0 ? "bg-white" : "bg-stone-50"}
                        />
                    ))}
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <Pagination count={5} size="small" shape="rounded" />
            </div>
        </main>
    );
}

export default ManagerDrinkBasedEmo;