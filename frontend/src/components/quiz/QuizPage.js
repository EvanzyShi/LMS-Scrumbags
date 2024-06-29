import { Box } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';
import QuizForm from './QuizForm';

const QuizPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;

  const { courseSlug } = useParams();

  const [isStaff, setIsStaff] = React.useState(null);
  React.useEffect(() => {
    getStaff(setIsStaff);
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Quizzes'}
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
            <QuizForm isStaff={isStaff} courseId={courseSlug.split('-')[1]} />
          </Box>
        }
      />
    </>
  );
};

export default QuizPage;