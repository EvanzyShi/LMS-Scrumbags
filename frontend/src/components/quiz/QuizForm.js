import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import {
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';

const QuizForm = (tabbedCourses, setTabbedCourses) => {
  const { courseSlug } = useParams();
  const [questionType, setQuestionType] = React.useState('');
  const [questions, setQuestions] = React.useState([
    {
      type: 'multiple-choice',
      question: '',
      choices: ['', '', '', ''],
      correctChoice: 0,
      marks: 0,
    },
    { type: 'long-response', question: '', sampleAnswer: '', marks: 0 },
  ]);
  const [quizName, setQuizName] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const navigate = useNavigate();

  const addMcQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        type: 'multiple-choice',
        question: '',
        choices: ['', '', '', ''],
        correctChoice: 0,
        marks: 0,
      },
    ]);
    setQuestionType('multiple-choice');
  };

  const addExtendedQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { type: 'long-response', question: '', sampleAnswer: '', marks: 0 },
    ]);
    setQuestionType('long-response');
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleQuestionChange = (index, key, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? { ...q, [key]: value } : q))
    );
  };

  const handleRemoveChoice = (questionIndex, choiceIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].choices.splice(choiceIndex, 1);
      return updatedQuestions;
    });
  };

  const handleAddChoice = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].choices.push('');
      return updatedQuestions;
    });
  };

  const createQuiz = async (quiz) => {
    const course_id = courseSlug.split('-')[1];
    const quizData = {
      name: quiz.name,
      start_date: quiz.start_date,
      end_date: quiz.end_date,
      course_id: course_id,
      questions: questions.map((q) => ({
        type: q.type,
        text: q.question,
        correct_answer:
          q.type === 'multiple-choice'
            ? String.fromCharCode(65 + q.correctChoice)
            : '',
        marks: q.marks,
        answers:
          q.type === 'multiple-choice'
            ? q.choices.map((choice, i) => ({
                name: String.fromCharCode(65 + i),
                text: choice,
              }))
            : [],
      })),
    };

    try {
      await axios.post(
        `/course/${courseSlug.split('-')[1]}/quiz/create`,
        quizData,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      navigate(`/course/${courseSlug}/assessments`);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '1200px',
        margin: 'auto',
        padding: '10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Quiz Creation
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Typography variant="h7" gutterBottom>
          Exam Title:
        </Typography>
        <TextField
          variant="outlined"
          sx={{
            width: '500px',
          }}
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
        }}
      >
        <Typography
          variant="h7"
          gutterBottom
          sx={{
            marginTop: '20px',
          }}
        >
          Date:
        </Typography>
        <TextField
          type="datetime-local"
          variant="outlined"
          sx={{
            width: '30vw',
          }}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Typography
          variant="h7"
          gutterBottom
          sx={{
            marginTop: '20px',
          }}
        >
          to
        </Typography>
        <TextField
          type="datetime-local"
          variant="outlined"
          sx={{
            width: '30vw',
          }}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
      <ButtonGroup
        variant="contained"
        fullWidth
        value={questionType}
        onChange={(e, value) => setQuestionType(value)}
      ></ButtonGroup>
      {questions.map((question, index) => (
        <Box
          key={index}
          sx={{
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '10px',
            position: 'relative',
            bgcolor: '#F4F4F4',
            width: '65vw',
          }}
        >
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteQuestion(index)}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: '#C63333',
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                minWidth: '60px',
                marginRight: '30px',
              }}
            >
              <ListItemIcon>
                <DensitySmallIcon
                  sx={{
                    fontSize: '20px',
                    color: '#434343',
                  }}
                />
              </ListItemIcon>
              Question ({index + 1}):
            </Typography>
            <TextField
              variant="outlined"
              multiline
              placeholder="Write your question here ..."
              rows={4}
              sx={{
                width: '40vw',
                marginBottom: '25px',
              }}
              value={question.question}
              onChange={(e) =>
                handleQuestionChange(index, 'question', e.target.value)
              }
            />
          </Box>
          {question.type === 'multiple-choice' && (
            <>
              {question.choices.map((choice, choiceIndex) => (
                <Box
                  key={choiceIndex}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {String.fromCharCode(65 + choiceIndex)}:
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={choice}
                    sx={{
                      width: '1000px',
                      marginBottom: '20px',
                    }}
                    onChange={(e) => {
                      handleQuestionChange(index, 'choices', [
                        ...question.choices.slice(0, choiceIndex),
                        e.target.value,
                        ...question.choices.slice(choiceIndex + 1),
                      ]);
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveChoice(index, choiceIndex)}
                    sx={{
                      color: '#C63333',
                    }}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => handleAddChoice(index)}
                sx={{
                  textTransform: 'none',
                  marginBottom: '25px',
                }}
              >
                + Add Choice
              </Button>
              <Box>
                <Typography variant="h7" gutterBottom>
                  Correct Choice:
                </Typography>
                <RadioGroup
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '50px',
                    textSize: '20px',
                    marginBottom: '16px',
                  }}
                  value={question.correctChoice}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      'correctChoice',
                      parseInt(e.target.value)
                    )
                  }
                >
                  {question.choices.map((_, i) => (
                    <FormControlLabel
                      key={i}
                      value={i}
                      control={<Radio />}
                      label={`Choice ${String.fromCharCode(65 + i)}`}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </>
          )}
          {question.type === 'long-response' && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                <Typography variant="h7" gutterBottom>
                  Sample Answer:
                </Typography>
                <TextField
                  variant="outlined"
                  multiline
                  placeholder="Write a sample answer here ..."
                  rows={4}
                  sx={{
                    width: '850px',
                    marginBottom: '25px',
                  }}
                  value={question.sampleAnswer}
                  onChange={(e) =>
                    handleQuestionChange(index, 'sampleAnswer', e.target.value)
                  }
                />
              </Box>
            </>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Typography variant="h7" gutterBottom>
              Points:
            </Typography>
            <TextField
              variant="outlined"
              type="number"
              sx={{
                width: '100px',
              }}
              value={question.marks}
              onChange={(e) =>
                handleQuestionChange(index, 'marks', e.target.value)
              }
            />
          </Box>
        </Box>
      ))}
      <Button
        onClick={addMcQuestion}
        fullWidth
        sx={{
          textTransform: 'none',
          backgroundColor: '#416fd1',
          color: 'white',
          '&:hover': {
            backgroundColor: '#357cd6',
          },
        }}
      >
        + Add Multiple Choice Question
      </Button>
      <Button
        onClick={addExtendedQuestion}
        fullWidth
        sx={{
          textTransform: 'none',
          backgroundColor: '#416fd1',
          color: 'white',
          '&:hover': {
            backgroundColor: '#357cd6',
          },
        }}
      >
        + Add Extended Response Question
      </Button>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={() => {
            createQuiz({
              name: quizName,
              start_date: startDate,
              end_date: endDate,
            });
          }}
          sx={{
            width: '200px',
            textTransform: 'none',
            backgroundColor: '#FFA500',
            color: 'white',
            '&:hover': {
              backgroundColor: '#FF8C00',
            },
          }}
        >
          Publish
        </Button>
      </Box>
    </Box>
  );
};

export default QuizForm;