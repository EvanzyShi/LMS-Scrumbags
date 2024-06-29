import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import * as React from 'react';
import ReactPlayer from 'react-player';
import UploadLink from './UploadLink';

const LiveClass = (props) => {
  const { isStaff, courseId } = props;
  const small = useMediaQuery('(max-width:1500px)');

  const [url, setUrl] = React.useState('');
  const [videoId, setVideoId] = React.useState('');
  const [uploaded, setUploaded] = React.useState(false);

  const getLiveClassLink = async () => {
    try {
      let response = await axios.get(`/courses/${courseId}`, {
        withCredentials: true,
      });
      setUrl(response.data.course.url);
      if (response.data.course.url !== null) {
        setVideoId(response.data.course.url.split('watch?v=')[1]);
      }
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    getLiveClassLink();
  }, [uploaded]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {isStaff === 'staff' && (
        <UploadLink
          courseId={courseId}
          setUploaded={setUploaded}
          uploaded={uploaded}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          sx={{
            paddingRight: small ? '' : '1rem',
            width: '70%',
            boxSizing: 'border-box',
          }}
        >
          {url === null && (
            <Box
              width={'100%'}
              height={'100%'}
              sx={{
                bgcolor: '#dbdbdb',
                borderRadius: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">There is no live class</Typography>
            </Box>
          )}
          <ReactPlayer width={'100%'} height={'100%'} url={url} />
        </Box>
        <Box
          sx={{
            width: small ? '70%' : '28%',
            boxSizing: 'border-box',
            minWidth: '15rem',
          }}
        >
          <iframe
            width={'100%'}
            height={'100%'}
            src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=127.0.0.1`}
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveClass;