import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import logo from '../../asset/Group.png';
import NavBar from '../NavBar';
import CoursePageNavBar from './CoursePageNavBar';
import CourseTab from './CourseTab';
import ResourcesSearch from './ResourcesSearch';

const Img = styled('img')({
  objectFit: 'contain',
  marginRight: '1rem',
});

const CoursePageTemplate = (props) => {
  const {
    tabbedCourses = [],
    setTabbedCourses = () => {},
    page,
    pageContent,
    isStaff,
  } = props;
  const { courseSlug } = useParams();
  const [activeCourse, setActiveCourse] = React.useState('none');
  const [activeTab, setActiveTab] = React.useState(page);
  const effectRan = React.useRef(false);

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  const studentNavList = ['Tutorials', 'Lectures', 'Forum', 'Assessments'];

  const teacherNavList = ['Tutorials', 'Lectures', 'Forum', 'Assessments'];

  React.useEffect(() => {
    if (effectRan.current === false) {
      if (!tabbedCourses.includes(courseSlug)) {
        if (tabbedCourses.length >= 4) {
          let copy = tabbedCourses;
          copy.shift();
          copy.push(courseSlug);

          setTabbedCourses(copy);
        } else {
          setTabbedCourses((prev) => [...prev, courseSlug]);
        }
      }
      setActiveCourse(courseSlug);
    }
    return () => {
      effectRan.current = true;
    };
  }, [courseSlug, tabbedCourses, setTabbedCourses]);

  return (
    <>
      {!isTabletOrMobile && (
        <Box>
          <NavBar
            active={'course'}
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
            {/* background container */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* container for course tabs and search bar */}
              <Box
                sx={{
                  width: '100%',
                  height: '3rem',
                  display: 'flex',
                  boxSizing: 'border-box',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    boxSizing: 'border-box',
                  }}
                >
                  {tabbedCourses.map((course) => {
                    return (
                      <CourseTab
                        course={course}
                        activeTab={activeTab}
                        activeCourse={activeCourse}
                        setActiveCourse={setActiveCourse}
                        tabbedCourses={tabbedCourses}
                        setTabbedCourses={setTabbedCourses}
                      />
                    );
                  })}
                </Box>
                <ResourcesSearch />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'white',
                  borderRadius: '0 1rem 1rem 1rem',
                  display: 'flex',
                  border: 2,
                  borderColor: '#5AC2D9',
                  padding: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                {isStaff === 'staff' && (
                  <CoursePageNavBar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    navList={teacherNavList}
                    isStaff={isStaff}
                  />
                )}
                {isStaff === 'student' && (
                  <CoursePageNavBar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    navList={studentNavList}
                    isStaff={isStaff}
                  />
                )}
                <Box sx={{ width: '100%', height: '100%' }}>{pageContent}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {isTabletOrMobile && (
        <>
          {/* outer background */}
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
              {/* course nav */}
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
                    {activeCourse.split('-')[0]}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={'bold'}
                    color={'#FFBC6C'}
                    lineHeight={'1rem'}
                  >
                    {activeTab}
                  </Typography>
                </Box>
              </Box>
              {isStaff === 'staff' && (
                <CoursePageNavBar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  navList={teacherNavList}
                  isStaff={isStaff}
                />
              )}
              {isStaff === 'student' && (
                <CoursePageNavBar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  navList={studentNavList}
                  isStaff={isStaff}
                />
              )}
            </Box>
            {/* background box */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'white',
                borderRadius: '1rem',
                padding: '1rem',
                boxSizing: 'border-box',
                overflowY: 'hidden',
              }}
            >
              {pageContent}
            </Box>
          </Box>
          <NavBar
            active={'course'}
            tabbedCourses={tabbedCourses}
            setTabbedCourses={setTabbedCourses}
            isStaff={isStaff}
          ></NavBar>
        </>
      )}
    </>
  );
};

export default CoursePageTemplate;