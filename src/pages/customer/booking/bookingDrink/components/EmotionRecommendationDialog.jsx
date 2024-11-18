import React, { memo } from 'react';
import { Dialog, DialogContent, Typography, Button, CircularProgress } from '@mui/material';

const EmotionRecommendationDialog = memo(({
  showDialog,
  onClose,
  emotionText,
  onEmotionTextChange,
  errorMessage,
  isLoading,
  onSubmit
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={showDialog} 
      onClose={handleClose}
      PaperProps={{
        style: { 
          backgroundColor: '#333',
          color: 'white',
          minWidth: '400px',
          padding: '20px'
        }
      }}
    >
      <DialogContent>
        <div className="flex flex-col items-center gap-4">
          <Typography variant="h6" style={{ color: '#FFA500', marginBottom: '10px', textAlign: 'center' }}>
            Bạn đang cảm thấy thế nào?
          </Typography>
          
          <div className="w-full">
            <textarea
              value={emotionText}
              onChange={(e) => onEmotionTextChange(e.target.value)}
              placeholder="Ví dụ: Tôi đang cảm thấy buồn và cô đơn..."
              className="w-full p-3 rounded-lg bg-neutral-700 text-white border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              rows={4}
              style={{ resize: 'none' }}
            />
            {errorMessage && (
              <Typography 
                variant="caption" 
                style={{ color: '#ff6b6b', marginTop: '5px', display: 'block' }}
              >
                {errorMessage}
              </Typography>
            )}
          </div>

          <div className="flex gap-4 mt-4 w-full justify-end">
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                color: '#FFA500',
                borderColor: '#FFA500',
                '&:hover': {
                  borderColor: '#FFB533',
                  backgroundColor: 'rgba(255, 165, 0, 0.1)',
                },
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: 'rgb(245, 158, 11)',
                '&:hover': { backgroundColor: 'rgb(251, 191, 36)' },
                '&:disabled': { backgroundColor: 'rgb(245, 158, 11, 0.5)' },
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <span>Đang tìm...</span>
                </div>
              ) : (
                'Tìm đồ uống'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

EmotionRecommendationDialog.displayName = 'EmotionRecommendationDialog';

export default EmotionRecommendationDialog; 