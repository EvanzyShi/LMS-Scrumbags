import { Box, Typography, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import datetimeToString from '../../helpers/datetimeToString';

const AssignmentCard = (props) => {
  const { name, active, date, id, status, isStaff } = props;
  const { courseSlug } = useParams();

  const navigate = useNavigate();

  const isTabletOrMobile = useMediaQuery('(max-width:1100px)');

  // view assessment/ submission/ answers
  const handleOnClick = () => {
    // see the submission list
    if (isStaff === 'staff') {
      navigate(`/course/${courseSlug}/submissions/assignment/${id}`);
    } else if (isStaff === 'student') {
      // do assignment
      if (status === 'Graded') {
        navigate(`/course/${courseSlug}/feedback/assignment/${id}`);
      } else {
        navigate(`/course/${courseSlug}/assignment/${id}`);
      }
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        bgcolor: active ? '#E0F9FF' : '#F7F3F3',
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
          width: '70%',
          alignItems: 'center',
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
          Assignment
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
              bgcolor: active ? '#b7d68d' : '#ffb8b8',
              color: active ? '#017a0f' : '#d90000',
              border: 'solid',
              borderRadius: '0.5rem',
              width: '5rem',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>
              {active ? 'Active' : 'Late'}
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
        {/* assignment info */}
        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: isTabletOrMobile ? '100%' : '20%',
            textAlign: isTabletOrMobile ? 'center' : 'start',
          }}
        >
          100 Marks
        </Typography>
      </CardContent>
      <CardActions>
        <Button
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
          <Typography sx={{ fontWeight: 'bold' }}>
            {isStaff === 'staff'
              ? 'Submissions'
              : status === 'Graded'
              ? 'View Marks'
              : 'Submit'}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default AssignmentCard;