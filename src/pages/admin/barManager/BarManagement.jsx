import React from 'react';
import { getBarData } from '../../../lib/service/barManagerService';
import styles from './BarManagement.module.css';

function BarManagement() {
  const barData = getBarData();

  return (
    <div className={styles.container}>
      <div className={styles.addBarContainer}>
        
          <input className={styles.search}type="text" placeholder='Search Bar'/>
          <img loading="lazy" src="https://img.icons8.com/?size=100&id=132&format=png&color=F49B33" alt="Add icon" className={styles.icon} />
        <button className={styles.addButton}>
          Thêm quán bar
        </button>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerItem}>Tên Quán</div>
            <div className={styles.headerItem}>Địa chỉ</div>
            <div className={styles.headerItem}>Email</div>
            <div className={styles.headerItem}>Số điện thoại</div>
            <div className={styles.headerItem}>Giờ mở cửa</div>
            <div className={styles.headerItem}>Giờ đóng cửa</div>
            <div className={styles.headerItem}>Status</div>
          </div>
        </div>
        {barData.map((bar, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.rowContent}>
              <div className={styles.name}>{bar.name}</div>
              <div className={styles.address}>{bar.address}</div>
              <div className={styles.email}>{bar.email}</div>
              <div className={styles.phone}>{bar.phone}</div>
              <div className={styles.openTime}>{bar.openTime}</div>
              <div className={styles.closeTime}>{bar.closeTime}</div>
              <div className={styles.status}>
                <div className={styles.statusText}>{bar.status}</div>
                <img loading="lazy" src="https://img.icons8.com/?size=100&id=rn7VIIt8G470&format=png&color=000000" alt="Status icon" className={styles.statusIcon} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarManagement;