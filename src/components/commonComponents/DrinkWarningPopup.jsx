import React from 'react';
import { Dialog, DialogContent, Button, Typography, Box } from '@mui/material';
import WarningDrink from 'src/assets/image/WarningDrink.png';
import { motion, AnimatePresence } from 'framer-motion';

const DrinkWarningPopup = ({ open, onClose }) => {
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
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#FFA500', 
                    mb: 3,
                    fontWeight: '500',
                    fontSize: '22px'
                  }}
                >
                  WELCOME TO BAR BUDDY
                </Typography>
                
                <Typography 
                  sx={{ 
                    mb: 2,
                    fontSize: '15px',
                    color: '#e4e6eb',
                    lineHeight: 1.5
                  }}
                >
                  Các sản phẩm của chúng tôi không dành cho người dưới 18 tuổi,
                  <br /> 
                  phụ nữ đang mang thai.
                </Typography>
                
                <Typography 
                  sx={{ 
                    mb: 3,
                    fontSize: '15px',
                    color: '#e4e6eb',
                    fontWeight: '500'
                  }}
                >
                  Thưởng thức có trách nhiệm!
                </Typography>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 3, 
                    mb: 3,
                    '& img': {
                      height: '130px',
                      filter: 'brightness(1.2)',
                      objectFit: 'contain',
                      width: 'auto'
                    }
                  }}
                >
                  <img 
                    src={WarningDrink} 
                    alt="Warning signs" 
                  />
                </Box>

                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{
                    bgcolor: '#FFA500',
                    color: 'black',
                    fontWeight: '500',
                    fontSize: '14px',
                    px: 3,
                    py: 0.8,
                    borderRadius: '4px',
                    '&:hover': {
                      bgcolor: '#FFB533'
                    },
                    width: 'auto',
                    minWidth: '100px'
                  }}
                >
                  ĐỒNG Ý
                </Button>
              </Box>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DrinkWarningPopup; 