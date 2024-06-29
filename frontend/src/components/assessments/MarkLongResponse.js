import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const MarkLongResponse = ({
  questionNum,
  question,
  questionResponseId,
  totalMarks,
  response,
  mark,
  oldFeedback,
  markedResponses,
  setMarkedResponses,
}) => {
  const [awardedMark, setAwardedMark] = React.useState(mark);
  const [feedback, setFeedback] = React.useState(oldFeedback);

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  const markHandleChange = (event) => {
    const newAwardedMark = event.target.value;
    setAwardedMark(event.target.value);

    // Check if markedResp is alr in markedResponses (has been marked before)
    const existingRespIndex = markedResponses.findIndex(
      (resp) => resp.id === questionResponseId
    );

    // if exists update it
    if (existingRespIndex !== -1) {
      if (markedResponses[existingRespIndex].marks !== newAwardedMark) {
        const updatedResp = [...markedResponses];
        updatedResp[existingRespIndex] = {
          id: questionResponseId,
          marks: newAwardedMark,
          feedback: feedback,
        };
        setMarkedResponses(updatedResp);
      }
    } else {
      // If not, add it
      setMarkedResponses([
        ...markedResponses,
        {
          id: questionResponseId,
          marks: newAwardedMark,
          feedback: feedback,
        },
      ]);
    }
  };

  const feedbackHandleChange = (event) => {
    const newFeedback = event.target.value;
    setFeedback(event.target.value);

    // Check if markedResp is alr in markedResponses (has been marked before)
    const existingRespIndex = markedResponses.findIndex(
      (resp) => resp.id === questionResponseId
    );

    // if exists update it
    if (existingRespIndex !== -1) {
      if (markedResponses[existingRespIndex].feedback !== newFeedback) {
        const updatedResp = [...markedResponses];
        updatedResp[existingRespIndex] = {
          id: questionResponseId,
          marks: awardedMark,
          feedback: newFeedback,
        };
        setMarkedResponses(updatedResp);
      }
    } else {
      // If not, add it
      setMarkedResponses([
        ...markedResponses,
        {
          id: questionResponseId,
          marks: awardedMark,
          feedback: newFeedback,
        },
      ]);
    }
  };

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: isTabletOrMobile ? 'column' : 'row',
          }}
        >
          <TextField
            id={`response-${questionResponseId}`}
            label="Enter Feedback here"
            variant="outlined"
            multiline
            rows={2}
            value={feedback}
            sx={{
              mx: isTabletOrMobile ? '' : '1rem',
              bgcolor: 'white',
              borderColor: 'black',
              boxSizing: 'border-box',
              width: '100%',
              height: '100%',
            }}
            onChange={feedbackHandleChange}
          />
          <Box>
            <FormHelperText
              id="outlined-weight-helper-text"
              sx={{ fontSize: '1rem', color: 'black', mt: '0' }}
            >
              Enter Marks
            </FormHelperText>
            <OutlinedInput
              id="outlined-adornment-weight"
              sx={{
                mx: '1rem',
                bgcolor: 'white',
                borderColor: 'black',
                boxSizing: 'border-box',
                width: '9rem',
              }}
              endAdornment={
                <InputAdornment position="end">{`/${totalMarks} Marks`}</InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                'aria-label': 'mark-input',
              }}
              onChange={markHandleChange}
              value={awardedMark}
            />
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
};

export default MarkLongResponse;