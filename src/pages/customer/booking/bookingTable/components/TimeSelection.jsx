import React, { useState } from 'react';
import { TextField, MenuItem, InputAdornment } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    paddingLeft: '0',
  },
  '& .MuiSvgIcon-root': {
    color: '#FFA500',
  },
  '& .MuiInputAdornment-root': {
    marginRight: '8px',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .Mui-focused .MuiInputLabel-root': {
    color: 'white',
  },
}));

// Custom styles for Menu and MenuItems
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  color: '#FFA500',
  '&.Mui-selected': {
    backgroundColor: '#333333', // Set background to black when selected
    color: '#FFA500',
  },
  '&.Mui-selected:hover': {
    backgroundColor: '#555555', // Slightly lighter black when hovering over selected item
  },
}));

const CustomTimeSelectionWrapper = styled('div')({
  '& .MuiPaper-root': {
    maxHeight: '200px', // Limit the dropdown menu height to show 5-6 items
    overflowY: 'auto',
    backgroundColor: '#000', // Change the background color of the dropdown to black
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: '#FFA500 transparent', // Scrollbar color for Firefox
  },
  '& .MuiPaper-root::-webkit-scrollbar': {
    width: '8px', // Scrollbar width for Chrome, Safari, and Edge
  },
  '& .MuiPaper-root::-webkit-scrollbar-thumb': {
    backgroundColor: '#FFA500', // Scrollbar color
    borderRadius: '4px',
  },
});

const TimeSelection = () => {
  const [selectedTime, setSelectedTime] = useState('23:30');

  // Create predefined time intervals every 30 minutes
  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
    '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <CustomTimeSelectionWrapper className="mt-4">
      <h3 className="text-lg leading-none mb-4 text-amber-400">Chọn thời gian</h3>
      <CustomTextField
        select
        value={selectedTime}
        onChange={handleTimeChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccessTimeIcon />
            </InputAdornment>
          ),
        }}
        sx={{ width: '200px' }} // Set a fixed width to match other input fields
      >
        {timeOptions.map((time) => (
          <CustomMenuItem key={time} value={time}>
            {time}
          </CustomMenuItem>
        ))}
      </CustomTextField>
    </CustomTimeSelectionWrapper>
  );
};

export default TimeSelection;
