import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOneDrink } from "src/lib/service/managerDrinksService";

const InfoItem = ({ data, emotion }) => {
    return (
        <Fragment>
            <li className="mt-4 first:mt-0">
                <span className="text-amber-400 text-base">Tên:</span> {data.drinkName}
            </li>
            <li className="mt-4 first:mt-0">
                <span className="text-amber-400 text-base">Giá tiền: </span> {data.price}
            </li>
            <li className="mt-4 first:mt-0">
                <span className="text-amber-400 text-base">Loại đồ uống:</span> {data.drinkCategoryResponse.drinksCategoryName}
            </li>
            <li className="mt-4 first:mt-0">
                <span className="text-amber-400 text-base">Danh mục cảm xúc: </span> {emotion}
            </li>
        </Fragment>
    );
}
const Divider = () => (
    <hr className="shrink-0 self-stretch mt-4 h-px border border-amber-400 border-solid max-md:max-w-full" />
);

const DescriptionSection = ({ description }) => (
    <section>
        <h2 className="flex gap-3 mt-2 text-xl leading-none text-amber-400">
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/56367a6b2efadde3f9fe223cd67f97ed292b2f09ef4f430c126d2aa3bb0f5dc1?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                alt=""
                className="object-contain shrink-0 my-auto aspect-[0.79] w-[15px]"
            />
            Mô tả
        </h2>
        <p className="self-center mt-3 text-sm leading-6 text-gray-200 max-md:max-w-full">
            {description}
        </p>
    </section>
);

const WarningText = () => (
    <footer className="mt-5">
        <p className="text-sm leading-none text-amber-400">
            Hình ảnh chỉ mang tính chất minh họa
        </p>
        <p className="mt-2 text-sm leading-none text-amber-400">
            Người dưới 18 tuổi không nên dùng rượu bia
        </p>
    </footer>
);

const DrinkDetail = () => {
    const location = useLocation();
    const redirect = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const drinkId = searchParams.get('drinkId');
    const [dataDrink, setDataDrink] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);



    useEffect(() => {
        const fetchDataDrink = async () => {
            try {
                const response = await getOneDrink(drinkId);
                setDataDrink(response.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDataDrink();
    }, [drinkId]);
    useEffect(() => {
        console.log(dataDrink)
    }, [dataDrink])

    const emotionCategories = dataDrink?.emotionsDrink.map(emotion => emotion.categoryName).join(", ");
    const imageUrls = dataDrink?.images?.split(",") || [];

    useEffect(() => {
        if (imageUrls?.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [imageUrls]);

    const backToBarHandle = () => {
        redirect(`/drinkList`)
    }
    return (
        <main className="mt-8 flex flex-col items-start w-[65%] ml-[16%] px-10 py-5 bg-neutral-800 max-md:px-3 rounded">
            <button
                onClick={backToBarHandle}
                className="flex gap-2 text-lg leading-snug text-gray-200">
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7589dfec3c5e8815509fa0df823b10cd2e0367ec1a8aae8e35a0ff51e9c48dcf?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
                    alt=""
                    className="object-contain shrink-0 my-auto w-7 aspect-square"
                />
                <span>Quay lại</span>
            </button>
            <Divider />
            <section className="mt-5 w-full max-w-[100%] max-md:max-w-full">
                <div className="flex gap-4 max-md:flex-col">
                    <div className="flex shrink-0 h-90 rounded-md border border-amber-400 border-solid w-[50%] max-md:mt-6">
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`Drink Image ${currentImageIndex + 1}`}
                            className="object-cover w-full h-full rounded-md"
                            style={{ height: '360px', width: '100%' }}
                        />
                    </div>
                    <div className="flex flex-col w-[35%] max-md:w-full">
                        <div className="flex flex-col">
                            <h2 className="self-start text-xl text-amber-400">Thông tin</h2>
                            <ul className="flex flex-col items-start pl-2.5 mt-4 text-sm leading-tight text-white">
                                {dataDrink && <InfoItem data={dataDrink} emotion={emotionCategories} />}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <Divider />
            <DescriptionSection description={dataDrink?.description} />
            <Divider />
            <WarningText />
        </main>
    );
}

export default DrinkDetail;