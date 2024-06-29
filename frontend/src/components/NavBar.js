import BookIcon from '@mui/icons-material/Book';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../asset/Group.png';

const NavBar = (props) => {
  const { active, tabbedCourses } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logout = async () => {
    try {
      await axios.get('/logout', {
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  const handleCoursePageClick = () => {
    if (tabbedCourses.length === 0) {
      navigate('/course');
    } else {
      navigate(`/course/${tabbedCourses[0]}/tutorials`);
    }
  };

  return (
    <>
      {!isTabletOrMobile && (
        <Box
          sx={{
            width: '6rem',
            height: '100vh',
            bgcolor: '#343434',
            py: '3rem',
            px: '1.5rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            position: 'fixed',
            zIndex: '1',
          }}
        >
          <img src={logo} alt='Logo' className='object-contain' />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Stack alignItems='center' paddingTop={'2rem'} spacing={1}>
              <Tooltip
                title='Dashboard'
                placement='right'
                arrow
                fontSize={'3rem'}
              >
                <Button
                  variant='text'
                  onClick={() => {
                    navigate('/courses/all');
                  }}
                >
                  {active === 'dashboard' && (
                    <>
                      <Box
                        sx={{
                          width: '0.5rem',
                          position: 'fixed',
                          bgcolor: '#5AC2D9',
                          height: '3rem',
                          left: 0,
                          borderRadius: '1rem',
                        }}
                      />
                      <SchoolIcon
                        fontSize={'large'}
                        sx={{ color: '#5AC2D9' }}
                      />
                    </>
                  )}
                  {active !== 'dashboard' && (
                    <SchoolOutlinedIcon
                      fontSize={'large'}
                      sx={{ color: '#5AC2D9' }}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip title='Course Page' placement='right' arrow>
                <Button variant='text' onClick={handleCoursePageClick}>
                  {props.active === 'course' && (
                    <>
                      <Box
                        sx={{
                          width: '0.5rem',
                          position: 'fixed',
                          bgcolor: '#5AC2D9',
                          height: '3rem',
                          left: 0,
                          borderRadius: '1rem',
                        }}
                      />
                      <BookIcon fontSize={'large'} sx={{ color: '#5AC2D9' }} />
                    </>
                  )}
                  {active !== 'course' && (
                    <BookOutlinedIcon
                      fontSize={'large'}
                      sx={{ color: '#5AC2D9' }}
                    />
                  )}
                </Button>
              </Tooltip>
            </Stack>
            <Stack alignItems='center' paddingTop={'2rem'} spacing={1}>
              <Tooltip title='Logout' placement='right' arrow fontSize={'3rem'}>
                <Button
                  variant='text'
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogoutOutlinedIcon
                    fontSize={'large'}
                    sx={{ color: '#5AC2D9' }}
                  />
                </Button>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      )}
      {isTabletOrMobile && (
        <Box
          sx={{
            width: '100%',
            bgcolor: '#343434',
            pb: '1rem',
            px: '0.7rem',
            boxSizing: 'border-box',
            position: 'fixed',
            bottom: '0',
            zIndex: '1',
          }}
        >
          <Box
            sx={{
              boxSizig: 'border-box',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                bgcolor: 'white',
                height: '1rem',
                mb: '0.5rem',
                width: '100%',
                boxSizig: 'border-box',
                borderRadius: '0 0 1rem 1rem',
              }}
            />
            <Box sx={{ display: 'flex' }}>
              <Button
                variant='text'
                onClick={() => {
                  navigate('/courses/all');
                }}
              >
                {active === 'dashboard' && (
                  <>
                    <Box
                      sx={{
                        width: '3rem',
                        position: 'fixed',
                        bgcolor: '#5AC2D9',
                        height: '0.5rem',
                        bottom: 0,
                        borderRadius: '1rem',
                      }}
                    />
                    <SchoolIcon fontSize={'large'} sx={{ color: '#5AC2D9' }} />
                  </>
                )}
                {active !== 'dashboard' && (
                  <SchoolOutlinedIcon
                    fontSize={'large'}
                    sx={{ color: '#5AC2D9' }}
                  />
                )}
              </Button>
              <Button
                variant='text'
                onClick={() => {
                  if (tabbedCourses.length === 0) {
                    navigate('/course');
                  } else {
                    navigate(`/course/${tabbedCourses[0]}/tutorials`);
                  }
                }}
              >
                {props.active === 'course' && (
                  <>
                    <Box
                      sx={{
                        width: '3rem',
                        position: 'fixed',
                        bgcolor: '#5AC2D9',
                        height: '0.5rem',
                        bottom: 0,
                        borderRadius: '1rem',
                      }}
                    />
                    <BookIcon fontSize={'large'} sx={{ color: '#5AC2D9' }} />
                  </>
                )}
                {active !== 'course' && (
                  <BookOutlinedIcon
                    fontSize={'large'}
                    sx={{ color: '#5AC2D9' }}
                  />
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NavBar;