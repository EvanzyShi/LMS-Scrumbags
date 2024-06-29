import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import getCookie from '../../helpers/getCookie';

const UpdateCourseContentForm = ({
  setOpenSuccessSnackbar,
  setOpenWarningSnackbar,
  setWarningMessage,
  oldWeek,
  oldTopic,
  oldLink,
  topicId,
  lessonId,
  courseId,
  updated,
  setUpdated,
  files,
}) => {
  const [week, setWeek] = useState('');
  const [topic, setTopic] = useState('');
  const [recordingLink, setRecordingLink] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentResources, setCurrentResources] = useState(files);
  const inputRef = useRef();

  const [updating, setUpdating] = React.useState(false);

  const isTabletOrMobile = useMediaQuery('(max-width:520px)');

  const updateRequest = async () => {
    setUpdating(true);

    try {
      var formData = new FormData();
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append('files', uploadedFiles[i]);
      }

      if (uploadedFiles.length > 0) {
        await axios.post(
          `/course/${courseId}/lesson/${lessonId}/resources/${topicId}/upload`,
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

      await axios.put(
        `/course/${courseId}/lesson/${lessonId}/resources/${topicId}/update`,
        {
          week: week,
          topic: topic,
          recording: recordingLink,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setUpdated(!updated);
      setOpenModal(false);
      setUpdating(false);
      resetForm();
      setOpenSuccessSnackbar(true);
    } catch (error) {
      setWarningMessage(error);
    }
  };

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleUploadFiles = (files) => {
    // copy the uploaded files
    const uploaded = [...uploadedFiles];
    files.some((file) => {
      // prevent same file name to be uploaded twice
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
      setUploadedFiles(uploaded);
    });
  };

  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleDelete = async (topicId, fileId) => {
    try {
      await axios.delete(
        `/course/${courseId}/lesson/${lessonId}/resources/${topicId}/${fileId}/delete`,
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      setCurrentResources(
        currentResources.filter((file) => file[0] !== fileId)
      );
    } catch (error) {
      alert(error);
    }
  };

  // sets all the state variables to the current details
  const resetForm = () => {
    setWeek(oldWeek);
    setTopic(oldTopic);
    setUploadedFiles([]);
    setRecordingLink(oldLink);
  };

  const handleCancel = () => {
    setUploadedFiles(null);
    setOpenModal(false);
    resetForm();
    setOpenWarningSnackbar(true);
    setWarningMessage('Update Course Form submission canceled');
  };

  React.useEffect(() => {
    resetForm();
  }, []);

  const formContent = (
    <Box
      sx={{
        borderRadius: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        height: '70vh',
        width: isTabletOrMobile ? 'fit-content' : '25rem',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        enctype="multipart/form-data"
      />
      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
        Update Course Content
      </Typography>
      <Grid container spacing={2} direction="column">
        <Grid item sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ marginRight: '20px' }}>
            Week
          </Typography>
          <TextField
            variant="outlined"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            inputProps={{
              style: { height: '20px', padding: '4px', borderRadius: '8px' },
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Topic
          </Typography>
          <TextField
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ width: '100%', height: '58px' }}
          />
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ mb: 1.5, width: '100%' }}>
            Recording Link
          </Typography>
          <TextField
            variant="outlined"
            value={recordingLink}
            onChange={(e) => setRecordingLink(e.target.value)}
            sx={{ width: '100%', height: '58px' }}
          />
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Slides/Extra Reading Attachments
          </Typography>
          <Box
            onClick={handleUploadClick}
            sx={{
              width: '100%',
              height: '149px',
              border: '1px solid #797979',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5AC2D9',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <Typography>Upload Here</Typography>
            <CloudUploadIcon sx={{ fontSize: '48px', color: '#5AC2D9' }} />
          </Box>
          {uploadedFiles.map((file) => {
            return <Typography>{file.name}</Typography>;
          })}
        </Grid>
        <Grid item>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Current Resources
          </Typography>
          <List>
            {currentResources.map((file) => {
              return (
                <ListItem
                  sx={{ padding: '0' }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        handleDelete(topicId, file[0]);
                      }}
                      sx={{ '&:hover': { color: '#d53c3c' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file[1]} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid
          item
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
          }}
        >
          <Button
            disabled={updating ? true : false}
            variant="outlined"
            color="error"
            onClick={handleCancel}
            sx={{
              borderRadius: '10px',
              width: '127px',
              height: '35px',
              mb: 5,
              mr: '1rem',
            }}
          >
            Cancel
          </Button>
          {!updating && (
            <Button
              variant="contained"
              onClick={updateRequest}
              sx={{
                backgroundColor: '#597795',
                borderRadius: '10px',
                width: '127px',
                height: '35px',
                mb: 5,
              }}
            >
              Update
            </Button>
          )}
          {updating && (
            <Button
              disabled
              variant="contained"
              onClick={updateRequest}
              sx={{
                backgroundColor: '#597795',
                textTransform: 'none',
                borderRadius: '10px',
                width: '127px',
                height: '35px',
                mb: 5,
              }}
            >
              UPDATING
              <Box sx={{ width: '1rem' }} />
              <CircularProgress color="inherit" size={'1rem'} />
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      <IconButton onClick={() => setOpenModal(true)}>
        <EditIcon />
      </IconButton>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateCourseContentForm;