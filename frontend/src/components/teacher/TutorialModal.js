import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';

const TutorialModal = ({ open, onClose, onSubmit }) => {
  const [tutorialCode, setTutorialCode] = useState('');

  const handleSubmit = () => {
    onSubmit(tutorialCode);
    setTutorialCode('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 0, right: 1 }}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
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
            onClick={handleSubmit}
            sx={{ textTransform: 'none', bgcolor: '#70cde0', display: 'inline-block' }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TutorialModal;