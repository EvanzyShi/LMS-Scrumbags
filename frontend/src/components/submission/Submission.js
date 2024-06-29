import { Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import JSZip from 'jszip';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import getStaff from '../../helpers/getStaff';
import CoursePageTemplate from '../course/CoursePageTemplate';

const Submissions = (props) => {
  const { tabbedCourses, setTabbedCourses } = props;
  const { courseSlug, assignmentId, submissionId } = useParams();
  const navigate = useNavigate();
  const [isStaff, setIsStaff] = React.useState(null);
  const [gradeValue, setGradeValue] = React.useState('');
  const [feedbackValue, setFeedbackValue] = React.useState('');
  const [studentSubmissionData, setStudentSubmissionData] = React.useState(null);
  const [fileIds, setFileIds] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [feedbackFiles, setFeedbackFiles] = React.useState([]);
  const inputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState(null);

  // teacher gets student's submission detail
  const getStudentSubmissionData = async () => {
    try {
      const response = await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/submission/${submissionId}/mark`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setStudentSubmissionData(response.data);
    } catch (error) {
    }
  };

  // student see their own submission detail
  const getGradedSubmission = async () => {
    try {
      let response = await axios.get(
        `course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/feedback`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setStudentSubmissionData(response.data);
    } catch (error) {
      alert(error);
    }
  };

  // teacher to download student's assignment submissions
  const downloadZip = async (assignmentId, submissionId, fileIds, fileName) => {
    try {
      const zip = new JSZip();
      // Send multiple requests concurrently
      const responses = await Promise.all(
        fileIds.map((fileId) =>
          axios.get(
            `/course/${
              courseSlug.split('-')[1]
            }/assessments/assignments/${assignmentId}/submission/${submissionId}/${fileId}`,
            {
              withCredentials: true,
              responseType: 'arraybuffer',
            }
          )
        )
      );

      responses.forEach((response, index) => {
        const fileName = studentSubmissionData.files[index][1];
        if (response && response.data) {
          zip.file(fileName, response.data, { binary: true });
        } else {
          alert('Failed to get data for file:', fileName);
        }
      });

      const blob = await zip.generateAsync({ type: 'blob' });

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert('Failed to download files. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (
      studentSubmissionData &&
      studentSubmissionData.files &&
      studentSubmissionData.files.length > 0
    ) {
      const fileIds = studentSubmissionData.files.map((file) => file[0]);
      await downloadZip(assignmentId, submissionId, fileIds);
    } else {
      alert('No files found to download.');
    }
  };

  // Student to download feedback
  const handleDownloadFeedback = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/submission/${
          studentSubmissionData.submission_id
        }/${fileId}`,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to download file. Please try again.');
    }
  };

  // Teacher submitting student's feedback form with updated grade, feedback
  // + feedback file i.e student's assignment annotated
  const handleSaveChanges = async (
    grade,
    feedback,
    fileIds,
    assignmentId,
    submissionId
  ) => {
    try {
      const formData = new FormData();
      formData.append('grade', grade);
      formData.append('feedback', feedback);
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append('files', uploadedFiles[i]);
      }

      // Clear previous feedback files
      for (let i = 0; i < feedbackFiles.length; i++) {
        formData.append('feedbackFiles', feedbackFiles[i]);
      }
      setFeedbackFiles([]);

      const response = await axios.put(
        `/course/${
          courseSlug.split('-')[1]
        }/assessments/assignments/${assignmentId}/submission/${submissionId}/mark`,
        formData,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );

      // Check if the status is not already "Graded"
      if (studentSubmissionData.status !== 'Graded') {
        setStudentSubmissionData((prevState) => ({
          ...prevState,
          status: 'Graded',
        }));
      }

      setStudentSubmissionData(response.data);
      navigate(`/course/${courseSlug}/submissions/assignment/${assignmentId}`);
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (isStaff === 'staff') {
      setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
      setSelectedFile(file);
      if (!fileIds) {
        setFileIds([]);
      }
      if (file.name) {
        setFileIds((prevFileIds) => [...prevFileIds, file.name]);
      } else {
        console.error('File name is not available.');
      }
    }
  };

  const handleDeleteFile = (fileName) => {
    // Reset selectedFile if the deleted file was the selected file
    if (selectedFile && selectedFile.name === fileName) {
      setSelectedFile(null);
    }
  };

  React.useEffect(() => {
    if (studentSubmissionData) {
      setGradeValue(studentSubmissionData.grade || '');
      setFeedbackValue(studentSubmissionData.feedback || '');
    }
  }, [studentSubmissionData]);

  React.useEffect(() => {
    if (studentSubmissionData && studentSubmissionData.files) {
      const files = studentSubmissionData.files.map((file) => ({
        id: file[0],
        name: file[1],
      }));
      setFeedbackFiles(files);
    }
  }, [studentSubmissionData]);

  React.useEffect(() => {
    getStaff(setIsStaff);
    if (submissionId !== undefined) {
      getStudentSubmissionData();
    } else {
      getGradedSubmission();
    }
  }, []);

  return (
    <>
      <CoursePageTemplate
        tabbedCourses={tabbedCourses}
        setTabbedCourses={setTabbedCourses}
        page={'Submissions'}
        isStaff={isStaff}
        pageContent={
          <>
            {isStaff === 'staff' && (
              <Typography
                variant="h4"
                sx={{
                  marginBottom: 2,
                }}
              >
                Submission Marking
              </Typography>
            )}
            {isStaff === 'student' && (
              <Typography
                variant="h5"
                sx={{
                  marginBottom: 2,
                }}
              >
                Submission Feedback
              </Typography>
            )}
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                overflowY: 'scroll',
                maxHeight: '65vh',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: 2,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  {isStaff === 'staff' && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                      }}
                      aria-label="Download"
                      onClick={handleDownload}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}

                  <Typography
                    variant="h7"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Assignment Submission Details
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '12px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      {studentSubmissionData && (
                        <Typography variant="body1">
                          Student: {studentSubmissionData.student_name}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body1">
                        Time Submitted:{' '}
                        {studentSubmissionData &&
                          studentSubmissionData.submission_date}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body1">
                        Submission Status:{' '}
                        {studentSubmissionData && studentSubmissionData.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h7"
                    sx={{
                      marginTop: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Grade
                  </Typography>
                  <Box
                    sx={{
                      marginBottom: 1,
                    }}
                  >
                    {isStaff === 'staff' && (
                      <Select
                        value={gradeValue}
                        onChange={(e) => setGradeValue(e.target.value)}
                        sx={{
                          marginTop: '16px',
                          width: '200px',
                        }}
                      >
                        <MenuItem value="">
                          <em>? /100</em>
                        </MenuItem>
                        {Array.from({ length: 1001 }, (_, i) => (
                          <MenuItem key={i / 10} value={i / 10}>
                            {i / 10}/100
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {isStaff === 'student' && (
                      <Typography
                        variant="body1"
                        sx={{
                          marginTop: '16px',
                          width: '200px',
                          padding: '8px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          textAlign: 'center',
                        }}
                      >
                        {gradeValue ? `${gradeValue}/100` : 'No grade'}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h7"
                    sx={{
                      marginTop: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Feedback and Rubric Attachments
                  </Typography>
                  {isStaff === 'staff' && (
                    <Box
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      <input
                        type="file"
                        ref={inputRef}
                        onClick={handleUploadClick}
                        onChange={handleFileChange}
                        style={{
                          display: 'none',
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => inputRef.current.click()}
                        sx={{
                          marginTop: '16px',
                          width: '300px',
                          textTransform: 'none',
                          marginBottom: 3,
                          color: '#70cde0',
                          borderColor: '#70cde0',
                          '&:hover': {
                            backgroundColor: '#70cde0',
                            color: '#ffffff',
                            borderColor: '#70cde0',
                          },
                        }}
                      >
                        Upload Feedback Files
                      </Button>
                      {selectedFile && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#900001',
                          }}
                        >
                          <Typography>
                            File slected: {selectedFile.name}
                          </Typography>
                          <IconButton
                            onClick={() => handleDeleteFile(selectedFile.name)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                      {feedbackFiles.length > 0 && (
                        <Box>
                          <Typography
                            variant="h7"
                            sx={{
                              color: '#4783c9',
                              fontWeight: 'bold',
                            }}
                          >
                            Uploaded Files:
                          </Typography>
                          <ul>
                            {feedbackFiles.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Box>
                  )}
                  {isStaff === 'student' &&
                    studentSubmissionData &&
                    studentSubmissionData.files &&
                    studentSubmissionData.files.length > 0 && (
                      <Box sx={{ marginTop: '13px' }}>
                        <Typography
                          variant="h7"
                          sx={{
                            color: '#4783c9',
                            marginTop: '200px',
                          }}
                        >
                          Download Your Marked Assignment Feedback Attached
                          Below
                        </Typography>
                        <ul>
                          {studentSubmissionData.files.map((file, index) => {
                            return (
                              <li key={index}>
                                <a
                                  href="#"
                                  onClick={() =>
                                    handleDownloadFeedback(file[0], file[1])
                                  }
                                >
                                  {file[1]}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </Box>
                    )}
                  <Box
                    sx={{
                      marginBottom: 1,
                    }}
                  >
                    <TextField
                      placeholder="Type comment here ..."
                      value={feedbackValue}
                      onChange={(e) => setFeedbackValue(e.target.value)}
                      InputProps={{
                        readOnly: isStaff === 'student',
                      }}
                      sx={{
                        marginTop: '16px',
                        width: '100%',
                        maxWidth: '800px',
                      }}
                      multiline
                      rows={4}
                    />
                  </Box>
                  {isStaff === 'staff' && (
                    <Box
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Notify Student"
                      />
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '20px',
                  }}
                >
                  {isStaff === 'staff' && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        const gradeValueInt = parseInt(gradeValue, 10);
                        handleSaveChanges(
                          gradeValueInt,
                          feedbackValue,
                          fileIds,
                          assignmentId,
                          submissionId
                        );
                      }}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: 'transparent',
                        color: '#70cde0',
                        border: '1px solid #70cde0',
                        '&:hover': {
                          backgroundColor: '#70cde0',
                          color: '#ffffff',
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (isStaff === 'staff') {
                        navigate(
                          `/course/${courseSlug}/submissions/assignment/${assignmentId}`
                        );
                      } else {
                        navigate(`/course/${courseSlug}/assessments`);
                      }
                    }}
                    sx={{
                      textTransform: 'none',
                      color: '#FFBC6C',
                      border: '1px solid #FFBC6C',
                      '&:hover': {
                        backgroundColor: '#FFBC6C',
                        color: '#ffffff',
                        borderColor: '#FFBC6C',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        }
      />
    </>
  );
};

export default Submissions;