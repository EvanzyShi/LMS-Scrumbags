import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const LongResponse = ({
  questionNum,
  question,
  mark,
  questionId,
  answers,
  setAnswers,
}) => {
  const [answer, setAnswer] = React.useState('');

  const handleChange = (event) => {
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
          {`${questionNum}. ${question} (${mark}${
            mark > 1 ? ' marks' : ' mark'
          })`}
        </FormLabel>
        <TextField
          id={`response-${questionId}`}
          label="Answer here"
          variant="outlined"
          multiline
          rows={2}
          value={answer}
          sx={{
            mx: '1rem',
            bgcolor: 'white',
            borderColor: 'black',
            boxSizing: 'border-box',
          }}
          onChange={handleChange}
        />
      </FormControl>
    </Box>
  );
};

export default LongResponse;