import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';
import SuccessSnackbar from '../SuccessSnackbar';

const UploadLink = (props) => {
  const { setUploaded, uploaded } = props;
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const { courseSlug } = useParams();
  const upload = async () => {
    const url = document.getElementById('url-input').value;
    try {
      await axios.put(
        `/courses/${courseSlug.split('-')[1]}/add-class`,
        {
          url: url,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );
      // uploaded sucessfully snackbar?
      // update the video
      setOpenSnackbar(true);
      setUploaded(!uploaded);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
      }}
    >
      <SuccessSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        msg={'Live class uploaded successfully!'}
      />
      <Typography variant="h5" textAlign={'center'}>
        Please upload the live YouTube link for the class
      </Typography>
      <Box
        sx={{
          display: 'flex',
          paddingTop: '1rem',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <TextField
          sx={{ width: '70%', marginBottom: '1rem' }}
          id="url-input"
          label="Enter link here"
          variant="outlined"
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onClick={upload}
          sx={{ bgcolor: '#5AC2D9', minWidth: '10rem', marginBottom: '1rem' }}
        >
          Upload link
        </Button>
      </Box>
    </Box>
  );
};

export default UploadLink;