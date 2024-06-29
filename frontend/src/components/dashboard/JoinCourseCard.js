import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import SuccessSnackbar from '../SuccessSnackbar';
import WarningSnackbar from '../WarningSnackbar';

const JoinCourseCard = (props) => {
  const {
    courseCode,
    courseTerm,
    courseTitle,
    courseColour,
    courseId,
    joined,
    setJoined,
  } = props;
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);

  const joinCourse = async () => {
    try {
      await axios.get(`/courses/${courseId}/join`, {
        withCredentials: true,
      });
      setOpenSnackbar(true);
      setJoined(!joined);
    } catch (error) {
      setOpenWarningSnackbar(true);
    }
  };

  const handleClick = () => {
    joinCourse();
  };

  return (
    <>
      <SuccessSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        msg={'Course joined successfully!'}
      />
      <WarningSnackbar
        open={openWarningSnackbar}
        setOpen={setOpenWarningSnackbar}
        msg={'Already in course'}
      />
      <Card
        elevation={4}
        sx={{
          width: '15vw',
          minWidth: '250px',
          borderRadius: '1.5rem',
        }}
      >
        <Box sx={{ height: '140px', bgcolor: courseColour, width: '100%' }} />
        <CardContent>
          <Box sx={{ height: '80px', width: '100%' }}>
            <Typography
              textTransform={'uppercase'}
              gutterBottom
              variant="h5"
              component="div"
            >
              {courseCode} {courseTerm}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {courseTitle}
            </Typography>
          </Box>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxSizing: 'border-box',
            paddingX: '1rem',
          }}
        >
          <Button
            sx={{
              width: '100%',
              bgcolor: 'white',
              borderRadius: '0.9rem',
              color: '#5AC2D9',
              borderColor: '#5AC2D9',
              '&:hover': {
                backgroundColor: '#5AC2D9',
                color: 'white',
                borderColor: '#5AC2D9',
              },
            }}
            onClick={handleClick}
            variant="outlined"
          >
            Join
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default JoinCourseCard;