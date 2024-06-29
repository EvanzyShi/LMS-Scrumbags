import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import TutorialResources from './TutorialResources';

const TutorialsPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  const { courseSlug, tutorialSlug } = useParams();
  const [isStaff, setIsStaff] = React.useState(null);

  React.useEffect(() => {
    getStaff(setIsStaff);
  }, [courseSlug]);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Tutorials'}
        isStaff={isStaff}
        pageContent={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Header */}
            <Box sx={{ padding: '1rem' }}>
              <Typography variant="h4">
                {tutorialSlug.split('-').slice(0, -1).join('-')} Tutorial
                Resources
              </Typography>
            </Box>
            <TutorialResources isStaff={isStaff} />
          </Box>
        }
      />
    </>
  );
};

export default TutorialsPage;