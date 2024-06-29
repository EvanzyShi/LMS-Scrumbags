import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseTab = (props) => {
  const navigate = useNavigate();
  const {
    course,
    activeTab,
    activeCourse,
    setActiveCourse,
    tabbedCourses,
    setTabbedCourses,
  } = props;

  return (
    <Box
      width={'10rem'}
      bgcolor={course === activeCourse ? '#5AC2D9' : '#E0F9FF'}
      sx={{
        borderRadius: '1rem 1rem 0 0',
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '1rem',
      }}
      onClick={() => {
        setActiveCourse(course);
        if (activeTab === 'Lectures') {
          navigate(`/course/${course}/${activeTab}/resources`);
        } else {
          navigate(`/course/${course}/${activeTab}`);
        }
      }}
    >
      <Typography
        variant="h6"
        textTransform={'uppercase'}
        fontWeight={course === activeCourse ? 'bold' : 'normal'}
        color={course === activeCourse ? 'black' : '#848484'}
      >
        {course.split('-')[0]}
      </Typography>
      <IconButton
        aria-label="delete"
        color="black"
        onClick={(event) => {
          event.stopPropagation();
          const updated = tabbedCourses.filter((tab) => tab !== course);
          setTabbedCourses(updated);

          // if the deleted course was an active one
          if (activeCourse === course) {
            if (updated.length !== 0) {
              setActiveCourse(updated[updated.length - 1]);

              if (activeTab === 'Lectures') {
                navigate(
                  `/course/${
                    updated[updated.length - 1]
                  }/${activeTab}/resources`
                );
              } else {
                navigate(`/course/${updated[updated.length - 1]}/${activeTab}`);
              }
            } else {
              navigate('/course');
            }
          }
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default CourseTab;