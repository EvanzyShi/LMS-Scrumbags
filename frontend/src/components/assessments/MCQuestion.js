import {
  Box,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';

const MCQuestion = ({
  questionNum,
  question,
  options,
  answers,
  setAnswers,
  mark,
  questionId,
}) => {
  const [answer, setAnswer] = React.useState('');

  const handleRadioChange = (event) => {
    const newAnswer = event.target.value;
    setAnswer(event.target.value);

    // Check if answer is already in answers
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.question_id === questionId
    );

    if (existingAnswerIndex !== -1) {
      // If so, update it
      if (answers[existingAnswerIndex].answer !== newAnswer) {
        const updatedAnswers = [...answers];
        updatedAnswers[existingAnswerIndex] = {
          question_id: questionId,
          answer: newAnswer,
        };
        setAnswers(updatedAnswers);
      }
    } else {
      // If not, add it
      setAnswers([...answers, { question_id: questionId, answer: newAnswer }]);
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
      }}
    >
      <FormControl>
        <FormLabel
          id="demo-radio-buttons-group-label"
          key={`response-${questionId}-label`}
          sx={{ fontSize: '1.3rem', color: 'black', fontWeight: 'bold' }}
        >
          {`${questionNum}. ${question} (${mark}${
            mark > 1 ? ' marks' : ' mark'
          })`}
        </FormLabel>
        <RadioGroup
          id={`response-${questionId}`}
          key={`response-${questionId}`}
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue=""
          name="radio-buttons-group"
          sx={{ paddingLeft: '1rem' }}
          value={answer}
          onChange={handleRadioChange}
        >
          {options.map((answer) => {
            return (
              <FormControlLabel
                key={answer.id}
                value={answer.name}
                control={<Radio />}
                label={answer.name + '. ' + answer.text}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default MCQuestion;