import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs"; // Import dayjs for date formatting

const BookingDrinkInfo = ({
  barInfo,
  selectedTables,
  customerInfo,
  userInfo,
  onBackClick
}) => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  const handleShowAllTables = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Function to format date and time
  const formatDateTime = (dateString, timeString) => {
    const date = dayjs(dateString).format('YYYY-MM-DD');
    let time = 'Invalid Time';
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      const decimalHours = parseInt(hours) + (parseInt(minutes) / 60);
      time = decimalHours.toFixed(1); // This will give you time in format like 17.5
      time = `${hours}:${minutes}`; // This will give you time in format like 17:30
    }
    return { date, time };
  };

  return (
    <section className="flex flex-col px-4 py-4 mt-4 lg:mt-8 w-full text-lg bg-neutral-800 rounded-lg">
      <div
        className="flex items-center gap-1.5 self-start ml-0 pl-2 cursor-pointer"
        onClick={onBackClick}
      >
        <ChevronLeftIcon className="object-contain w-6 h-6 text-gray-200" />
        <div className="text-gray-200">Quay lại</div>
      </div>
      <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid" />
      <h2 className="self-start mt-4 text-xl text-amber-400 font-aBeeZee">
        Thông tin đặt bàn
      </h2>
      <div className="shrink-0 mt-2 w-full border border-amber-400 border-solid " />

      <div className="grid grid-cols-2 gap-4 mt-4 w-full leading-none text-gray-200">
        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0bbb1de5227b6b21985f3b5205d68a58e50531742f51b7023d4afeccce347ebf?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-square"
          />
          <div className="ml-2 font-sans font-thin">
            {barInfo?.location || "Địa chỉ không có sẵn"}
          </div>
        </div>

        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/65cd4841430915f8c1809b9b6a1c43346049b020cbac42cd41df6381500fb884?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-[1.07]"
          />
          <div className="ml-2 font-sans font-thin">
            {customerInfo?.name || userInfo?.fullname || "Tên không có sẵn"}
          </div>
        </div>

        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ce8f43ee5abc902d14d1fc7cceff8191e4fa1a169cdc50039dccd3c1fe4e7772?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-square"
          />
          <div className="ml-2 font-sans font-thin">
            {barInfo?.name || "Tên quán bar không có sẵn"}
          </div>
        </div>

        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/607be5f2c5bfb0e0fce8a5614e7a05f231cc2058e87bc8b04dfaae6bf73362d6?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-[1.12]"
          />
          <div className="ml-2 font-sans font-thin">
            {customerInfo?.phone ||
              userInfo?.phone ||
              "Số điện thoại không có sẵn"}
          </div>
        </div>

        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/32644f199f8931183473cf7029045e1f251cb00cdf18bce109523a86520b6b64?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-square"
          />
          <div className="ml-2 font-sans font-thin">
            {barInfo?.openingHours || "Thời gian không có sẵn"}
          </div>
        </div>

        <div className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e54839f6193a7d95285c7799ce8c9d20aab0041eb713b56d1b508bc411f4c5fa?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="object-contain shrink-0 w-5 aspect-square"
          />
          <div className="ml-2 font-sans font-thin">{customerInfo?.note || "Không có ghi chú"}</div>
        </div>
      </div>

      <button
        onClick={handleShowAllTables}
        className="mt-4 text-amber-400 hover:text-amber-500"
      >
        Xem tất cả bàn đã đặt
      </button>

      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        PaperProps={{
          style: {
            backgroundColor: "#333",
            color: "white",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle style={{ color: "#FFA500", textAlign: "center" }}>
          Danh sách bàn đã đặt
        </DialogTitle>
        <DialogContent>
          {selectedTables?.map((table, index) => {
            const { date, time } = formatDateTime(table.date, table.time);
            return (
              <div key={table.tableId} className="text-white mb-2">
                {index + 1}. Bàn {table.tableName}: 
                <span className="ml-2">Ngày: {date}</span>
                <span className="ml-2">Giờ: {time}</span>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePopup}
            style={{
              color: "black",
              backgroundColor: "#FFA500",
              borderRadius: "4px",
              padding: "6px 16px",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default BookingDrinkInfo;
