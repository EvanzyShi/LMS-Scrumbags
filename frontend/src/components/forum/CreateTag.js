import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { MuiColorInput } from 'mui-color-input';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import CoursePageTemplate from '../course/CoursePageTemplate';

const CreateTag = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const navigate = useNavigate();

  const { courseSlug } = useParams();
  const courseCode = courseSlug.split('-')[0];
  const courseId = courseSlug.split('-')[1];
  const [title, setTitle] = React.useState('');
  const [isClicked, setIsClicked] = useState(false);

  const [value, setValue] = React.useState('#ffffff');

  const handleChangeColour = (newValue) => {
    setValue(newValue);
  };

  const handleCreate = async () => {
    try {
      await axios.post(`/forum/${courseId}/tag/create`,
          {
            name: title,
            colour: value,
          },
          {
            withCredentials: true,
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        )
        .then((response) => {
          navigate(`/course/${courseSlug}/forum`);
        });
    } catch (error) {
      setIsClicked(false);
      alert(error);
    }
  };

  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    async function getUser() {
      try {
        await axios.get(`/user`,
          {
            withCredentials: true,
          }).then((response) => {
            setIsStaff(response.data.user.is_staff);
          });
      } catch (error) {
        alert(error);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'forum'}
        isStaff={isStaff ? 'staff' : 'student'}
        pageContent={
          <>
            <Box
              sx={{
                flex: '1',
                bgcolor: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
              }}
            >
              <h1>{courseCode + ' Create Tag'}</h1>
              <Box
                sx={{
                  border: 1,
                  padding: '2rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <h2
                    style={{
                      marginRight: '1rem',
                    }}
                  >
                    Title:
                  </h2>
                  <TextField
                    id="outlined-basic"
                    label="Add a Title"
                    variant="outlined"
                    required
                    sx={{
                      width: '100%',
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0.5rem',
                    }}
                  >
                    <MuiColorInput
                      format="hex"
                      value={value}
                      onChange={handleChangeColour}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: '1rem',
                    width: '100%',
                  }}
                >
                  <h3
                    style={{
                      marginRight: '1rem',
                    }}
                  >
                    Description:
                  </h3>
                  <TextField
                    id="filled-multiline-static"
                    placeholder="Type here..."
                    multiline
                    rows={10}
                    variant="filled"
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    margin: '1rem',
                  }}
                  disabled={isClicked}
                  onClick={() => {
                    if (!isClicked) setIsClicked(true);
                    handleCreate();
                  }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default CreateTag;