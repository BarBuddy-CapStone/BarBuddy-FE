import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close'; // Close icon for the dialog
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Success icon
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // Failure icon
import { paymentHistoryService } from 'src/lib';
import dayjs from 'dayjs';

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#FFBF00",
    },
    text: {
      primary: "#FFBF00",
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&.Mui-selected": {
            backgroundColor: "#FFBF00",
            color: "#000000",
          },
          "&:hover": {
            backgroundColor: "#FFBF00",
            color: "#000000",
          },
        },
      },
    },
  },
});

const PaymentHistory = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null); // Store selected payment for the dialog
  const [isDialogOpen, setDialogOpen] = useState(false); // Track dialog state
  const pageSize = 10;

  useEffect(() => {
    fetchPayments(currentPage, status);
  }, [currentPage, status]);

  const fetchPayments = async (pageIndex, status) => {
    try {
      const response = await paymentHistoryService.getAllPaymentsByCustomerId(accountId, status, pageIndex, pageSize);
      setPayments(response.data.response);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const formatDate = (date) => {
    return dayjs(date).format('HH:mm:ss DD/MM/YYYY');
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleOpenDialog = (payment) => {
    setSelectedPayment(payment); // Set the selected payment details
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    setSelectedPayment(null); // Clear selected payment
  };

  return (
    <section
      className="flex flex-col px-10 py-8 mx-auto w-full max-w-7xl rounded-md bg-neutral-800 shadow-md max-md:px-5 max-md:mt-10"
    >
      <div className="flex justify-between items-center mb-8 relative">
        <button
          className="text-amber-400 flex items-center space-x-2 absolute left-0"
          onClick={() => navigate(`/profile/${accountId}`)}
        >
          <ArrowBackIcon />
          <span>Quay lại</span>
        </button>

        <h2 className="text-3xl text-amber-400 text-center w-full">
          Lịch sử giao dịch
        </h2>
      </div>
      <div className="border-t border-amber-400 mb-6" />

      <TableContainer component={Paper} style={{ backgroundColor: '#3A3B3C', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid #FFBF00' }}>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>ID Đặt bàn</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Mã giao dịch</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Ngày thanh toán</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Tên quán</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Tổng tiền</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Tên nhà cung cấp</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}>Trạng thái</TableCell>
              <TableCell align="center" style={{ color: '#E5E7EB' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.bookingId} sx={{ borderBottom: '2px solid #FFBF00' }}>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{payment.bookingId}</TableCell>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{payment.transactionCode}</TableCell>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{formatDate(payment.paymentDate)}</TableCell>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{payment.barName}</TableCell>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{formatCurrency(payment.totalPrice)}</TableCell>
                <TableCell align="center" style={{ color: '#E5E7EB' }}>{payment.providerName}</TableCell>
                <TableCell align="center" style={{ color: payment.status ? '#4CAF50' : 'red' }}>
                  {payment.status ? 'Thành công' : 'Thất bại'}
                </TableCell>
                <TableCell align="center">
                  <ArrowForwardIosIcon
                    style={{ color: '#FFBF00', cursor: 'pointer' }}
                    onClick={() => handleOpenDialog(payment)} // Open dialog on icon click
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center mt-6">
        <ThemeProvider theme={customTheme}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </ThemeProvider>
      </div>

      {/* Dialog for showing payment details */}
      <Dialog
  open={isDialogOpen}
  onClose={handleCloseDialog}
  PaperProps={{
    style: { backgroundColor: '#27272a', color: '#FFFFFF', minWidth: '500px' }
  }}
>
  <DialogTitle style={{ textAlign: 'center', color: '#FFBF00' }}>
    Chi tiết thanh toán
    <IconButton
      aria-label="close"
      onClick={handleCloseDialog}
      style={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
    >
      <CloseIcon />
    </IconButton>
    <div className="border-t border-amber-400 mt-4" />
  </DialogTitle>

  {/* Render content only if selectedPayment exists */}
  {selectedPayment && (
    <DialogContent>
      {/* Status Section */}
      <div className="flex flex-col items-center">
        {selectedPayment.status ? (
          <CheckCircleOutlineIcon style={{ color: '#4CAF50', fontSize: '48px' }} />
        ) : (
          <CancelOutlinedIcon style={{ color: 'red', fontSize: '48px' }} />
        )}
        <div className="text-lg mt-2" style={{ color: selectedPayment.status ? '#4CAF50' : 'red' }}>
          {selectedPayment.status ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </div>
      </div>
      <div className="border-t border-amber-400 mt-4 mb-4" /> {/* Divider after status */}

      {/* Customer Information Section */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <div><strong>Tên khách hàng:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.customerName}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Số điện thoại:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.phoneNumber}</div>
        </div>
      </div>
      <div className="border-t border-amber-400 mt-4 mb-4" /> {/* Divider after customer info */}

      {/* Payment and Bar Details Section */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <div><strong>Tên quán:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.barName}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Nhà cung cấp:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.providerName}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Mã giao dịch:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.transactionCode}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Nội dung:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{selectedPayment.note}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Ngày thanh toán:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{formatDate(selectedPayment.paymentDate)}</div>
        </div>
        <div className="flex justify-between">
          <div><strong>Phí thanh toán:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>
            {selectedPayment.paymentFee === 0 ? 'Miễn phí' : formatCurrency(selectedPayment.paymentFee)}
          </div>
        </div>
        <div className="flex justify-between">
          <div><strong>Tổng tiền:</strong></div>
          <div style={{ textAlign: 'right', wordBreak: 'break-word' }}>{formatCurrency(selectedPayment.totalPrice)}</div>
        </div>
      </div>
    </DialogContent>
  )}
</Dialog>

    </section>
  );
};

export default PaymentHistory;
