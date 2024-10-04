import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

const CustomerPaymentHistory = () => {
  // Sample data (replace with actual data)
  const rows = [
    { id: 1, transactionId: 'da123dasda', date: '06/09/2024', amount: '6.080.000VND', description: '1', branch: 'Bar Buddy 1', status: 'Success' },
    { id: 2, transactionId: 'da123dasda', date: '06/09/2024', amount: '6.080.000VND', description: '1', branch: 'Bar Buddy 1', status: 'Success' },
    { id: 3, transactionId: 'da123dasda', date: '06/09/2024', amount: '6.080.000VND', description: '1', branch: 'Bar Buddy 1', status: 'Cancel' },
    { id: 4, transactionId: 'da123dasda', date: '06/09/2024', amount: '6.080.000VND', description: '1', branch: 'Bar Buddy 1', status: 'Success' },
    // Add more rows as needed...
  ];

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="mx-16 my-8">
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} variant="outlined" color="secondary" style={{ marginBottom: '20px' }}>
        Quay Lại
      </Button>

      {/* Table */}
      <TableContainer component={Paper} style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Table aria-label="Customer Payment History">
          <TableHead>
            <TableRow>
              <TableCell>Mã giao dịch</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Nội dung giao dịch</TableCell>
              <TableCell>Chi nhánh</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.transactionId}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.branch}</TableCell>
                <TableCell style={{ color: row.status === 'Cancel' ? 'red' : 'green' }}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
      />
    </div>
  );
};

export default CustomerPaymentHistory;
