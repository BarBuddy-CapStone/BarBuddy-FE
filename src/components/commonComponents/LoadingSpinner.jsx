import React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ open }) => {
  const isOpen = Boolean(open);

  return (
    <Dialog
      open={isOpen}
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

LoadingSpinner.propTypes = {
  open: PropTypes.bool
};

LoadingSpinner.defaultProps = {
  open: false
};

export default LoadingSpinner;
