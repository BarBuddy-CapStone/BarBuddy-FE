import React, { useEffect, useState } from "react";
import { ChevronRight } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import { getDrinkBasedCate } from "src/lib/service/managerDrinksService";

function Header({title}) {
    const redirect = useNavigate();
    const backCateDrinkHandle = () => {
        redirect("/admin/managerDrinkCategory")
    }

    const AddDrinkBtn = () => {
        redirect("/admin/managerDrink/addDrink")
    }
    return (
        <header className="m-[0px] flex flex-wrap gap-5 justify-between items-center w-full text-black max-w-[1485px] mx-auto p-4 bg-gray-50 shadow-md">
            <div className="flex items-center justify-center gap-4 text-lg font-bold">
                <button onClick={backCateDrinkHandle}>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                        alt="Logo"
                        className="object-contain w-8 aspect-square"
                    />
                </button>
                <h3 className="text-lg text-center">{title}</h3>
            </div>
            <div className="relative inline-flex">
                <select className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none">
                    <option>Filter by ALL</option>
                    <option>Filter by Active</option>
                    <option>Filter by Inactive</option>
                </select>

                <button onClick={AddDrinkBtn} className="flex items-center justify-center w-12 h-[45px] ml-[20px] bg-white rounded-md border border-black shadow-md">
                    <img
                        loading="lazy"
                        src="https://img.icons8.com/?size=100&id=24717&format=png&color=000000"
                        alt="Filter icon"
                        className="object-contain w-[27px]"
                    />
                </button>
            </div>
        </header>

    );
}

const TableHeader = () => {
    return (
        <div className="grid grid-cols-8 gap-3 items-center py-4 px-10 text-sm font-bold text-black bg-neutral-200">
            <div>Tên</div>
            <div>Mô tả</div>
            <div>Giá</div>
            <div>Thời gian tạo</div>
            <div>Thời gian cập nhật</div>
            <div>Danh mục</div>
            <div>Trạng thái</div>
            <div></div> {/* Placeholder for ChevronRight Icon */}
        </div>
    );
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`;
};
const Item = ({
    drinkId,
    drinkName,
    description,
    price,
    createdDate,
    updatedDate,
    drinksCategoryName,
    status,
    bgColor,
}) => {

    const redirect = useNavigate()
    const handleChevronClick = (drinkId) => {
        redirect(`/admin/managerDrink/DrinkDetail?drinkId=${drinkId}`);
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
                    {status === true ? "Active" : "Inactive"}
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


const ManagerDrink = () => {
    const location = useLocation();
    const [dataDrink, setDataDrink] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const cateId = searchParams.get('cateId');
        
        const fetchApiDrink = async () => {
            try {
                const response = await getDrinkBasedCate(cateId);
                setDataDrink(response.data.data);
            } catch (error) {
                console.error("Error fetching drinks:", error);
            }
        };

        fetchApiDrink();
    }, [location.search]); // Add location.search as a dependency

    // Conditional rendering to prevent undefined access
    const headerTitle = dataDrink.length > 0 ? dataDrink[0].drinksCategoryName : "Loading...";

    return (
        <main className="flex overflow-hidden flex-col">
            <Header title={headerTitle} />
            <div className="pt-[40px]">
                <table className="w-full text-xl text-black">
                    <TableHeader />
                    {Array.isArray(dataDrink) && dataDrink.length > 0 ? (
                        dataDrink.map((data, index) => (
                            <Item
                                key={index}
                                {...data}
                                bgColor={index % 2 === 0 ? "bg-white" : "bg-stone-50"}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Không có dữ liệu</td>
                        </tr>
                    )}
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <Pagination count={5} size="small" shape="rounded" />
            </div>
        </main>
    );
};

export default ManagerDrink;