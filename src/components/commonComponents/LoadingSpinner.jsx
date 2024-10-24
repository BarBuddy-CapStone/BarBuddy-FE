import React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ open }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: 'none',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress style={{ color: '#FFA500' }} />
          <Typography variant="h6" style={{ color: 'white', marginTop: '20px' }}>
            Đang tải...
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingSpinner;
