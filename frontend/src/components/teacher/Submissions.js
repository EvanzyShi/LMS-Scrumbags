import { Box } from '@mui/material';
import * as React from 'react';
import CoursePageTemplate from '../course/CoursePageTemplate';

const Submissions = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Submissions'}
        pageContent={
          <>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* contents here */}
            </Box>
          </>
        }
      />
    </>
  );
};

export default Submissions;