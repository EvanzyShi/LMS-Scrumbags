import { Box, CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = (props) => {
  const navigate = useNavigate();
  const { courseId, courseCode, courseTerm, courseTitle, courseColour } = props;

  return (
    <Card
      elevation={4}
      sx={{
        width: '15vw',
        minWidth: '250px',
        borderRadius: '1.5rem',
      }}
    >
      <CardActionArea
        onClick={() => {
          navigate(`/course/${courseCode}-${courseId}/tutorials`);
        }}
      >
        <Box 
          sx={{ 
            height: '140px', 
            bgcolor: courseColour, 
            width: '100%' 
          }} 
        />
        <CardContent>
          <Box 
            sx={{ 
              height: '80px', 
              width: '100%' 
            }}
          >
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
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;