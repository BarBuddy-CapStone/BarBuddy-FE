import React, { Fragment, useState } from 'react';
import { getBarData } from '../../../lib/service/barManagerService';
import styles from './BarManagement.module.css';
import { ChevronRight } from '@mui/icons-material';
import { Pagination } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

function BarManagement() {
  const barData = getBarData();
  const redirect = useNavigate();
  const handleChevronClick = (index) => {
    redirect("/admin/barProfile")
  }

  const [search, setSearch] = useState('');
  const [listSearchBar, setListSearchBar] = useState(barData);


  const SearchBarHandler = () => {
    const result = barData?.filter((bar) =>
      bar?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setListSearchBar(result);
  };

  const AddBarHandle = () => {
    redirect("/admin/addbar")
  }

  return (
    <Fragment>
      <div className={styles.addBarContainer}>
        <input
          
          className={styles.search}
          type="text"
          placeholder='Search Bar Name'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <button onClick={SearchBarHandler}>
          <img loading="lazy" src="https://img.icons8.com/?size=100&id=132&format=png&color=F49B33" alt="Add icon" className={styles.icon} />
        </button>

        <button className={styles.addButton} onClick={AddBarHandle}>
          Thêm quán bar
        </button>
      </div>


      <div className={styles.table}>
        <div className="grid grid-cols-8 gap-3 items-center py-4 px-5 text-sm font-bold text-black bg-neutral-200">
          <div>Tên Quán</div>
          <div>Địa chỉ</div>
          <div>Email</div>
          <div>Số điện thoại</div>
          <div>Giờ mở cửa</div>
          <div>Giờ đóng cửa</div>
          <div>Trạng thái</div>
          <div></div>
        </div>
        {listSearchBar.map((bar, index) => (
          <div
            key={index}
            className={`grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm text-black`}
          >

            <div>{bar.name}</div>
            <div>
              <span>{bar.address}</span>
            </div>
            <div>
              <span>{bar.email}</span>
            </div>
            <div>{bar.phone}</div>
            <div>{bar.openTime}</div>
            <div>{bar.closeTime}</div>
            <div>
              {/* Conditional styling for status */}
              <span
                className={`flex justify-center items-center w-20 px-2 py-1 rounded-full text-white text-sm font-notoSansSC ${bar.status === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
              >
                {bar.status}
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
      </div>
    </Fragment>
  );
}

export default BarManagement;