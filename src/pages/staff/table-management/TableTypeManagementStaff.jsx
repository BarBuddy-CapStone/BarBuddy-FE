import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TableTypeService from '../../../lib/service/tableTypeService';
import { CircularProgress } from '@mui/material';
import { Search, Info } from '@mui/icons-material';

const TableTypeManagementStaff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableTypes, setTableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchTableTypes();
  }, []);

  const fetchTableTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TableTypeService.getAllTableTypes();
      setTableTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching table types:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleSearchChange = (event) => setSearchInput(event.target.value);

  const filteredTableTypes = tableTypes.filter((tableType) =>
    tableType.typeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="overflow-hidden pt-2 pr-5 pl-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-6 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <BelowHeader 
            searchInput={searchInput} 
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
          />
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

const BelowHeader = ({ searchInput, onSearchChange, onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 sm:mb-0">Danh sách loại bàn</h2>
      <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm loại bàn..."
            value={searchInput}
            onChange={onSearchChange}
            className="w-full px-4 py-2 pr-10 border rounded-full"
          />
          <button
            onClick={onSearch}
            className="absolute right-0 top-0 mt-2 mr-3"
          >
            <Search className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

BelowHeader.propTypes = {
  searchInput: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
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

  const handleInfoClick = (event) => {
    event.stopPropagation();
    navigate(`/staff/table-management/table/${tableTypeId}`);
  };

  return (
    <div className="flex flex-col px-4 py-5 w-full rounded-xl bg-neutral-200 bg-opacity-50 shadow-md text-base">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-lg font-bold text-black">{typeName}</div>
        <Info 
          className="text-gray-600 cursor-pointer hover:text-gray-800" 
          onClick={handleInfoClick}
        />
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
  tableTypeId: PropTypes.string.isRequired,
};

export default TableTypeManagementStaff;
