import React, { useEffect, useState } from "react";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import { getDrinkBasedCateByID } from "src/lib/service/managerDrinksService";

function Header({title, onFilterChange}) {
    const redirect = useNavigate();
    const backCateDrinkHandle = () => {
        redirect("/manager/managerDrinkCategory")
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
                <select 
                    className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
                    onChange={onFilterChange}
                >
                    <option value="ALL">Tất Cả</option>
                    <option value="Active">Hoạt Động</option>
                    <option value="Inactive">Không Hoạt Động</option>
                </select>
            </div>
        </header>
    );
}

const TableHeader = () => {
    return (
        <div className="grid grid-cols-9 gap-3 items-center py-4 px-10 text-sm font-bold text-black bg-neutral-200">
            <div className="col-span-1">Tên</div>
            <div className="col-span-2">Mô tả</div>
            <div className="col-span-1">Giá</div>
            <div className="col-span-1">Thời gian tạo</div>
            <div className="col-span-1">Thời gian cập nhật</div>
            <div className="col-span-1">Danh mục</div>
            <div className="col-span-1 text-center">Trạng thái</div>
            <div className="col-span-1"></div>
        </div>
    );
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
    const navigate = useNavigate()
    const handleChevronClick = (drinkId) => {
        navigate(`/manager/managerDrink/DrinkDetail/${drinkId}`);
    }
    return (
        <div
            className={`grid grid-cols-9 gap-3 py-3 px-10 items-center text-sm text-black ${bgColor}`}
        >
            <div className="col-span-1 truncate">{drinkName}</div>
            <div className="col-span-2 truncate">{description}</div>
            <div className="col-span-1">{formatPrice(price)}</div>
            <div className="col-span-1 whitespace-nowrap">{formatDate(createdDate)}</div>
            <div className="col-span-1 whitespace-nowrap">{formatDate(updatedDate)}</div>
            <div className="col-span-1 truncate">{drinksCategoryName}</div>
            <div className="col-span-1 flex justify-center">
                <span
                    className={`inline-block text-center px-2 py-1 rounded-full text-white text-xs ${
                        status === true ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {status === true ? "Hoạt Động" : "Không Hoạt Động"}
                </span>
            </div>
            <div className="col-span-1 flex justify-end">
                <button
                    onClick={() => handleChevronClick(drinkId)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

const ManagerDrink = () => {
    const { cateId } = useParams();
    const [dataDrink, setDataDrink] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchApiDrink = async () => {
            try {
                setLoading(true);
                const response = await getDrinkBasedCateByID(cateId);
                if (response?.data?.data) {
                    setDataDrink(response.data.data.drinkResponses || []);
                    setTotalPages(response.data.data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching drinks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (cateId) {
            fetchApiDrink();
        }
    }, [cateId]);

    const headerTitle = "Quay lại";

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    // Hàm để lọc danh sách đồ uống
    const filteredDrinks = dataDrink.filter(drink => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'Active') return drink.status === true;
        if (filterStatus === 'Inactive') return drink.status === false;
        return true;
    });

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <main className="flex overflow-hidden flex-col">
            <Header title={headerTitle} onFilterChange={handleFilterChange} />
            <div className="pt-[40px] flex flex-col items-center">
                <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4">Danh Sách Thức Uống</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="w-full">
                        <table className="w-full text-xl text-black">
                            <TableHeader />
                            {filteredDrinks.length > 0 ? (
                                filteredDrinks.map((data, index) => (
                                    <Item
                                        key={data.drinkId}
                                        {...data}
                                        drinksCategoryName={data?.drinkCategoryResponse?.drinksCategoryName}
                                        bgColor={index % 2 === 0 ? "bg-white" : "bg-stone-50"}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">Không có dữ liệu</td>
                                </tr>
                            )}
                        </table>
                    </div>
                )}
            </div>
            {!loading && filteredDrinks.length > 0 && (
                <div className="flex justify-center mt-6 mb-6">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </div>
            )}
        </main>
    );
};

export default ManagerDrink;
