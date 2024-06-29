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

const AssignmentSubmissionPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const [isStaff, setIsStaff] = React.useState(null);
  const { courseSlug, assignmentId } = useParams();
  const [data, setData] = React.useState([0]);
  const navigate = useNavigate();

  const [assignmentName, setAssignmentName] = React.useState('');
  const [assignmentResults, setAssignmentResults] = React.useState([]);

  const handleOnClick = (submissionId, assignmentId) => {
    navigate(
      `/course/${courseSlug}/submissions/${assignmentId}/${submissionId}`
    );
  };

  const getResultsData = (resultList) => {
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
      if (result.status === 'Graded') {
        const percentage = result.grade;
        if (percentage === 100) {
          freq[90] += 1;
        } else {
          freq[parseInt(percentage / 10, 10) * 10] += 1;
        }
      }
    });
    setData(Object.values(freq));
  };

  const getAssignmentResults = async () => {
    // determine whether its an assignment or quiz
    try {
      let response = await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/submissions`,
        {
          withCredentials: true,
        }
      );
      setAssignmentResults(response.data.submissions);
      setAssignmentName(response.data.title);
      getResultsData(response.data.submissions);
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    getAssignmentResults();
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
                {`${assignmentName} Submissions`}
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
                    {assignmentResults.map((result) => (
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
                        <TableCell>{result.grade}/100</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              bgcolor:
                                result.status === 'Graded'
                                  ? '#b7d68d'
                                  : '#dedddc',
                              color:
                                result.status === 'Graded'
                                  ? '#017a0f'
                                  : '#8e918f',
                              border: 'solid',
                              borderRadius: '0.5rem',
                              width: 'fit-content',
                              textAlign: 'center',
                              paddingX: '1rem',
                            }}
                          >
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {result.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
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
                            onClick={() =>
                              handleOnClick(result.id, assignmentId)
                            }
                          >
                            {result.status === 'Graded' ? 'Edit' : 'Mark'}
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

export default AssignmentSubmissionPage;