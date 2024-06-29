import {
  Box,
  Button,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import * as React from 'react';
import logo from '../../asset/Group.png';
import getCookie from '../../helpers/getCookie';
import getStaff from '../../helpers/getStaff';
import NavBar from '../NavBar';
import CourseCard from './CourseCard';
import CourseSearch from './CourseSearch';
import CoursesNavBar from './CoursesNavBar';
import CreateCourseModal from './CreateCourseModal';
import JoinCourseCard from './JoinCourseCard';
import TeacherCourseCard from './TeacherCourseCard';

const Dashboard = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  const [allCourses, setAllCourses] = React.useState([]);
  const [ongoingCourses, setOngoingCourses] = React.useState([]);
  const [completedCourses, setCompletedCourses] = React.useState([]);
  const [joinCourses, setJoinCourses] = React.useState([]);

  const [activeCourseType, setActiveCourseType] = React.useState('All courses');
  const [joined, setJoined] = React.useState(false);
  const [isStaff, setIsStaff] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState('');

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  const Img = styled('img')({
    objectFit: 'contain',
    marginRight: '1rem',
  });

  const [showCourseForm, setShowCourseForm] = React.useState(false);

  const handleSubmit = async (newCourseData) => {
    try {
      await createCourse(newCourseData);
      setShowCourseForm(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleOpenCourseForm = () => {
    setShowCourseForm(true);
  };

  const getJoinCourses = async () => {
    try {
      let response = await axios.get('/courses/all', {
        withCredentials: true,
      });
      setJoinCourses(response.data.courses);
    } catch (error) {
      alert(error);
    }
  };

  const getAllCourses = async () => {
    try {
      let response = await axios.get('/courses', {
        withCredentials: true,
      });
      setAllCourses(response.data.courses);
    } catch (error) {
      alert(error);
    }
  };

  const getOngoingCourses = async () => {
    try {
      let response = await axios.get('/courses/ongoing', {
        withCredentials: true,
      });
      setOngoingCourses(response.data.courses);
    } catch (error) {
      alert(error);
    }
  };

  const getCompletedCourses = async () => {
    try {
      let response = await axios.get('/courses/completed', {
        withCredentials: true,
      });
      setCompletedCourses(response.data.courses);
    } catch (error) {
      alert(error);
    }
  };

  const createCourse = async (newCourseData) => {
    try {
      await axios.post(
        '/courses/create',
        {
          name: newCourseData.courseName,
          code: newCourseData.courseCode,
          term: newCourseData.courseTerm,
          url: '',
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      getAllCourses();
    } catch (error) {
      alert(error);
    }
  };

  const colour = '#a1c8ed';

  const createCard = (code, term, name, id, colour) => {
    return (
      <Grid item>
        {isStaff === 'student' && (
          <CourseCard
            courseId={id}
            courseCode={code}
            courseTerm={term}
            courseTitle={name}
            courseColour={colour}
          ></CourseCard>
        )}
        {isStaff === 'staff' && (
          <TeacherCourseCard
            courseId={id}
            courseCode={code}
            courseTerm={term}
            courseTitle={name}
            courseColour={colour}
          />
        )}
      </Grid>
    );
  };

  // make it render again after joining course or creating
  React.useEffect(() => {
    getAllCourses();
    getOngoingCourses();
    getCompletedCourses();
    getJoinCourses();
    getStaff(setIsStaff);
  }, [joined]);

  return (
    <Box>
      {!isTabletOrMobile && (
        <>
          <NavBar
            active={'dashboard'}
            tabbedCourses={tabbedCourses}
            setTabbedCourses={setTabbedCourses}
            isStaff={isStaff}
          ></NavBar>
          <Box
            sx={{
              width: '100vw',
              height: '100vh',
              bgcolor: '#343434',
              padding: '1rem',
              paddingLeft: '6rem',
              paddingY: '1.5rem',
              boxSizing: 'border-box',
              position: 'fixed',
            }}
          >
            {/* white box background */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'white',
                borderRadius: '1rem',
                display: 'flex',
              }}
            >
              <CreateCourseModal
                open={showCourseForm}
                setOpen={setShowCourseForm}
                handleSubmit={handleSubmit}
              />
              <Box
                sx={{
                  width: '14rem',
                  height: '100%',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                }}
              >
                <CourseSearch setSearchValue={setSearchValue} />
                <CoursesNavBar
                  setSelectedType={setActiveCourseType}
                  tabbedCourses={tabbedCourses}
                  setTabbedCourses={setTabbedCourses}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  padding: '2rem',
                  paddingBottom: '1rem',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h4"
                    fontWeight={'bold'}
                    paddingBottom={'1.5rem'}
                  >
                    {activeCourseType}
                  </Typography>
                  {isStaff === 'staff' && (
                    <Button
                      variant="contained"
                      sx={{
                        width: 160,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#70cde0',
                        fontSize: '0.7rem',
                        textTransform: 'none',
                      }}
                      onClick={handleOpenCourseForm}
                    >
                      + Create New Course
                    </Button>
                  )}
                </Box>
                {activeCourseType === 'Ongoing' && allCourses.length === 0 && (
                  <Grid item>
                    <h1>You are not enrolled in any courses</h1>
                  </Grid>
                )}
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  sx={{
                    bgcolor: '#FAFAFA',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '1rem',
                    padding: '2rem',
                    alignContent: 'flex-start',
                    overflow: 'scroll',
                    overflowX: 'hidden',
                  }}
                >
                {activeCourseType === 'All courses' &&
                  allCourses
                    .filter(
                      (course) =>
                        course &&
                        course.name &&
                        course.name.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((course) =>
                      createCard(course.code, course.term, course.name, course.id, colour)
                    )}
                {activeCourseType === 'Ongoing' &&
                  ongoingCourses.length !== 0 &&
                  ongoingCourses.map((course) =>
                    createCard(course.code, course.term, course.name, course.id, colour)
                  )}
                {activeCourseType === 'Completed' &&
                  completedCourses.length !== 0 &&
                  completedCourses.map((course) =>
                    createCard(course.code, course.term, course.name, course.id, colour)
                  )}
                {activeCourseType === 'Join Course' &&
                  joinCourses.length !== 0 &&
                  joinCourses.map((course) => (
                    <Grid item key={course.id}>
                      <JoinCourseCard
                        courseCode={course.code}
                        courseTerm={course.term}
                        courseTitle={course.name}
                        courseColour={colour}
                        courseId={course.id}
                        joined={joined}
                        setJoined={setJoined}
                      ></JoinCourseCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </>
      )}
      {isTabletOrMobile && (
        <>
          <Box
            sx={{
              display: 'flex',
              width: '100vw',
              height: '100vh',
              bgcolor: '#343434',
              paddingX: '0.7rem',
              boxSizing: 'border-box',
              position: 'fixed',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                height: '5rem',
                boxSizing: 'border-box',
                paddingY: '1rem',
                paddingX: '0.7rem',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                }}
              >
                <Img src={logo} alt="Logo" />
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={'bold'}
                    color={'#5AC2D9'}
                  >
                    Dashboard
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={'bold'}
                    color={'#FFBC6C'}
                    lineHeight={'1rem'}
                  >
                    {activeCourseType}
                  </Typography>
                </Box>
              </Box>
              <CoursesNavBar
                setSelectedType={setActiveCourseType}
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'white',
                borderRadius: '1rem',
              }}
            >
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{
                  width: '100%',
                  height: '70vh',
                  borderRadius: '1rem',
                  marginTop: '0.5rem',
                  boxSizing: 'border-box',
                  alignContent: 'flex-start',
                  justifyContent: 'center',
                  overflow: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                {activeCourseType === 'All courses' &&
                  allCourses.map((course) => {
                    return createCard(
                      course.code,
                      course.term,
                      course.name,
                      course.id,
                      colour
                    );
                  })}
                {activeCourseType === 'Ongoing' &&
                  ongoingCourses.map((course) => {
                    return createCard(
                      course.code,
                      course.term,
                      course.name,
                      course.id,
                      colour
                    );
                  })}
                {activeCourseType === 'Completed' &&
                  completedCourses.map((course) => {
                    return createCard(
                      course.code,
                      course.term,
                      course.name,
                      course.id,
                      colour
                    );
                  })}
                {activeCourseType === 'Join Course' &&
                  joinCourses.length !== 0 &&
                  joinCourses.map((course) => {
                    return (
                      <Grid item>
                        <JoinCourseCard
                          courseCode={course.code}
                          courseTerm={course.term}
                          courseTitle={course.name}
                          courseColour={colour}
                          courseId={course.id}
                          joined={joined}
                          setJoined={setJoined}
                        ></JoinCourseCard>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </Box>
          <NavBar
            active={'dashboard'}
            tabbedCourses={tabbedCourses}
            setTabbedCourses={setTabbedCourses}
            isStaff={isStaff}
          ></NavBar>
        </>
      )}
    </Box>
  );
};

export default Dashboard;