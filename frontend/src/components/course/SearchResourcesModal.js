import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Link } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import SuccessSnackbar from '../SuccessSnackbar';
import WarningSnackbar from '../WarningSnackbar';

const SearchResourcesModal = ({ open, setOpen, searchValue, results }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const handleClose = () => setOpen(false);

  const { courseSlug } = useParams();

  const downloadResource = async (topicId, fileId) => {
    try {
      await axios.get(
        `course/${courseSlug.split('-')[1]}/file/${fileId}/download`,
        {
          withCredentials: true,
        }
      );
      window.location.href = `http://127.0.0.1:8000/course/${
        courseSlug.split('-')[1]
      }/file/${fileId}/download`;
      setOpen(false);
      setOpenSnackbar(true);
    } catch (error) {
      setOpenWarningSnackbar(true);
    }
  };

  return (
    <div>
      <SuccessSnackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        msg={'Successfully downloaded!'}
      />
      <WarningSnackbar
        open={openWarningSnackbar}
        setOpen={setOpenWarningSnackbar}
        msg={'Could not download file'}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Search Results {`'${searchValue}'`}:
            </Typography>
            <IconButton
              type="button"
              aria-label="search"
              sx={{ padding: '0', mt: '-2rem', mr: '-1rem' }}
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon sx={{ padding: 'none' }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '50vh',
              overflowY: 'scroll',
              justifyContent: Object.keys(results).length === 0 ? 'center' : '',
            }}
          >
            {Object.keys(results).length === 0 && (
              <Typography textAlign={'center'}>No Results</Typography>
            )}
            {Object.keys(results).map((topic) => {
              return (
                <>
                  <Typography fontWeight={'bold'}>{topic}</Typography>
                  {results[topic].map((file) => {
                    return (
                      <Link
                        sx={{ pl: '1rem' }}
                        variant="body2"
                        onClick={() => {
                          downloadResource(file.reference_id, file.id);
                        }}
                      >
                        {file.filename}
                      </Link>
                    );
                  })}
                </>
              );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchResourcesModal;