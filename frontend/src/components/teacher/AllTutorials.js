import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import getStaff from '../../helpers/getStaff';
import refreshPage from '../../helpers/refreshPage';
import CoursePageTemplate from '../course/CoursePageTemplate';
import TutorialCard from './TutorialCard';
import TutorialSearchBar from './TutorialSearchBar';

const AllTutorials = ({ tabbedCourses, setTabbedCourses }) => {
  const { courseSlug } = useParams();
  const [open, setOpen] = useState(false);
  const [allTutorials, setAllTutorials] = React.useState([]);
  const [tutorialCode, setTutorialCode] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isStaff, setIsStaff] = React.useState(null);

  const handleAddTutorial = async (code) => {
    try {
      if (
        allTutorials.some(
          (tutorial) => tutorial.name.toLowerCase() === code.toLowerCase()
        )
      ) {
        alert('A tutorial with the same name already exists.');
        return;
      }
      await createTutorial(code);
      setOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  const createTutorial = async (code) => {
    try {
      let response = await axios.post(
        `/course/${courseSlug.split('-')[1]}/tutorials/new`,
        {
          code: code,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setAllTutorials([...allTutorials, response.data]);
      setTutorialCode(response.data.name);
    } catch (error) {
      alert(error);
    }
  };

  const deleteTutorial = async (code) => {
    try {
      await axios.delete(
        `/course/${courseSlug.split('-')[1]}/tutorials/${code}/delete`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      refreshPage();
    } catch (error) {
      alert(error);
    }
  };

  const getAllTutorials = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/tutorials`,
        {
          withCredentials: true,
        }
      );
      const tutorials = response.data.tutorials.map((tutorial) => ({
        ...tutorial,
      }));
      setAllTutorials(tutorials);
    } catch (error) {
      alert(error);
    }
  };

  // On page load
  React.useEffect(() => {
    getStaff(setIsStaff);
    getAllTutorials();
  }, [courseSlug]);

  return (
    <CoursePageTemplate
      tabbedCourses={tabbedCourses}
      setTabbedCourses={setTabbedCourses}
      page={'Tutorials'}
      isStaff={isStaff}
      pageContent={
        <>
          {/* Contents of the All Tutorials page */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '1.5rem',
                maxWidth: '80vw',
                width: 400,
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
              >
                Create New Tutorial Class
              </Typography>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Tutorial Code
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={tutorialCode}
                  onChange={(e) => setTutorialCode(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => handleAddTutorial(tutorialCode)}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#70cde0',
                    display: 'inline-block',
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              padding: '1rem',
              boxSizing: 'border-box',
              alignItems: 'center',
            }}
          >
            <Box sx={{ maxWidth: '900px', width: '100%' }}>
              <TutorialSearchBar setSearchValue={setSearchValue} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                boxSizing: 'border-box',
                mt: '3rem',
                gap: '2rem',
                height: '70vh',
                overflowY: 'scroll',
                alignItems: 'start',
              }}
            >
              {isStaff === 'staff' && (
                <div
                  onClick={() => setOpen(true)}
                  style={{
                    width: '175px',
                    height: '164px',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-1px',
                      left: '0',
                      right: '0',
                      height: '1px',
                      backgroundColor: '#ccc',
                    }}
                  ></div>
                  <div
                    style={{
                      height: '50%',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Add style={{ fontSize: 50, color: '#597795' }} />
                    </div>
                  </div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ marginBottom: '7px', color: '#597795' }}
                  >
                    Create
                  </Typography>
                </div>
              )}

              {allTutorials
                .filter(
                  (tutorial) =>
                    tutorial &&
                    tutorial.name &&
                    tutorial.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                )
                .map((tutorial) => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorialCode={tutorial.name}
                    courseSlug={courseSlug}
                    tutorialId={tutorial.id}
                    isStaff={isStaff}
                    onDelete={() => deleteTutorial(tutorial.id)}
                  />
                ))}
            </Box>
          </Box>
        </>
      }
    />
  );
};

export default AllTutorials;