import React from 'react';

function PaymentDetails() {
  return (
    <section className="flex flex-col px-4 py-2 mt-5 w-full rounded-md text-lg bg-neutral-800 max-md:px-2 max-md:mt-6 max-md:max-w-full">
      <h2 className="self-start text-xl leading-snug text-amber-400">
        Chi tiết thanh toán
      </h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
      <div className="flex flex-col mt-2 w-full bg-neutral-800 text-white text-sm text-opacity-90 max-md:max-w-full">
        <PaymentRow label="Phí đặt chỗ" value="Miễn phí" />
        <PaymentRow label="Tổng giá tiền thức uống" value="9.371.000 VND" />
        <PaymentRow label="Chiết khấu 10%" value="- 937.100 VND" />
      </div>
      <hr className="shrink-0 mt-5 h-px border border-amber-400 border-solid max-md:mt-4 max-md:max-w-full" />
      <PaymentRow label="Thành tiền" value="8.433.900 VND" isTotal={true} />
      <button className="self-end px-px py-2 my-4 text-lg font-semibold leading-none text-center text-black bg-amber-400 rounded-md min-h-[40px] w-[180px] max-md:mt-4">
        Thanh toán
      </button>
    </section>
  );
}

function PaymentRow({ label, value, isTotal = false }) {
  const rowClasses = isTotal
    ? "flex flex-wrap items-center mt-2 min-h-[40px] text-amber-400 text-opacity-90"
    : "flex relative items-start w-full min-h-[36px] max-md:max-w-full";
  const labelClasses = isTotal
    ? "grow shrink self-stretch my-auto font-medium w-[150px]"
    : "z-0 my-auto font-medium w-[200px]";
  const valueClasses = isTotal
    ? "grow shrink self-stretch my-auto font-bold text-right w-[500px] max-md:max-w-full"
    : "absolute right-0 z-0 self-start h-6 font-bold text-right bottom-[4px] w-[500px] max-md:max-w-full";

  return (
    <div className={rowClasses}>
      <div className={labelClasses}>{label}</div>
      <div className={valueClasses}>{value}</div>
    </div>
  );
}

export default PaymentDetails;