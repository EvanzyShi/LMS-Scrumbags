import { Box } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import AssignmentForm from './AssignmentForm';

const AssignmentCreatePage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  const { courseSlug } = useParams();

  const [isStaff, setIsStaff] = React.useState(null);
  React.useEffect(() => {
    getStaff(setIsStaff);
  }, []);

  return (
    isStaff === 'staff' && (
      <>
        <CoursePageTemplate
          tabbedCourses={tabbedCourses}
          setTabbedCourses={setTabbedCourses}
          page={'Assignments'}
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
              <AssignmentForm
                isStaff={isStaff}
                courseId={courseSlug.split('-')[1]}
              ></AssignmentForm>
            </Box>
          }
        />
      </>
    )
  );
};

export default AssignmentCreatePage;