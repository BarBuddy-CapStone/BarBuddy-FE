import React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ open = false }) => {
  return (
    <Dialog
      open={Boolean(open)}
      aria-labelledby="loading-dialog-title"
      aria-describedby="loading-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: 'none',
          overflow: 'hidden'
        }
      }}
      role="dialog"
      disableEscapeKeyDown
      hideBackdrop={false}
    >
      <DialogContent>
        <div 
          className="flex flex-col items-center justify-center p-5"
          role="status"
          aria-busy="true"
        >
          <CircularProgress 
            style={{ color: '#FFA500' }} 
            aria-label="loading-progress"
            role="progressbar"
            size={40}
          />
          <Typography 
            id="loading-dialog-title"
            variant="h6" 
            component="h2"
            className="mt-5 text-white"
            aria-live="polite"
          >
            Đang tải...
          </Typography>
          <span id="loading-dialog-description" className="sr-only">
            Vui lòng đợi trong khi hệ thống đang xử lý
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

LoadingSpinner.propTypes = {
  open: PropTypes.bool
};

export default React.memo(LoadingSpinner);
