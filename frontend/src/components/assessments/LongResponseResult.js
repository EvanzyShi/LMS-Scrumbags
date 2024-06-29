import { Box, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as React from 'react';

const LongResponseResult = ({
  questionNum,
  question,
  totalMarks,
  mark,
  response,
  feedback,
}) => {
  return (
    <Box
      sx={{
        bgcolor: '#F5F5F5',
        borderRadius: '1rem',
        boxSizing: 'border-box',
        padding: '1rem',
        mb: '1rem',
        width: '100%',
      }}
    >
      <FormControl fullWidth>
        <FormLabel
          id="demo-radio-buttons-group-label"
          sx={{
            fontSize: '1.3rem',
            color: 'black',
            fontWeight: 'bold',
            mb: '1rem',
          }}
        >
          {`${questionNum}. ${question} (${mark}/${totalMarks}${
            totalMarks > 1 ? ' marks' : ' mark'
          })`}
        </FormLabel>
        <Typography
          sx={{
            padding: '1rem',
            bgcolor: 'white',
            boxSizing: 'border-box',
            mx: '1rem',
            borderRadius: '1rem',
            border: 'solid 1px',
            borderColor: 'gray',
            mb: '1rem',
          }}
        >
          {response}
        </Typography>
        <Typography
          fontWeight={'bold'}
          sx={{
            padding: '1rem',
            paddingBottom: '0',
            boxSizing: 'border-box',
            color: '#d32f2f',
          }}
        >
          Feedback:
        </Typography>
        <Typography
          sx={{
            paddingX: '1rem',
          }}
        >
          {feedback}
        </Typography>
      </FormControl>
    </Box>
  );
};

export default LongResponseResult;