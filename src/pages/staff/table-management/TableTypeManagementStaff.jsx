import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TableTypeService from '../../../lib/service/tableTypeService';
import { CircularProgress } from '@mui/material';

const TableTypeManagementStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableTypes, setTableTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTableTypes();
  }, []);

  const fetchTableTypes = async () => {
    setLoading(true); 
    try {
      const response = await TableTypeService.getAllTableTypes();
      setTableTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching table types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.typeName && tableType.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 pr-5 pl-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-6 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <BelowHeader searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <CircularProgress />
              </div>
            ) : filteredTableTypes.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-red-500 text-lg font-semibold">Không có loại bàn</p>
              </div>
            ) : (
              <TableTypeList tableTypes={filteredTableTypes} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const BelowHeader = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center justify-between ml-4 mr-4 mt-6">
      <h2 className="text-2xl font-bold text-gray-700">Danh sách loại bàn</h2>
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
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

const TableTypeList = ({ tableTypes }) => {
  return (
    <section className="mt-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tableTypes.map((tableType, index) => (
          <TableTypeCard key={index} {...tableType} tableTypeId={tableType.tableTypeId} /> 
        ))}
      </div>
    </section>
  );
};

TableTypeList.propTypes = {
  tableTypes: PropTypes.array.isRequired,
};

const TableTypeCard = ({ typeName, minimumPrice, minimumGuest, maximumGuest, description, tableTypeId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/staff/table-management/table/${tableTypeId}`);
  };

  return (
    <div
      className="flex flex-col px-4 py-5 w-full rounded-xl bg-zinc-300 bg-opacity-50 shadow-md text-base cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{typeName}</div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5377f3ad8c7e9f464a7b83d0badafbdc63b800e2c9912f7d739f82f486467dae?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">{minimumPrice.toLocaleString('vi-VN')} VND</div>
        </div>
        <div className="flex items-start gap-2">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/265c27df449947fbe31739e1fcb54efde1a9cf4f8b29899836bcb18544aa791a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-5 aspect-square mt-1" />
          <div className="flex-1">Phù hợp cho {minimumGuest} - {maximumGuest} khách hàng</div>
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
  typeName: PropTypes.string.isRequired,
  minimumPrice: PropTypes.number.isRequired,
  minimumGuest: PropTypes.number.isRequired,
  maximumGuest: PropTypes.number.isRequired,
  description: PropTypes.string,
};

export default TableTypeManagementStaff;
