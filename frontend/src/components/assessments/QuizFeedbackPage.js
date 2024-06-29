import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import WarningSnackbar from '../WarningSnackbar';
import CoursePageTemplate from '../course/CoursePageTemplate';
import LongResponseResult from './LongResponseResult';
import MCQResult from './MCQResult';

const QuizFeedbackPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const { courseSlug, quizId } = useParams();
  const navigate = useNavigate();

  const [isStaff, setIsStaff] = React.useState(null);
  const [quizInfo, setQuizInfo] = React.useState({});
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const [warningMsg, setWarningMsg] = React.useState('');
  const [responses, setResponses] = React.useState([]);

  const getFeedback = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/quiz/${quizId}/feedback`,
        {
          withCredentials: true,
        }
      );
      // get the metadata like quiz name, id, total marks

      setQuizInfo(response.data.quiz_response.quiz);
      // get student's answer to questions & feedback
      setResponses(response.data.question_responses);
    } catch (error) {
      setWarningMsg(error);
      setOpenWarningSnackbar(true);
    }
  };

  React.useEffect(() => {
    getFeedback();
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
              <WarningSnackbar
                open={openWarningSnackbar}
                setOpen={setOpenWarningSnackbar}
                msg={warningMsg}
              />

              {/* name and end quiz button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={'bold'}
                    sx={{ mb: '2rem' }}
                  >
                    {quizInfo.name} Feedback
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
                  onClick={() => {
                    navigate(`/course/${courseSlug}/assessments`);
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>Close</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  overflowY: 'scroll',
                  boxSizing: 'border-box',
                  height: '65vh',
                }}
              >
                {responses.map((response, index) => {
                  const question = response.question;
                  switch (question.type) {
                    case 'multiple-choice':
                      return (
                        <MCQResult
                          questionNum={index + 1}
                          question={question.text}
                          questionResponseId={response.id}
                          options={question.answers}
                          totalMarks={question.marks}
                          answer={question.correct_answer}
                          response={response.answer}
                          mark={response.marks}
                        />
                      );

                    case 'long-response':
                      return (
                        <LongResponseResult
                          questionNum={index + 1}
                          question={question.text}
                          totalMarks={question.marks}
                          mark={response.marks}
                          response={response.answer}
                          feedback={response.feedback}
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

export default QuizFeedbackPage;