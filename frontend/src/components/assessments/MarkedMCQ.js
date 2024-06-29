import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';

const MarkedMCQ = ({
  questionNum,
  question,
  questionResponseId,
  options,
  totalMarks,
  answer,
  response,
  mark,
  markedResponses,
  setMarkedResponses,
}) => {
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose wisely');
  const [responseText, setResponseText] = React.useState('');

  const addMarkedResp = () => {
    const updatedMarkedResp = [...markedResponses];
    updatedMarkedResp.push({
      id: questionResponseId,
      marks: mark,
      feedback: '',
    });
    setMarkedResponses(updatedMarkedResp);
  };

  // find the corresponding text answer to the response e.g. 'A'
  const findOptionValue = (response) => {
    const existingAnswerIndex = options.findIndex(
      (option) => option.name === response
    );

    // if exists get the value
    if (existingAnswerIndex !== -1) {
      return options[existingAnswerIndex].text;
    }
  };

  const markMCQ = () => {
    if (response === answer) {
      setHelperText('Correct!');
      setError(false);
    } else {
      setHelperText(`Incorrect! Correct Answer: ${findOptionValue(answer)}`);
      setError(true);
    }
  };

  React.useEffect(() => {
    setResponseText(findOptionValue(response));
    addMarkedResp();
    markMCQ();
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#F5F5F5',
        borderRadius: '1rem',
        boxSizing: 'border-box',
        padding: '1rem',
        mb: '1rem',
      }}
    >
      <FormControl error={error} variant="standard">
        <FormLabel
          id="demo-radio-buttons-group-label"
          sx={{ fontSize: '1.3rem', color: 'black', fontWeight: 'bold' }}
        >
          {`${questionNum}. ${question} (${mark}/${totalMarks}${
            totalMarks > 1 ? ' marks' : ' mark'
          })`}
        </FormLabel>

        <RadioGroup
          id={`response-${questionResponseId}`}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          sx={{ paddingLeft: '1rem' }}
          value={responseText}
          defaultValue={responseText}
        >
          {options.map((answer) => {
            return (
              <FormControlLabel
                value={answer.text}
                control={<Radio />}
                label={answer.text}
              />
            );
          })}
        </RadioGroup>
        <FormHelperText sx={{ paddingLeft: '1rem', fontSize: '1rem' }}>
          {helperText}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default MarkedMCQ;