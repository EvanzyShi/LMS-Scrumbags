import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import getCookie from '../../helpers/getCookie';
import SuccessSnackbar from '../SuccessSnackbar';
import WarningSnackbar from '../WarningSnackbar';

const AddTopicModal = (props) => {
  const { open, setOpen, courseId, lessonId, update, setUpdate } = props;
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const handleClose = () => setOpen(false);

  const addNewTopic = async () => {
    const week = document.getElementById('week-input').value;
    const topic = document.getElementById('topic-input').value;
    const recording = document.getElementById('recording-input').value;

    try {
      await axios.post(`/course/${courseId}/lesson/${lessonId}/resources/new`,
        {
          week: week,
          topic: topic,
          recording: recording,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      ).then((response) => {
        setUpdate(!update);
        handleClose();
        setOpenSnackbar(true);
      });
    } catch (error) {
      setOpenWarningSnackbar(true);
    }
  };

  return (
    <div>
      <SuccessSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        msg={'New topic added!'}
      />
      <WarningSnackbar
        open={openWarningSnackbar}
        setOpen={setOpenWarningSnackbar}
        msg={'Could not add new topic'}
      />
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
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: '1rem',
            border: 'solid',
            borderColor: '#5AC2D9',
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Topic MODAL
          </Typography>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField margin="dense" id="week-input" label="Week" />
            <TextField margin="dense" id="topic-input" label="Topic" />
            <TextField
              margin="dense"
              id="recording-input"
              label="Recording Link"
            />
          </Box>
          <Button variant="outlined" onClick={() => addNewTopic()}>
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddTopicModal;