import React from "react";

const FilterOption = ({ label }) => (
  <div className="flex overflow-hidden gap-6 items-start py-0.5 bg-neutral-700">
    <div className="flex shrink-0 rounded-full bg-zinc-300 h-[20px] w-[20px]" />
    <div>{label}</div>
  </div>
);

const Filter = () => {
  return (
    <div className="flex flex-col px-3 lg:px-8 py-4 w-full text-amber-400 rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] mt-6"> {/* Added mt-6 */}
      <h2 className="self-center text-2xl font-bold text-center text-gray-200 text-opacity-90">
        Bộ lọc
      </h2>
      <div className="shrink-0 mt-4 max-w-full h-px border border-amber-400 border-solid w-full" />
      <h3 className="self-start mt-4 text-xl leading-none">Danh mục thức uống</h3>
      <div className="flex flex-col justify-center px-1.5 py-3 mt-5 text-sm leading-none text-white rounded-xl bg-neutral-700">
        <div className="flex overflow-hidden flex-col items-start pr-12 w-full bg-neutral-700">
          <FilterOption label="Rượu" />
          <FilterOption label="Cocktail" />
          <FilterOption label="Trà sữa" />
          <FilterOption label="Nước ngọt" />
        </div>
      </div>
      <h3 className="self-start mt-5 text-xl leading-none">Cảm xúc</h3>
      <div className="flex flex-col justify-center px-1.5 py-3 mt-5 text-sm leading-none text-white rounded-xl bg-neutral-700">
        <div className="flex overflow-hidden flex-col items-start pr-12 w-full bg-neutral-700">
          <FilterOption label="Vui" />
          <FilterOption label="Buồn" />
          <FilterOption label="Phấn khích" />
          <FilterOption label="Bực bội" />
        </div>
      </div>
      <h3 className="self-start mt-5 text-xl leading-none">Mức giá</h3>
      <div className="flex gap-1 px-1.5 py-3 mt-6 leading-none text-white whitespace-nowrap rounded-xl bg-neutral-700">
        <div className="flex items-center text-sm">
          <div className="grow self-stretch">0</div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6363a9e2a7fefcd8bfdf8d0b51819b9ac71157146783f560ad464b767ecb225f?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[100] w-[100px]" alt="Price range slider" />
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbfa7fce2dd35cc1d2b3a4c330f3f63675f7cc08241b102cc3f5fbf72a9d8946?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain shrink-0 self-stretch my-auto w-1.5 aspect-square" alt="Price range indicator" />
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2f65328232fafaa0dbc5ca31e883d86500ddc457e12f60fae836be1eab0a532?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6" className="object-contain shrink-0 self-stretch my-auto w-28 max-w-full aspect-[111.11]" alt="Price range slider end" />
        </div>
        <div className="text-xs">50+</div>
      </div>
      <div className="self-center mt-2 text-xs leading-none text-white">
        Giá tiền từ 0 đến 10
      </div>
      <div className="self-center text-xs leading-none">
        * Giá trị 1 là tương đương đến 1 triệu VND
      </div>
    </div>
  );
};

export default Filter;
