import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';

const CreateCourseModal = (props) => {
  const { open, setOpen } = props;
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseTerm, setCourseTerm] = useState('');

  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newCourseData = {
      courseCode,
      courseName,
      courseTerm,
    };

    try {
      await props.handleSubmit(newCourseData);
      setCourseCode('');
      setCourseName('');
      setCourseTerm('');
      setOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '1rem',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
            padding: '40px',
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
          >
            Create a New Course
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Course Code
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Type here"
              sx={{
                width: 500,
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Course Name
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Type here"
              sx={{
                width: 500,
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Course Term
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Type here"
              sx={{
                width: 500,
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
              value={courseTerm}
              onChange={(e) => setCourseTerm(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: '#70cde0',
                width: 200,
                height: 40,
                textTransform: 'none',
                mt: 5,
                mb: 2,
              }}
            >
              Publish Course
            </Button>
            <Button
              onClick={handleCancel}
              sx={{
                color: 'white',
                bgcolor: '#FFBC6C',
                textTransform: 'none',
                width: 200,
                height: 40,
                '&:hover': {
                  backgroundColor: '#FF8A80',
                },
                mt: 5,
                mb: 2,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCourseModal;