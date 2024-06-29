import { Box, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import NavBar from '../NavBar';

const EmptyCoursePage = (props) => {
  // courses opened in tabs
  const { tabbedCourses, setTabbedCourses } = props;
  const navigate = useNavigate();

  const [isStaff, setIsStaff] = React.useState(null);

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    getStaff(setIsStaff);
  }, []);

  return (
    <Box>
      <NavBar
        active={'course'}
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        isStaff={isStaff}
      ></NavBar>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: '#343434',
          padding: isTabletOrMobile ? '0.7rem' : '1rem',
          paddingLeft: isTabletOrMobile ? '0.7rem' : '6rem',
          paddingY: '1.5rem',
          boxSizing: 'border-box',
          position: 'fixed',
        }}
      >
        {/* white box background */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'white',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2>{'Nothing to see here 👻'}</h2>
          <Button
            variant="text"
            onClick={() => {
              navigate('/courses/all');
            }}
          >
            Click on a course
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmptyCoursePage;