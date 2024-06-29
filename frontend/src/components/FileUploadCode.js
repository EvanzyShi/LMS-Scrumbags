import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';
import axios from 'axios';
import React, { useRef, useState } from 'react';

const FileUpload = ({ type, onFileChange }) => {
  const inputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('select');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      onFileChange(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = '';
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus('select');
  };

  const handleUpload = async () => {
    if (uploadStatus === 'done') {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(
        'http://localhost:8000/api/upload',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setUploadStatus('done');
    } catch (error) {
      setUploadStatus('select');
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {type === 'coverPhoto' && (
        <Button
          variant='outlined'
          component='label'
          sx={{
            display: 'flex',
            width: 300,
            height: 125,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textTransform: 'none',
            ':hover': {
              backgroundColor: '#ffeded',
            },
          }}
          onClick={onChooseFile}
          startIcon={<CloudUploadIcon />}
        >
          Upload Cover Image
        </Button>
      )}
      {type === 'contentFile' && (
        <Button
          variant='outlined'
          component='label'
          sx={{
            borderColor: '#C13D3D',
            color: '#C13D3D',
            ml: 7,
            textTransform: 'none',
            ':hover': {
              bgcolor: '#ffeded',
            }
          }}
          onClick={onChooseFile}
        >
          Upload Content File
          <input type='file' hidden />
        </Button>
      )}
      {selectedFile && (
        <>
          <div className='file-card'>
            <span className='material-symbols-outlined icon'>description</span>

            <div className='file-info'>
              <div style={{ flex: 1 }}>
                <h6>{selectedFile?.name}</h6>

                <div className='progress-bg'>
                  <div className='progress' style={{ width: `${progress}%` }} />
                </div>
              </div>

              {uploadStatus === 'select' ? (
                <button onClick={clearFileInput}>
                  <span className='material-symbols-outlined close-icon'>
                    close
                  </span>
                </button>
              ) : (
                <div className='check-circle'>
                  {uploadStatus === 'uploading' ? (
                    `${progress}%`
                  ) : uploadStatus === 'done' ? (
                    <span
                      className='material-symbols-outlined'
                      style={{ fontSize: '20px' }}
                    >
                      check
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
          <button className='upload-btn' onClick={handleUpload}>
            {uploadStatus === 'select' || uploadStatus === 'uploading' ? 'Upload' : 'Done'}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;