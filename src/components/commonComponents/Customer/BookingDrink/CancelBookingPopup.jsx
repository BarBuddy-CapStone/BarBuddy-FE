import React from 'react';
import { Dialog, DialogContent, Button, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const CancelBookingPopup = ({ open, onClose, onConfirm, isLoading }) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: '#242526',
              borderRadius: '12px',
              padding: '0',
              overflow: 'hidden'
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{
                textAlign: 'center',
                color: 'white',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}>
                <Typography variant="h6" sx={{ color: '#e4e6eb' }}>
                  Bạn có chắc chắn muốn hủy đơn đặt bàn này?
                </Typography>

                <Typography sx={{ color: '#e4e6eb', fontSize: '14px' }}>
                  Thao tác này không thể hoàn tác
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={isLoading}
                    sx={{
                      color: '#e4e6eb',
                      borderColor: '#e4e6eb',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#dc2626',
                      '&:hover': {
                        bgcolor: '#b91c1c'
                      }
                    }}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CancelBookingPopup; 