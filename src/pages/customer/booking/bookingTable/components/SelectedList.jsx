import React from "react";

const SelectedList = ({ selectedTables, onRemove }) => {
  return (
    <div className={`flex flex-col px-8 pt-4 pb-10 mt-4 w-full text-xs text-white rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] ${selectedTables.length === 0 ? 'hidden' : ''}`}>
      <div className="self-center text-xl font-bold text-center text-amber-400 text-opacity-90">
        Danh sách đã chọn
      </div>
      <div className="shrink-0 self-stretch mt-4 h-px border border-amber-400 border-solid" />
      {selectedTables.map((table) => (
        <div key={table} className="flex gap-5 justify-between mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
          <div className="my-auto text-sm font-notoSansSC">{table}</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/60b2292fdddb88def1d62fba646def558e1bd6c427bf27025633c14ac4a99ae3?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            className="object-contain shrink-0 w-6 aspect-square cursor-pointer"
            alt="Remove icon"
            onClick={() => onRemove(table)}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedList;
