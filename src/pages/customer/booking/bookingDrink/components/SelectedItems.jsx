import React from "react";
import Button from '@mui/material/Button';
const SelectedItems = () => {
  return (
    <div className="flex flex-col px-8 py-5 mt-16 w-full rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] max-md:px-5 max-md:mt-10">
      <div className="self-center text-2xl font-bold text-center text-amber-400 text-opacity-90">
        Danh sách đã chọn
      </div>
      <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid" />
      <div className="flex gap-10 self-end mt-4 leading-none text-white">
        <div className="flex gap-1.5">
          <div className="grow my-auto text-xl font-bold text-right">
            1x
          </div>
          <div className="flex flex-col text-xs">
            <div>Champagne Alfred Gratie...</div>
            <div className="self-end mr-6 max-md:mr-2.5">x1</div>
          </div>
        </div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f128c4e54418e50e9a3a6c59973a868b3e90328a218d232da7e212dd8732b6d9?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain shrink-0 my-auto aspect-[0.92] w-[22px]" alt="Remove item" />
      </div>
      <div className="flex gap-9 self-end mt-4">
        <div className="flex gap-1.5 leading-none">
          <div className="flex flex-col my-auto text-xl font-bold text-right text-white whitespace-nowrap">
            <div>1x</div>
            <div className="mt-8">1x</div>
          </div>
          <div className="flex flex-col text-xs">
            <div className="text-white">Rượu Sâm Panh Champag...</div>
            <div className="flex gap-7 self-start">
              <div className="text-amber-400">5.808.000 VND</div>
              <div className="text-white">x1</div>
            </div>
            <div className="mt-4 text-white">
              Rượu Whisky Tamdhu 12 Y...
            </div>
            <div className="flex gap-7 self-start">
              <div className="text-amber-400">1.760.000 VND</div>
              <div className="text-white">x1</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-auto">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/361454550f698babe4c6580a6e1f99caa8569ae4fe297e5b491d1a970c4304b4?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain aspect-[0.92] w-[22px]" alt="Remove item" />
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0caab519ad0a33eba878a8d8fa563ff411626e1462ae58051b5039fb7bac7ed3?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain mt-6 aspect-[0.92] w-[22px]" alt="Remove item" />
        </div>
      </div>
      <div className="shrink-0 mt-52 h-px border border-amber-400 border-solid max-md:mt-10" />
      <div className="flex gap-10 mt-4 text-base text-white text-opacity-90">
        <div className="flex flex-col flex-1 items-start font-medium">
          <div>Tổng số tiền</div>
          <div className="self-stretch">Chiết khấu 10%</div>
          <div className="text-amber-400 text-opacity-90">
            Thành tiền
          </div>
        </div>
        <div className="flex flex-col flex-1 font-bold text-right">
          <div>9.371.000 VND</div>
          <div>- 937.100 VND</div>
          <div className="text-amber-400 text-opacity-90">
            8.433.900 VND
          </div>
        </div>
      </div>
      <button className="self-center py-2.5 pr-5 pl-6 mt-4 max-w-full text-base text-black bg-amber-400 rounded-md w-[132px] max-md:px-5">
        Thanh toán
      </button>
    </div>
  );
};

export default SelectedItems;