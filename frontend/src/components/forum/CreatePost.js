import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import CoursePageTemplate from '../course/CoursePageTemplate';
import { fileToDataUrl } from './ForumHelper.js';

const CreatePost = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const navigate = useNavigate();

  const [tag, setTag] = React.useState('');

  const handleChange = (event) => {
    setTag(event.target.value);
  };

  const { courseSlug } = useParams();
  const courseCode = courseSlug.split('-')[0];
  const courseId = courseSlug.split('-')[1];
  const [title, setTitle] = React.useState('');
  const [anonymous, setAnonymous] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleCreate = async () => {
    try {
      await axios.post(`/forum/${courseId}/post/create`,
          {
            title: title,
            text: description,
            anonymous: anonymous,
            tag_id: tag,
            image_codes: [selectedImage],
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

  const [tags, setTags] = useState([]);
  useEffect(() => {
    async function handleGetTags() {
      try {
        await axios.get(`/forum/${courseSlug.split('-')[1]}/tags`,
          {
            withCredentials: true,
          }).then((response) => {
            setTags(response.data.tags);
          });
      } catch (error) {
        alert(error);
      }
    }
    handleGetTags();
  }, []);

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
              <h1>{courseCode + ' Create Forum Post'}</h1>
              <Box
                sx={{
                  border: 1,
                  padding: '2rem',
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Add a Title"
                  variant="outlined"
                  required
                  sx={{
                    height: '2rem',
                    width: '100%',
                  }}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <Box
                  sx={{
                    marginTop: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormControl
                    sx={{
                      width: '7rem',
                      minWidth: 200,
                      maxWidth: 300,
                    }}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">Tag</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="No Label Selected"
                      onChange={handleChange}
                    >
                      {tags.length === 0 ? (
                        <MenuItem disabled value="">
                          <em>None</em>
                        </MenuItem>
                      ) : (
                        tags.map((tag) => {
                          return (
                            <MenuItem key={tag.id} value={tag.id}>
                              <Box
                                sx={{
                                  width: '1rem',
                                  height: '1rem',
                                  bgcolor: `${tag.colour}`,
                                  borderRadius: '50%',
                                  margin: '0.5rem',
                                }}
                              />
                              <Box>{tag.name}</Box>
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </FormControl>
                  <Box
                    sx={{
                      marginRight: '1rem',
                    }}
                  >
                    {selectedImage && (
                      <Box
                        sx={{
                          display: 'flex',
                          height: '5rem',
                          width: '1rem',
                        }}
                      >
                        <img
                          alt="not found"
                          width={'250px'}
                          src={selectedImage}
                        />
                        <br />
                        <Button
                          onClick={() => setSelectedImage('')}
                          sx={{
                            textTransform: 'capitalize',
                          }}
                        >
                          <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1192_319)">
                              <path
                                d="M7.61161 2.11641L6.76339 3.28125H13.2366L12.3884 2.11641C12.3214 2.02617 12.2098 1.96875 12.0893 1.96875H7.90625C7.78571 1.96875 7.67411 2.02207 7.60714 2.11641H7.61161ZM14.1741 1.02539L15.8125 3.28125H18.9286C19.5223 3.28125 20 3.72012 20 4.26562C20 4.81113 19.5223 5.25 18.9286 5.25H18.5714V17.7188C18.5714 19.5316 16.9732 21 15 21H5C3.02679 21 1.42857 19.5316 1.42857 17.7188V5.25H1.07143C0.477679 5.25 0 4.81113 0 4.26562C0 3.72012 0.477679 3.28125 1.07143 3.28125H4.1875L5.82589 1.02129C6.29018 0.385547 7.07143 0 7.90625 0H12.0893C12.9241 0 13.7054 0.385547 14.1696 1.02129L14.1741 1.02539ZM3.57143 5.25V17.7188C3.57143 18.4447 4.20982 19.0312 5 19.0312H15C15.7902 19.0312 16.4286 18.4447 16.4286 17.7188V5.25H3.57143ZM7.14286 7.875V16.4062C7.14286 16.7672 6.82143 17.0625 6.42857 17.0625C6.03571 17.0625 5.71429 16.7672 5.71429 16.4062V7.875C5.71429 7.51406 6.03571 7.21875 6.42857 7.21875C6.82143 7.21875 7.14286 7.51406 7.14286 7.875ZM10.7143 7.875V16.4062C10.7143 16.7672 10.3929 17.0625 10 17.0625C9.60714 17.0625 9.28571 16.7672 9.28571 16.4062V7.875C9.28571 7.51406 9.60714 7.21875 10 7.21875C10.3929 7.21875 10.7143 7.51406 10.7143 7.875ZM14.2857 7.875V16.4062C14.2857 16.7672 13.9643 17.0625 13.5714 17.0625C13.1786 17.0625 12.8571 16.7672 12.8571 16.4062V7.875C12.8571 7.51406 13.1786 7.21875 13.5714 7.21875C13.9643 7.21875 14.2857 7.51406 14.2857 7.875Z"
                                fill="#A31010"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1192_319">
                                <rect width="20" height="21" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </Button>
                      </Box>
                    )}
                    <Button component="label">
                      <InputLabel
                        htmlFor="image_uploads"
                        variant="contained"
                        sx={{
                          textTransform: 'capitalize',
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                      >
                        + Upload Image
                      </InputLabel>
                      <input
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        onChange={(event) => {
                          fileToDataUrl(event.target.files[0])
                            .then((base64String) => {
                              setSelectedImage(base64String);
                            })
                            .catch((msg) => {
                              alert(msg);
                            });
                        }}
                        hidden
                      />
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: '1rem',
                    width: '100%',
                  }}
                >
                  <TextField
                    id="filled-multiline-static"
                    label="What do you want to talk about?"
                    placeholder="Why is my tutor so cool"
                    multiline
                    rows={10}
                    variant="filled"
                    sx={{
                      width: '100%',
                    }}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          onClick={(e) => {
                            setAnonymous(!anonymous);
                          }}
                        />
                      }
                      label="Post Anonymously?"
                    />
                    <Button
                      disabled={isClicked}
                      onClick={() => {
                        if (!isClicked) setIsClicked(true);
                        handleCreate();
                      }}
                    >
                      Post
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default CreatePost;