import axios from 'axios';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AssessmentsPage from './components/assessments/AssessmentPage';
import AssignmentSubmissionPage from './components/assessments/AssignmentSubmissionsPage';
import MarkQuizPage from './components/assessments/MarkQuizPage';
import QuizFeedbackPage from './components/assessments/QuizFeedbackPage';
import QuizQuestionsPage from './components/assessments/QuizQuestionsPage';
import QuizSubmissionPage from './components/assessments/QuizSubmissionsPage';
import AssignmentCreatePage from './components/assignments/AssignmentCreatePage';
import AssignmentPage from './components/assignments/AssignmentPage';
import EmptyCoursePage from './components/course/EmptyCoursePage';
import Dashboard from './components/dashboard/Dashboard';
import Comments from './components/forum/Comments';
import CreatePost from './components/forum/CreatePost';
import CreateTag from './components/forum/CreateTag';
import ForumPage from './components/forum/ForumPage';
import LecturesPage from './components/lectureAndTutorial/LecturesPage';
import ResourcesCard from './components/lectureAndTutorial/ResourcesCard';
import TutorialsPage from './components/lectureAndTutorial/TutorialsPage';
import UpdateCourseContentForm from './components/lectureAndTutorial/UpdateContentForm';
import StudentLogin from './components/login/StudentLogin';
import TeacherLogin from './components/login/TeacherLogin';
import ForgotPassword from './components/passwordReset/ForgotPassword';
import ResetPassword from './components/passwordReset/ResetPassword';
import QuizPage from './components/quiz/QuizPage';
import StudentRegister from './components/register/StudentRegister';
import TeacherRegister from './components/register/TeacherRegister';
import Submission from './components/submission/Submission';
import AllTutorials from './components/teacher/AllTutorials';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const App = () => {
  const [tabbedCourses, setTabbedCourses] = React.useState([]);
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login/student' element={<StudentLogin />} />
          <Route path='/login/teacher' element={<TeacherLogin />} />
          <Route path='/register/student' element={<StudentRegister />} />
          <Route path='/register/teacher' element={<TeacherRegister />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          {/* dashboard */}
          <Route
            path='/courses/:courseType'
            element={
              <Dashboard
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* courses */}
          <Route
            path='/course'
            element={
              <EmptyCoursePage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/lectures/:contentType'
            element={
              <LecturesPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/tutorials'
            element={
              <AllTutorials
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/tutorials/:tutorialSlug'
            element={
              <TutorialsPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/quizzes/create'
            element={
              <QuizPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/class/updateContentForm'
            element={<UpdateCourseContentForm />}
          />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/course/:courseSlug/forum/'
            element={
              <ForumPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/forum/create-post'
            element={
              <CreatePost
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/forum/create-tag'
            element={
              <CreateTag
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/forum/:post_id/comments'
            element={
              <Comments
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* assessments overview page */}
          <Route
            path='/course/:courseSlug/assessments'
            element={
              <AssessmentsPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* student to access quiz */}
          <Route
            path='/course/:courseSlug/quiz/:quizId'
            element={
              <QuizQuestionsPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* see all submissions for quiz*/}
          <Route
            path='/course/:courseSlug/submissions/quiz/:quizId'
            element={
              <QuizSubmissionPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* see all submissions for assignments*/}
          <Route
            path='/course/:courseSlug/submissions/assignment/:assignmentId'
            element={
              <AssignmentSubmissionPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* mark quiz */}
          <Route
            path='/course/:courseSlug/submissions/quiz/:quizId/:responseId'
            element={
              <MarkQuizPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* mark assignment */}
          <Route
            path='/course/:courseSlug/submissions/:assignmentId/:submissionId'
            element={
              <Submission
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* see feedback for quiz */}
          <Route
            path='/course/:courseSlug/feedback/quiz/:quizId'
            element={
              <QuizFeedbackPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* see feedback for assignment */}
          <Route
            path='/course/:courseSlug/feedback/assignment/:assignmentId'
            // TODO REPLACE WITH ASSINGMENT
            element={
              <Submission
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route
            path='/course/:courseSlug/assessments/assignment/create'
            element={
              <AssignmentCreatePage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          {/* student to access assignmet */}
          <Route
            path='/course/:courseSlug/assignment/:assignmentId'
            element={
              <AssignmentPage
                tabbedCourses={tabbedCourses}
                setTabbedCourses={setTabbedCourses}
              />
            }
          />
          <Route path='test' element={<ResourcesCard />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;