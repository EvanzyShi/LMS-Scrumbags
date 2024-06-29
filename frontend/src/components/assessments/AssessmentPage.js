import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import AssignmentCard from './AssignmentCard';
import QuizCard from './QuizCard';

const AssessmentsPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const [quizzes, setQuizzes] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [isStaff, setIsStaff] = React.useState(null);
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCreateQuizClick = () => {
    navigate(`/course/${courseSlug}/quizzes/create`);
  };

  const handleCreateAssignmentClick = () => {
    navigate(`/course/${courseSlug}/assessments/assignment/create`);
  };

  const getQuizzes = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/quizzes`,
        {
          withCredentials: true,
        }
      );
      setQuizzes(response.data.quizzes);
    } catch (error) {
      alert(error);
    }
  };

  const getAssignments = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/assessments/assignments`,
        {
          withCredentials: true,
        }
      );
      setAssignments(response.data.assignments);
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    getQuizzes();
    getAssignments();
    getStaff(setIsStaff);
  }, [courseSlug]);

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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isTabletOrMobile
                    ? 'flex-end'
                    : 'space-between',
                  mb: '2rem',
                  alignItems: 'center',
                }}
              >
                {!isTabletOrMobile && (
                  <Typography variant="h4" fontWeight={'bold'}>
                    Assessments
                  </Typography>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                  }}
                >
                  {isStaff === 'staff' && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                        }}
                        onClick={handleCreateQuizClick}
                      >
                        + Create Quiz
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                        }}
                        onClick={handleCreateAssignmentClick}
                      >
                        + Add Assessment
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {/* active ones are at the top */}
              <Box
                sx={{
                  overflowY: 'scroll',
                  height: '70vh',
                  boxSizing: 'border-box',
                }}
              >
                {assignments.map((assignment) => {
                  return (
                    <>
                      {!assignment.is_late && (
                        <AssignmentCard
                          name={assignment.title}
                          active={!assignment.is_late}
                          date={assignment.due_date}
                          id={assignment.id}
                          status={assignment.status}
                          isStaff={isStaff}
                        />
                      )}
                    </>
                  );
                })}
                {quizzes.map((quiz) => {
                  return (
                    <>
                      {quiz.active && (
                        <QuizCard
                          name={quiz.name}
                          active={quiz.is_active}
                          numQuestions={quiz.num_questions}
                          totalMarks={quiz.total_marks}
                          id={quiz.id}
                          key={quiz.id}
                          date={quiz.end_date}
                          status={quiz.status}
                          isStaff={isStaff}
                        />
                      )}
                    </>
                  );
                })}

                {/* inactive ones  */}
                {assignments.map((assignment) => {
                  return (
                    <>
                      {assignment.is_late && (
                        <AssignmentCard
                          name={assignment.title}
                          active={!assignment.is_late}
                          date={assignment.due_date}
                          id={assignment.id}
                          status={assignment.status}
                          isStaff={isStaff}
                        />
                      )}
                    </>
                  );
                })}
                {quizzes.map((quiz) => {
                  return (
                    <>
                      {!quiz.active && (
                        <QuizCard
                          name={quiz.name}
                          active={quiz.is_active}
                          numQuestions={quiz.num_questions}
                          totalMarks={quiz.total_marks}
                          id={quiz.id}
                          key={quiz.id}
                          date={quiz.end_date}
                          status={quiz.status}
                          isStaff={isStaff}
                        />
                      )}
                    </>
                  );
                })}
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default AssessmentsPage;