import React from "react";
import { Pagination } from "@mui/material"; // Import MUI Pagination
import ChevronRight from "@mui/icons-material/ChevronRight"; // Correct import
import { useNavigate } from "react-router-dom"; // For navigation
import Star from "@mui/icons-material/Star"; // Import filled star icon
import StarOutline from "@mui/icons-material/StarOutline"; // Import empty star icon

const tableData = [
  {
    rating: 1,
    content: "Content",
    createdDate: { date: "Aug 18 2021", time: "15:20:56" },
    editedDate: { date: "Aug 18 2021", time: "15:20:56" },
    user: "User 1",
    branch: "Bar Buddy1",
    status: "Inactive",
    bgColor: "bg-white",
  },
  {
    rating: 5,
    content: "Content",
    createdDate: { date: "Aug 18 2021", time: "15:20:56" },
    editedDate: { date: "Aug 18 2021", time: "15:20:56" },
    user: "User 2",
    branch: "Bar Buddy1",
    status: "Active",
    bgColor: "bg-stone-50",
  },
  {
    rating: 4,
    content: "Content",
    createdDate: { date: "Aug 18 2021", time: "15:20:56" },
    editedDate: { date: "Aug 18 2021", time: "15:20:56" },
    user: "User 3",
    branch: "Bar Buddy1",
    status: "Active",
    bgColor: "bg-white",
  },
  {
    rating: 1,
    content: "Content",
    createdDate: { date: "Aug 18 2021", time: "15:20:56" },
    editedDate: { date: "Aug 18 2021", time: "15:20:56" },
    user: "User 4",
    branch: "Bar Buddy1",
    status: "Inactive",
    bgColor: "bg-stone-50",
  },
];

function Feedback() {
  const navigate = useNavigate();

  // const handleAddNew = () => {
  //   navigate("#"); // Navigate to the add new page
  // };

  const handleChevronClick = (index) => {
    navigate(`/admin/feedbackdetail`); // Navigate to feedback detail page with row ID
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="text-yellow-500" />); // Filled star
      } else {
        stars.push(<StarOutline key={i} className="text-yellow-500" />); // Empty star
      }
    }

    return stars;
  };

  return (
    <div>
      {/* Filter and Add New Buttons */}
      <div className="flex justify-end gap-4 mt-4 mb-6 text-base text-black">
        {/* Filter Dropdown with Subtle Click Effect */}
        <div className="relative">
          <select className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none">
            <option>Filter by ALL</option>
            <option>Filter by Active</option>
            <option>Filter by Inactive</option>
          </select>
        </div>
        {/* Add New Button đang comment lại việc cho tạo feedback */}
        {/* <button
          onClick={handleAddNew}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm transition-all duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
        >
          Add New
        </button> */}
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-8 gap-3 items-center py-4 px-10 text-sm font-bold text-black bg-neutral-200">
        <div>Điểm</div>
        <div>Nội dung</div>
        <div>Ngày tạo</div>
        <div>Ngày chỉnh sửa</div>
        <div>Bởi</div>
        <div>Chi nhánh</div>
        <div>Trạng thái</div>
        <div></div> {/* Placeholder for ChevronRight Icon */}
      </div>

      {/* Table Data */}
      {tableData.map((row, index) => (
        <div
          key={index}
          className={`grid grid-cols-8 gap-3 py-3 px-10 items-center text-sm text-black ${row.bgColor}`}
        >
          <div className="flex items-center">
            {renderStars(row.rating)} {/* Render star rating */}
          </div>
          <div>{row.content}</div>
          <div>
            <span>{row.createdDate.date}</span>
            <br />
            <span>{row.createdDate.time}</span>
          </div>
          <div>
            <span>{row.editedDate.date}</span>
            <br />
            <span>{row.editedDate.time}</span>
          </div>
          <div>{row.user}</div>
          <div>{row.branch}</div>
          <div>
            {/* Conditional styling for status */}
            <span
              className={`flex justify-center items-center w-20 px-2 py-1 rounded-full text-white text-sm font-notoSansSC ${
                row.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {row.status}
            </span>
          </div>
          {/* ChevronRight Icon for navigating */}
          <div
            className="justify-self-end cursor-pointer"
            onClick={() => handleChevronClick(index)}
          >
            <ChevronRight />
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination count={5} size="small" shape="rounded" />
      </div>
    </div>
  );
}

export default Feedback;
