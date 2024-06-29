import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import balloonImage from '../asset/balloon.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: 'center',
        height: '120vh',
        backgroundColor: '#74B3FF',
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${balloonImage})`,
          backgroundRepeat: 'no-repeat',
          width: isSmallScreen ? '100%' : '50%',
          height: isSmallScreen ? '50vh' : '100%',
          backgroundPosition: isSmallScreen ? 'center' : 'left',
          backgroundSize: isSmallScreen ? 'contain' : 'cover', 
        }}
      />
      <Box
        sx={{
          width: isSmallScreen ? '100%' : '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            mb: 4,
            fontSize: '4rem',
            fontWeight: 'bold',
            textTransform: 'none',
            textAlign: 'center'
          }}
        >
          Welcome to EduSpace!
          Choose Your Role
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            mb: 3,
            backgroundColor: '#70CDE1', 
            borderRadius: '20px',
            height: '74px',
            width: '330px',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2DD9FD',
            },
          }}
          onClick={() => navigate('/login/student')}
        >
          Login as a Student
        </Button>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: '#FFBC6C', 
            borderRadius: '20px',
            height: '74px',
            width: '330px',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#FAA452',
            },
          }}
          onClick={() => navigate('/login/teacher')}
        >
          Login as a Teacher
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;