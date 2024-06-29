import {
  Box,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import getStaff from '../../helpers/getStaff';
import SuccessSnackbar from '../SuccessSnackbar';
import WarningSnackbar from '../WarningSnackbar';
import CoursePageTemplate from '../course/CoursePageTemplate';
import LongResponse from './LongResponse';
import MCQuestion from './MCQuestion';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '1rem',
  borderColor: '#5AC2D9',
};

const QuizQuestionsPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const { courseSlug, quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = React.useState([]);
  const [isStaff, setIsStaff] = React.useState(null);
  const [quizInfo, setQuizInfo] = React.useState({});
  const [answers, setAnswers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const [warningMsg, setWarningMsg] = React.useState('');

  const handleClose = () => setOpen(false);

  const getQuestions = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/quiz/${quizId}/questions`,
        {
          withCredentials: true,
        }
      );
      setQuizInfo(response.data.quiz);
      setQuestions(response.data.questions);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = () => {
    if (answers.length !== questions.length) {
      setOpen(true);
    } else {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      await axios.post(
        `/course/${courseSlug.split('-')[1]}/quiz/${quizId}/submit`,
        {
          responses: answers,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setOpenSnackbar(true);
      navigate(`/course/${courseSlug}/assessments`);
    } catch (error) {
      // assuming error is when incomplete long response
      setWarningMsg(`Quiz could not be submitted. ${error}`);
      setOpenWarningSnackbar(true);
    }
  };

  React.useEffect(() => {
    getQuestions();
    getStaff(setIsStaff);
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        isStaff={isStaff}
        page={'Assessments'}
        pageContent={
          <>
            {/* contents here */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <SuccessSnackbar
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                msg={'Successfully completed quiz!'}
              />
              <WarningSnackbar
                open={openWarningSnackbar}
                setOpen={setOpenWarningSnackbar}
                msg={warningMsg}
              />
              {/* confirm submission modal*/}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <Typography
                    textAlign='center'
                    id='modal-modal-title'
                    variant='h6'
                    component='h2'
                  >
                    You have not answered all questions. Would you still like to
                    submit?
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      mt: '2rem',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button
                      variant='contained'
                      color='error'
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        handleClose();
                        submitAnswers();
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Modal>
              {/* name and end quiz button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant='h4'
                  fontWeight={'bold'}
                  sx={{ mb: '2rem' }}
                >
                  {quizInfo.name}
                </Typography>
                <Button
                  variant='contained'
                  sx={{
                    width: 140,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: '#70cde0',
                    fontSize: '0.7rem',
                    textTransform: 'none',
                  }}
                  onClick={handleSubmit}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>Submit</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  overflowY: 'scroll',
                  boxSizing: 'border-box',
                  height: '70vh',
                }}
              >
                {questions.map((question, index) => {
                  switch (question.type) {
                    case 'multiple-choice':
                      return (
                        <MCQuestion
                          questionId={question.id}
                          questionNum={index + 1}
                          question={question.text}
                          mark={question.marks}
                          options={question.answers}
                          setAnswers={setAnswers}
                          answers={answers}
                        />
                      );

                    case 'long-response':
                      return (
                        <LongResponse
                          questionId={question.id}
                          questionNum={index + 1}
                          question={question.text}
                          mark={question.marks}
                          setAnswers={setAnswers}
                          answers={answers}
                        />
                      );

                    default:
                      return <div></div>;
                  }
                })}
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default QuizQuestionsPage;