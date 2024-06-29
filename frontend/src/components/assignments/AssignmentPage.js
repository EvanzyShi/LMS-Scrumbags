import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Link, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';

const QuizQuestionsPage = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const { courseSlug, assignmentId } = useParams();
  const navigate = useNavigate();

  const [isStaff, setIsStaff] = React.useState(null);

  const [files, setFiles] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState(new Date());
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getInfo = async () => {
    try {
      let response = await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}`,
        {
          withCredentials: true,
        }
      );
      setFiles(response.data.files);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setDueDate(response.data.dueDate);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    try {
      var formData = new FormData();
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append('files', uploadedFiles[i]);
      }

      if (uploadedFiles.length > 0) {
        await axios.put(
          `/course/${
            courseSlug.split('-')[1]
          }/assessments/assignments/${assignmentId}/submit`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        );
      }
      navigate(`/course/${courseSlug}/assessments`);
    } catch (error) {
      alert(error);
    }
  };

  const downloadResource = async (fileId) => {
    try {
      await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/${fileId}/download`,
        {
          withCredentials: true,
        }
      );
      window.location.href = `http://127.0.0.1:8000/course/${
        courseSlug.split('-')[1]
      }/assessments/assignments/${assignmentId}/${fileId}/download`;
      alert('Successfully downloaded');
    } catch (error) {
      alert(error);
    }
  };

  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setSelectedFiles(chosenFiles);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  React.useEffect(() => {
    getInfo();
    getStaff(setIsStaff);
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        isStaff={isStaff}
        page={'Assessments'}
        pageContent={
          <Box
            display="flex"
            flexDirection={'column'}
            gap="1rem"
            overflow="auto"
          >
            <Box
              sx={{
                width: '100%',
                justifyContent: 'center',
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  mt: 2,
                  mb: 2,
                }}
              >
                {title}
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
              }}
            >
              Assignment Description
            </Typography>
            <Box
              sx={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#edf7f9',
                borderRadius: 4,
                minHeight: '10rem',
                maxHeight: '20rem',
                overflow: 'auto',
              }}
            >
              <Typography
                sx={{
                  margin: '1rem',
                }}
              >
                {description}
              </Typography>
            </Box>
            <Box
              sx={{
                overflow: 'auto',
                maxHeight: '10rem',
              }}
            >
              <Typography
                variant="h7"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                Assignment Files Attachments:
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  marginBottom: '12px',
                }}
              >
                Please download these files for more information.
              </Typography>
              {files.map((file) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '2.5rem',
                    }}
                  >
                    {isStaff === 'staff' && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // deleteResource(topic.id, file[0]);
                        }}
                        sx={{
                          width: '7rem',
                          height: '2.1rem',
                          bgcolor: '#FF0300',
                          borderRadius: '0.5rem',
                          color: 'white',
                          marginRight: '1rem',
                          '&:hover': {
                            backgroundColor: '#FF3633',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    )}
                    <Link
                      variant="body2"
                      onClick={() => {
                        downloadResource(file[0]);
                      }}
                    >
                      {file[1]}
                    </Link>
                  </Box>
                );
              })}
            </Box>
            {isStaff === 'student' && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        mt: 2,
                        mb: 2,
                        width: '100%',
                        textTransform: 'none',
                        backgroundColor: '#70cde0',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#4a90e2',
                        },
                      }}
                    >
                      Upload Submission
                      <input
                        type="file"
                        onChange={handleFileChange}
                        hidden
                        enctype="multipart/form-data"
                      />
                    </Button>
                    {selectedFiles.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Typography variant="body2">{file.name}</Typography>
                        <IconButton
                          sx={{
                            color: 'error.main',
                          }}
                          onClick={() => handleDeleteFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ width: '200px' }}>
                      <Button
                        onClick={handleSubmit}
                        sx={{
                          mt: 2,
                          mb: 2,
                          width: '100%',
                          backgroundColor: '#FFBC6C',
                          textTransform: 'none',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#fa8b02',
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        }
      />
    </>
  );
};

export default QuizQuestionsPage;