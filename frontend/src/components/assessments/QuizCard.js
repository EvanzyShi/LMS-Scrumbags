import { Box, Typography, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import datetimeToString from '../../helpers/datetimeToString';

const QuizCard = (props) => {
  const { name, active, numQuestions, totalMarks, id, date, status, isStaff } =
    props;
  const navigate = useNavigate();

  const { courseSlug } = useParams();
  // view assessment/ submission/ answers
  const handleOnClick = () => {
    // see the submission list
    if (isStaff === 'staff') {
      navigate(`/course/${courseSlug}/submissions/quiz/${id}`);
    } else if (isStaff === 'student') {
      // do quiz
      if (status === 'not_attempted' && active) {
        navigate(`/course/${courseSlug}/quiz/${id}`);
        // see quiz feedback
      } else if (status === 'marked') {
        navigate(`/course/${courseSlug}/feedback/quiz/${id}`);
      }
    }
  };

  const statusDisplay = () => {
    if (status === 'not_attempted') {
      return 'Attempt';
    } else if (status === 'marked') {
      return 'View Marks';
    } else if (status === 'unmarked') {
      return 'Completed';
    }
    return 'No Status';
  };

  const isTabletOrMobile = useMediaQuery('(max-width:1100px)');

  return (
    <Card
      sx={{
        width: '100%',
        bgcolor: active ? '#FFEDD8' : '#F7F3F3',
        borderRadius: '1rem',
        display: 'flex',
        justifyContent: isTabletOrMobile ? 'center' : 'space-between',
        alignItems: 'center',
        padding: '0.5rem',
        boxSizing: 'border-box',
        mb: '1rem',
        flexDirection: isTabletOrMobile ? 'column' : 'row',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: isTabletOrMobile ? 'center' : 'space-between',
          alignItems: 'center',
          width: '70%',
          flexDirection: isTabletOrMobile ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            width: isTabletOrMobile ? '100%' : '20%',
            textAlign: isTabletOrMobile ? 'center' : 'start',
            paddingBottom: isTabletOrMobile ? '1rem' : '',
          }}
        >
          <Typography variant="h6">{name}</Typography>
          Quiz
        </Box>
        {/* due date and active info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: active ? '#b7d68d' : '#dedddc',
              color: active ? '#017a0f' : '#8e918f',
              border: 'solid',
              borderRadius: '0.5rem',
              width: '5rem',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              {active ? 'Active' : 'Closed'}
            </Typography>
          </Box>
          <Typography
            sx={{
              textAlign: isTabletOrMobile ? 'center' : 'start',
            }}
          >
            Due date: {datetimeToString(date)}
          </Typography>
        </Box>
        {/* quiz info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isTabletOrMobile ? '100%' : '20%',
            textAlign: isTabletOrMobile ? 'center' : 'start',
          }}
        >
          <Typography>{numQuestions} Questions</Typography>
          <Typography>{totalMarks} Marks</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          disabled={
            (isStaff === 'student' && status === 'unmarked' ? true : false) ||
            (!active && isStaff === 'student' && status === 'not_attempted')
          }
          variant="contained"
          sx={{
            width: 140,
            height: 36,
            borderRadius: 2,
            backgroundColor: '#70cde0',
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
          onClick={handleOnClick}
        >
          <Typography sx={{ fontWeight: 'bold', lineHeight: '1rem' }}>
            {isStaff === 'staff'
              ? 'Submissions'
              : active
              ? statusDisplay()
              : status === 'not_attempted'
              ? 'Not Attempted'
              : 'View Marks'}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
