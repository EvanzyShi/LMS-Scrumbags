import { Box } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import HeadingTab from './HeadingTab';
import LectureResources from './LectureResources';
import LiveClass from './LiveClass';

const LecturesPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  const { courseSlug, contentType } = useParams();

  const [isStaff, setIsStaff] = React.useState(null);

  React.useEffect(() => {
    getStaff(setIsStaff);
  }, [courseSlug]);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Lectures'}
        isStaff={isStaff}
        pageContent={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              boxSizing: 'border-box',
              height: '100%',
            }}
          >
            {/* the main contents page */}
            <HeadingTab page={'lectures'} />
            {contentType === 'resources' && (
              <LectureResources
                isStaff={isStaff}
                courseId={courseSlug.split('-')[1]}
              />
            )}
            {contentType === 'live' && (
              <LiveClass
                isStaff={isStaff}
                courseId={courseSlug.split('-')[1]}
              />
            )}
          </Box>
        }
      />
    </>
  );
};

export default LecturesPage;