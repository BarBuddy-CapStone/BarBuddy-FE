import React from "react";
import dayjs from "dayjs";

const BarDetail = ({ barInfo, selectedDate }) => {
  // Format ngày và thứ
  const formatDateAndDay = (date) => {
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const d = dayjs(date);
    const dayOfWeek = dayNames[d.day()];
    return `${dayOfWeek}, ${d.format('DD/MM/YYYY')}`;
  };

  return (
    <div className="flex flex-col px-7 py-8 w-full text-base text-gray-200 bg-neutral-800 min-h-[200px] rounded-md">
      <div className="text-2xl text-center text-amber-400">{barInfo.name}</div>
      <div className="flex gap-4 py-0.5 mt-6 max-w-full leading-5 w-[273px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0228e7e4f4b880d85456e740ce77e07b01935221b43ea7d4a50204a71213b242?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
          className="object-contain shrink-0 self-start w-5 aspect-square"
          alt="Location icon"
        />
        <div className="font-aBeeZee text-sm">{barInfo.location}</div>
      </div>
      
      {/* Thêm phần hiển thị ngày */}
      <div className="flex gap-4 py-px mt-6 max-w-full w-[230px] ">
        <img
          src="https://img.icons8.com/?size=100&id=7724&format=png&color=E6A30E"
          className="object-contain shrink-0 self-start w-4 aspect-square text-center items-center "
          alt="Calendar icon"
        />
        <div>
          <div className="text-gray-200">{formatDateAndDay(selectedDate)}</div>
        </div>
      </div>

      {/* Phần hiển thị giờ mở cửa */}
      <div className="flex gap-4 py-px mt-6 max-w-full w-[230px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad3b97f0675fad092006248fcf64e39091b67e081ff7d88be356302831c14d1f?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
          className="object-contain shrink-0 self-start w-5 aspect-square"
          alt="Clock icon"
        />
        <div className="flex flex-col">
          <span className="text-amber-400">Mở cửa - đóng cửa:</span>
          <span className={barInfo.openingHours === 'Quán đóng cửa' ? "text-red-500 mt-1" : "text-white mt-1"}>
            {barInfo.openingHours}
          </span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-300">
      <span className="text-amber-400 text-base">Mô tả:</span>
        <p>{barInfo.description}</p>
      </div>
    </div>
  );
};

export default BarDetail;