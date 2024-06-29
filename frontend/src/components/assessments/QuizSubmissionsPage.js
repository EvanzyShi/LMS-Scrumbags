import { Box, Typography, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import FrequencyGraph from './FrequencyGraph';

const HeadingCell = styled(TableCell)(() => ({
  '&.MuiTableCell-root': {
    background: '#5AC2D9',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
}));

const QuizSubmissionPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const [isStaff, setIsStaff] = React.useState(null);
  const { courseSlug, quizId } = useParams();
  const [data, setData] = React.useState([0]);

  const [quizInfo, setQuizInfo] = React.useState({});
  const [quizResults, setQuizResults] = React.useState([]);

  const navigate = useNavigate();

  const getResultsData = (resultList, info) => {
    const freq = {
      0: 0,
      10: 0,
      20: 0,
      30: 0,
      40: 0,
      50: 0,
      60: 0,
      70: 0,
      80: 0,
      90: 0,
    };
    resultList.map((result) => {
      if (result.marks !== null && result.marked) {
        const percentage = (result.marks / info.total_marks) * 100;
        if (parseInt(percentage / 10, 10) * 10 === 100) {
          freq[90] += 1;
        } else {
          freq[parseInt(percentage / 10, 10) * 10] += 1;
        }
      }
      // calculate the percentage first
    });
    setData(Object.values(freq));
  };

  const getQuizResults = async () => {
    // determine whether its an assignment or quiz
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/quiz/${quizId}/responses`,
        {
          withCredentials: true,
        }
      );
      setQuizResults(response.data.quiz_responses);
      getResultsData(response.data.quiz_responses, response.data.quiz);
      setQuizInfo(response.data.quiz);
    } catch (error) {
      alert(error);
    }
  };

  const handleStatus = (result) => {
    if (result.marks === null) {
      return 'No Submission';
    } else if (result.marked) {
      return 'Graded';
    } else if (!result.marked) {
      return 'Not Graded';
    }
  };

  const handleOnClick = (responseId) => {
    navigate(`/course/${courseSlug}/submissions/quiz/${quizId}/${responseId}`);
  };

  React.useEffect(() => {
    getQuizResults();
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
              <Typography variant="h4" fontWeight={'bold'} sx={{ mb: '2rem' }}>
                {`${quizInfo.name} Submissions`}
              </Typography>
              <FrequencyGraph data={data} />
              <TableContainer
                component={Paper}
                sx={{ overflowY: 'scroll', height: '45vh', mt: '1rem' }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <HeadingCell>Student ID</HeadingCell>
                      <HeadingCell>Name</HeadingCell>
                      <HeadingCell>Marks</HeadingCell>
                      <HeadingCell>Status</HeadingCell>
                      <HeadingCell width={'160'}>Feedback</HeadingCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizResults.map((result) => (
                      <TableRow
                        key={result.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {result.student.id}
                        </TableCell>
                        <TableCell>
                          {result.student.firstname} {result.student.lastname}
                        </TableCell>
                        <TableCell>
                          {result.marks}/{quizInfo.total_marks}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              bgcolor: result.marked ? '#b7d68d' : '#dedddc',
                              color: result.marked ? '#017a0f' : '#8e918f',
                              border: 'solid',
                              borderRadius: '0.5rem',
                              width: 'fit-content',
                              textAlign: 'center',
                              paddingX: '1rem',
                            }}
                          >
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {handleStatus(result)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            disabled={result.marks === null ? true : false}
                            variant="contained"
                            sx={{
                              width: 140,
                              height: 36,
                              borderRadius: 2,
                              backgroundColor: '#FFBC6C',
                              textTransform: 'none',
                              color: 'black',
                              '&:hover': {
                                backgroundColor: '#b57b36',
                                color: 'white',
                              },
                            }}
                            onClick={() => {
                              handleOnClick(result.id);
                            }}
                          >
                            {result.marked ? 'Edit' : 'Mark'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        }
      />
    </>
  );
};

export default QuizSubmissionPage;