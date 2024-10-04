import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PaymentHeader = () => (
    <>
        <CheckCircleOutlineIcon className="text-[#0EAD69] self-center" sx={{ fontSize: 60 }}/>
        <h1 className="self-center mt-2 text-xl leading-none text-white">
            Thanh toán thành công
        </h1>
        <hr className="shrink-0 mt-4 w-full h-px border border-amber-400 border-solid" />
    </>
);

const CustomerInfo = () => (
    <>
        <div className="flex gap-4 self-center mt-4 max-w-full text-base w-[252px] text-white">
            <div className="grow font-bold">Bob Smith</div>
            <div className="grow shrink w-[125px]">+1 6546 654 542</div>
        </div>
        <hr className="shrink-0 mt-5 w-full h-px border border-amber-400 border-solid" />
    </>
);

const PaymentDetails = () => (
    <div className="flex flex-col mt-2 ml-3 max-w-full w-[299px] max-md:ml-2 text-white">
        <div className="flex gap-2 text-sm leading-none">
            <CalendarMonthIcon className="text-[#FCC434]" />
            <div className="flex-auto w-[263px]">23h30' - 17 December, 2024</div>
        </div>
        <div className="flex gap-1 self-start mt-3 text-sm">
            <TableBarIcon className="text-[#FCC434]" />
            <div className="basis-auto">1x Bàn tiêu chuẩn</div>
        </div>
    </div>
);

const TransactionInfo = () => {
    const transactionDetails = [
        { label: "Tổng số tiền", value: "8.433.900 VND" },
        { label: "Mã giao dịch", value: "da123dasda" },
        { label: "Nhà cung cấp", value: "VN Pay" },
        { label: "Phí thanh toán", value: "Miễn phí" },
        { label: "Chi nhánh", value: "Bar Buddy1" },
        { label: "Thời gian giao dịch", value: "22:29 -06/09/2024" },
    ];

    return (
        <>
            <hr className="shrink-0 mt-2 w-full h-0 border border-amber-400 border-solid" />
            <div className="flex flex-col mt-2 w-full text-sm min-h-[240px] max-md:max-w-full text-white">
                {transactionDetails.map((detail, index) => (
                    <div
                        key={index}
                        className="flex overflow-hidden gap-8 justify-between items-center px-3 py-1 mt-1 w-full leading-none min-h-[30px] max-md:max-w-full"
                    >
                        <div className="self-stretch my-auto">{detail.label}</div>
                        <div className="self-stretch my-auto">{detail.value}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

const BookingDetails = ({ isExpanded, toggleExpand }) => (
    <div className="flex justify-end"> {/* Thêm div để căn chỉnh nút */}
        <button
            className="w-1/3 py-2 bg-yellow-500 text-black font-italic rounded-lg shadow-md hover:bg-yellow-600 transition duration-200" // Giữ nguyên các thuộc tính của nút
            onClick={toggleExpand}
            aria-expanded={isExpanded}
        >
            <span className="self-stretch my-3">Chi tiết đặt chỗ <ArrowForwardIosIcon sx={{ fontSize: 12 }}/></span>
        </button>
    </div>
);

const PaymentDetail = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleBack = () => {
        navigate('/'); // Điều hướng về trang Home
    };

    return (
        <main className="flex flex-col items-center rounded-xl bg-inherit w-full max-md:px-3 max-md:max-w-full">
            <div className="flex flex-col w-full max-w-[400px] bg-neutral-800 max-md:max-w-full p-3 rounded-lg">
                <button 
                    className="mb-2 p-1 bg-inherit text-start text-white rounded" // Giảm margin-bottom
                    onClick={handleBack} // Gọi hàm handleBack khi nhấn nút
                >
                    <ArrowBackIcon className="mr-1" sx={{ fontSize: 15 }}/> {/* Giảm margin-right */}
                    Quay lại
                </button>
                <PaymentHeader />
                <CustomerInfo />
                <PaymentDetails />
                <TransactionInfo />
                <BookingDetails isExpanded={isExpanded} toggleExpand={toggleExpand} />
                {isExpanded && (
                    <div className="mt-2 text-base text-white"> {/* Giảm margin-top */}
                        Expanded booking details go here...
                    </div>
                )}
            </div>
        </main>
    );
};

export default PaymentDetail;