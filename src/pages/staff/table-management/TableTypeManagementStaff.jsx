import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const TableTypeManagementStaff = () => {
    return (
      <main className="overflow-hidden pt-2 pr-6 bg-white max-md:pr-5">
        <div className="flex flex-col gap-5 max-md:flex-col">
          <div className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
            <Header />
            <div className="flex flex-col mt-5 mb-5 w-full max-md:mt-10 max-md:max-w-full gap-4 p-4">
              <TableTypeList />
            </div>
          </div>
        </div>
      </main>
    );
  };
  
  const Header = () => {
    return (
      <header className="flex flex-wrap gap-10 items-start max-md:max-w-full ml-5 mr-5 mt-5">
        <div className="flex flex-col flex-1 font-bold">
          <h1 className="text-4xl text-sky-900 max-md:mr-2.5">QUẢN LÝ BÀN</h1>
          <h2 className="mt-10 text-3xl text-gray-700">Danh sách loại bàn</h2>
        </div>
        <div className="flex flex-col flex-1 mt-1.5 items-end">
          <div className="flex gap-6 items-center">
            <div className="flex gap-2 items-center w-10">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c34835f58c1179a603170a4818c15626bcd875bc8fda99919b8ec07d2fa1753a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="User profile" className="object-contain w-10 shadow-sm aspect-square rounded-full" />
            </div>
            <div className="w-0 border border-solid bg-zinc-300 border-zinc-300 h-[30px]" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e19980153730dfe9760688834a12cb497b5d07d1a906fdcbc4c2084f9e6116f?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="Notifications" className="object-contain w-10 aspect-square" />
          </div>
        </div>
      </header>
    );
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
  
  const TableTypeList = () => {
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
  
  // TableTypeCard component
  const TableTypeCard = ({ title, price, capacity, description }) => {
    const navigate = useNavigate(); // Using useNavigate for navigation
  
    const handleCardClick = () => {
      // Navigate to the management page for this table type
      navigate(`/staff/table-management-detail`);
    };
  
    return (
      <div
        className="flex flex-col px-4 py-5 w-full rounded-xl bg-zinc-300 bg-opacity-50 shadow-md cursor-pointer"
        onClick={handleCardClick} // Click handler for navigating to a table management page
      >
        <div className="flex justify-between items-center w-full mb-4">
          <div className="text-2xl font-bold text-black">{title}</div>
        </div>
  
        {/* Adjusting icon and text alignment */}
        <div className="flex flex-col gap-2 w-full text-lg text-black">
          <div className="flex items-start gap-2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
              alt=""
              className="w-6 aspect-square mt-1"
            />
            <div className="flex-1">{price}</div>
          </div>
          <div className="flex items-start gap-2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
              alt=""
              className="w-6 aspect-square mt-1"
            />
            <div className="flex-1">{capacity}</div>
          </div>
          <div className="flex items-start gap-2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/18e31dd061c2c9a5014fa200f3d41a3af7c7be1a1c257c334215ffcda0d6a00c?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
              alt=""
              className="w-6 aspect-square mt-2"
            />
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