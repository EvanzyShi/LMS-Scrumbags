import { Box, Typography } from '@mui/material';
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
import MarkLongResponse from './MarkLongResponse';
import MarkedMCQ from './MarkedMCQ';

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

const MarkQuizPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const { courseSlug, quizId, responseId } = useParams();
  const navigate = useNavigate();

  const [isStaff, setIsStaff] = React.useState(null);
  const [quizInfo, setQuizInfo] = React.useState({});
  const [markedResponses, setMarkedResponses] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const [warningMsg, setWarningMsg] = React.useState('');
  const [responseInfo, setResponseInfo] = React.useState({});
  const [responses, setResponses] = React.useState([]);
  const [studentInfo, setStudentInfo] = React.useState({});
  const handleClose = () => setOpen(false);

  const getQuizResponse = async () => {
    try {
      let response = await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/quiz/${quizId}/response/${responseId}`,
        {
          withCredentials: true,
        }
      );
      // get the metadata like quiz name, id, total marks
      setResponseInfo(response.data.quiz_response);
      setQuizInfo(response.data.quiz_response.quiz);
      // get student's answer to questions
      setResponses(response.data.question_responses);
      // get student name, id
      setStudentInfo(response.data.quiz_response.student);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = () => {
    if (markedResponses.length !== responses.length) {
      setOpen(true);
    } else {
      submitMarkedResponses();
    }
  };

  const submitMarkedResponses = async () => {
    try {
      await axios.post(
        `/course/${courseSlug.split('-')[1]}/quiz/${quizId}/response/${
          responseInfo.id
        }`,
        {
          question_responses: markedResponses,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setOpenSnackbar(true);
      navigate(`/course/${courseSlug}/submissions/quiz/${quizId}`);
    } catch (error) {
      // assuming error is when incomplete long response
      setWarningMsg(`Quiz could not be marked. ${error}`);
      setOpenWarningSnackbar(true);
    }
  };

  React.useEffect(() => {
    getQuizResponse();
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
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    textAlign="center"
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    You have not marked all questions. Do you still want to
                    complete marking?
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      mt: '2rem',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleClose();
                        submitMarkedResponses();
                      }}
                    >
                      Done
                    </Button>
                  </Box>
                </Box>
              </Modal>
              {/* name and end quiz button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={'bold'}
                    sx={{ mb: '2rem' }}
                  >
                    {quizInfo.name}
                  </Typography>
                  <Typography variant="h6">
                    {`Name: ${studentInfo.firstname} ${studentInfo.lastname}`}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: '2rem' }}>
                    {`Student ID: ${studentInfo.id} `}
                  </Typography>
                </Box>
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
                  onClick={handleSubmit}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>Done</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  overflowY: 'scroll',
                  boxSizing: 'border-box',
                  height: '55vh',
                }}
              >
                {responses.map((response, index) => {
                  const question = response.question;
                  switch (question.type) {
                    case 'multiple-choice':
                      return (
                        <MarkedMCQ
                          questionNum={index + 1}
                          question={question.text}
                          questionResponseId={response.id}
                          options={question.answers}
                          totalMarks={question.marks}
                          answer={question.correct_answer}
                          response={response.answer}
                          mark={response.marks}
                          markedResponses={markedResponses}
                          setMarkedResponses={setMarkedResponses}
                        />
                      );

                    case 'long-response':
                      return (
                        <MarkLongResponse
                          questionNum={index + 1}
                          question={question.text}
                          questionResponseId={response.id}
                          totalMarks={question.marks}
                          response={response.answer}
                          mark={response.marks}
                          oldFeedback={response.feedback}
                          markedResponses={markedResponses}
                          setMarkedResponses={setMarkedResponses}
                        />
                      );

                    default:
                      return <h1>No project match</h1>;
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

export default MarkQuizPage;