import React from "react";
import { wineData } from "../../../lib/service/managerDrinksService";

function Header() {
    return (
        <header className="m-[0px] flex flex-wrap gap-5 justify-between items-center w-full text-black max-w-[1485px] mx-auto p-4 bg-gray-50 shadow-md">
            <div className="flex items-center justify-center gap-4 text-3xl font-bold">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt="Logo"
                    className="object-contain w-8 aspect-square"
                />
                <h3 className="text-center">Rượu vang</h3>
            </div>

            <div className="flex gap-5 my-auto text-xl">
                <div className="flex items-center gap-2 py-2 px-4 bg-white rounded-md border border-black shadow-md">
                    <div>Filter by ALL</div>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f5f251d31689da7ac45dc3b7f2831f35f866ae1707308d3585b61c89f2aa37eb?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                        alt="Filter icon"
                        className="object-contain aspect-[1.93] w-[20px]"
                    />
                </div>

                <button className="flex items-center justify-center w-12 h-[45px] bg-white rounded-md border border-black shadow-md">
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

function TableHeader() {
    return (
        <thead className="bg-neutral-200 font-bold  pt-[10px]">
            <tr>
                <th class="w-1/8">Tên</th>
                <th class="w-1/8">Mô tả</th>
                <th class="w-1/8">Giá</th>
                <th class="w-1/8">Ảnh</th>
                <th class="w-1/8 text-center">Thời gian tạo</th>
                <th class="w-1/8 text-center">Thời gian cập nhật</th>
                <th class="w-1/8">Danh mục</th>
                <th class="w-1/8 text-center">Trạng thái</th>
            </tr>
        </thead>
    );
}

function WineItem({
    name,
    description,
    price,
    image,
    createdAt,
    updatedAt,
    category,
    status,
    bgColor,
}) {
    return (
        <tbody className={`"${bgColor}"`}>
            <tr>
                <td class="text-center border-b border-gray-300 pb-1.5">{name}</td>
                <td class="text-center border-b border-gray-300 pb-1.5">{description}</td>
                <td class="text-center border-b border-gray-300 pb-1.5">{price}</td>
                <td class="text-center border-b border-gray-300 pb-1.5">{image}</td>
                <td class="text-center border-b border-gray-300 pb-1.5">
                    <span>
                        {createdAt.split(" ")[0]} {createdAt.split(" ")[1]} {createdAt.split(" ")[2]}
                    </span>
                    <br />
                    <span class="text-black">{createdAt.split(" ")[3]}</span>
                </td>
                <td class="text-center border-b border-gray-300 pb-1.5">
                    <span>
                        {updatedAt.split(" ")[0]} {updatedAt.split(" ")[1]} {updatedAt.split(" ")[2]}
                    </span>
                    <br />
                    <span class="text-black">{updatedAt.split(" ")[3]}</span>
                </td>
                <td class="text-center border-b border-gray-300 pb-1.5">{category}</td>
                <td class={`text-center border-b border-gray-300 pb-1.5 ${status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{status}</td>
                <td class="text-center border-b border-gray-300 pb-1.5">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d2b350c5f6d91a1c7a2fe3afffcde08483fe6ed6297eff9f94fa0bad685cd54?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                        alt=""
                        class="object-contain w-5 h-5"
                    />
                </td>
            </tr>
        </tbody>
    );
}

function Pagination() {
    return (
        <nav
            className="flex gap-3 items-start self-end mt-5 max-md:mr-2.5"
            aria-label="Pagination"
        >
            <div className="flex mt-1.5">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/da564c2683807ab58a27bd500a992dfe36d5e0b0e2c9db091f6366ddee7c1145?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt="First page"
                    className="object-contain shrink-0 aspect-square w-[20px]"
                />
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d608bf349997fb030adb23f9e5bcd549758567fd3f8d9eab934fe214b3d0971a?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt="Previous page"
                    className="object-contain shrink-0 aspect-square w-[20px]"
                />
            </div>
            <div className="flex gap-3.5 items-start self-stretch text-3xl text-black whitespace-nowrap">
                <button aria-current="page" className="sr-only">
                    Page 1
                </button>
                <div>1</div>
                <div className="self-stretch px-3 pb-4 rounded-full bg-neutral-200 h-[38px] w-[28px]">
                    2
                </div>
                <div>...</div>
            </div>
            <div className="flex mt-1.5">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ebd870cd7b0408d411056127dd70ef54c24ddc7bf1e3731ccfc188b310cdbc86?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt="Next page"
                    className="object-contain shrink-0 aspect-square w-[20px]"
                />
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/1fce205f1c9d4e0a5e7bf5ad163a4eb472f9342e91e7ed8d58eb64b696d4ae6b?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt="Last page"
                    className="object-contain shrink-0 aspect-square w-[20px]"
                />
            </div>
        </nav>
    );
}

function ManagerDrink() {
    return (
        <main className="flex overflow-hidden flex-col">
            <Header />
            <div className="pt-[40px]">
                <table class="w-full text-xl text-black">
                    <TableHeader />
                    {wineData.map((wine, index) => (
                        <WineItem
                            key={index}
                            {...wine}
                            bgColor={index % 2 === 0 ? "bg-white" : "bg-stone-50"}
                        />
                    ))}
                </table>
            </div>
            <Pagination />
        </main>
    );
}

export default ManagerDrink;