import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TableTypeManagementStaff = () => {
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term state
  };

  // Filter table types based on search term
  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 pr-5 pl-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-6 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <BelowHeader onSearchChange={handleSearchChange} />
          <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
            <TableTypeList tableTypes={filteredTableTypes} />
          </div>
        </div>
      </div>
    </main>
  );
};

const BelowHeader = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center justify-between ml-4 mr-4 mt-6">
      {/* Left side: "Danh sách loại bàn" */}
      <h2 className="text-2xl font-bold text-gray-700">Danh sách loại bàn</h2>
      
      {/* Right side: Search bar */}
      <input
        type="text"
        placeholder="Tìm kiếm loại bàn..."
        value={searchTerm}
        onChange={onSearchChange}
        className="px-4 py-2 border rounded-full w-1/6"
      />
    </div>
  );
};

BelowHeader.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
};

// TableTypeList component
const tableTypes = [
  {
    title: "Bàn SVIP",
    price: "Từ 10.000.000 VND",
    capacity: "1 - 20 Khách hàng",
    description: "Bàn SVIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao nhất tại quán, phù hợp cho nhóm khách hàng từ 1-20 người, mức giá tối thiểu chỉ từ 20.000.000 VND.",
  },
  {
    title: "Bàn VIP",
    price: "Từ 5.000.000 VND",
    capacity: "1 - 15 Khách hàng",
    description: "Bàn VIP phù hợp cho khách hàng muốn trải nghiệm dịch vụ chất lượng cao tại quán, phù hợp cho nhóm khách hàng từ 1-15 người, mức giá tối thiểu chỉ từ 10.000.000 VND.",
  },
  {
    title: "Bàn Tiêu chuẩn 1",
    price: "Từ 600.000 VND",
    capacity: "2 - 4 Khách hàng",
    description: "Bàn Tiêu chuẩn 1 phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán, phù hợp cho nhóm khách hàng từ 1-4 người, mức giá tối thiểu chỉ từ 600.000 VND.",
  },
  {
    title: "Bàn Quầy Bar",
    price: "Từ 150.000 VND",
    capacity: "1 Khách hàng",
    description: "Bàn Quầy Bar phù hợp cho khách hàng muốn trải nghiệm dịch vụ tiêu chuẩn tại quán và được phụ vụ trực tiếp bởi các Bartender, mức giá tối thiểu chỉ từ 300.000 VND.",
  }
];

const TableTypeList = ({ tableTypes }) => {
  return (
    <section className="mt-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tableTypes.map((tableType, index) => (
          <TableTypeCard key={index} {...tableType} />
        ))}
      </div>
    </section>
  );
};

TableTypeList.propTypes = {
  tableTypes: PropTypes.array.isRequired,
};

// TableTypeCard component
const TableTypeCard = ({ title, price, capacity, description }) => {
  const navigate = useNavigate();

  // Navigate to the table type detail page
  const handleCardClick = () => {
    // navigate(`/table-type-detail/${encodeURIComponent(title)}`);
    navigate(`/staff/table-management/table-list`);
  };

  return (
    <div
      className="flex flex-col px-4 py-5 w-full rounded-xl bg-zinc-300 bg-opacity-50 shadow-md text-base cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{title}</div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{price}</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{capacity}</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/18e31dd061c2c9a5014fa200f3d41a3af7c7be1a1c257c334215ffcda0d6a00c?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{description}</div>
        </div>
      </div>
    </div>
  );
};

TableTypeCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  capacity: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default TableTypeManagementStaff;
