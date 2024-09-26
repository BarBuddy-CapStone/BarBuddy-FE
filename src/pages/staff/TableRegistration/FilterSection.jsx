import React from "react";

function FilterInput({ label, width }) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl" style={{ minWidth: "200px", width }}>
      <label className="self-start">{label}</label>
      <input
        className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ width: "100%" }}
      />
    </div>
  );
}

function DatePicker({ label }) {
  return (
    <div className="flex gap-5 items-start self-stretch my-auto rounded-md min-w-[240px] w-[324px]">
      <label className="grow leading-loose text-zinc-800">{label}</label>
      <div className="flex gap-4 justify-center items-center px-4 py-2.5 bg-white rounded-md border-2 border-solid border-neutral-200 text-zinc-800 shadow-md">
        <input
          type="date" // Thay đổi loại input thành date
          className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}

function TimePicker({ label }) {
  return (
    <div className="flex gap-5 items-start self-stretch my-auto rounded-md min-w-[240px] w-[347px]">
      <label className="leading-loose basis-auto text-zinc-800">{label}</label>
      <div className="flex gap-4 justify-center items-center px-4 py-2.5 whitespace-nowrap bg-white rounded-md border-2 border-solid border-neutral-200 text-zinc-800 shadow-md">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/022ef8888e087b6d8dc88420c7e21121609ddcbdad30992fce51eb70e563d927?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[25px]"
          alt=""
        />
        <span className="self-stretch my-auto">11:PM</span>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd51fce0e88f2b1a79d30b8bce530411e7cff32f3c94e50c97e9c7724d9ada82?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b"
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[0.95]"
          alt=""
        />
      </div>
    </div>
  );
}

function StatusFilter({ label }) {
  return (
    <div className="flex gap-5 items-start self-stretch my-auto rounded-md w-[202px]">
      <label className="grow leading-loose text-zinc-800">{label}</label>
      <div className="flex gap-4 justify-center items-center px-4 py-2.5 whitespace-nowrap bg-white rounded-md border-2 border-solid border-neutral-200 text-zinc-800 shadow-md">
        <span className="self-stretch my-auto">All</span>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/894ddd456352d4b8d89fb245b015bf4d1bf603e27213b5055fa2acb1f160b235?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b"
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          alt=""
        />
      </div>
    </div>
  );
}

function FilterSection() {
  return (
    <>
      <div className="flex flex-wrap gap-10 items-end font-bold leading-loose text-zinc-800 max-md:max-w-full">
        <div className="flex gap-5">
          <FilterInput label="Họ tên:" width="376px" />
          <FilterInput label="Số điện thoại:" width="364px" />
          <FilterInput label="Email:" width="365px" />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 justify-between mt-9 w-full max-md:mr-1 max-md:max-w-full">
        <div className="flex gap-5 items-center font-bold max-md:max-w-full">
          <DatePicker label="Ngày đặt bàn:" />
          <TimePicker label="Thời gian check-in:" />
          <StatusFilter label="Trạng thái:" />
        </div>
        <button className="overflow-hidden self-start px-12 italic text-center text-white whitespace-nowrap bg-blue-600 hover:bg-blue-700 transition duration-300 min-h-[45px] rounded-[50px] max-md:px-5">
          Xem
        </button>
      </div>
    </>
  );
}

export default FilterSection;

