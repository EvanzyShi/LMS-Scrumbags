import {
  Box,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  useMediaQuery,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import SuccessSnackbar from '../SuccessSnackbar';
import WarningSnackbar from '../WarningSnackbar';
import AddTopicModal from './AddTopicModal';
import ResourcesCard from './ResourcesCard';
import UpdateCourseContentForm from './UpdateContentForm';

const HeadingCell = styled(TableCell)(() => ({
  '&.MuiTableCell-root': {
    background: '#5AC2D9',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
}));

const LectureResources = (props) => {
  const { isStaff } = props;
  const [openTopicModal, setOpenTopicModal] = React.useState(false);
  const [resources, setResources] = React.useState({});
  const [lessonId, setLessonId] = React.useState(null);
  const [updated, setUpdated] = React.useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [openWarningSnackbar, setOpenWarningSnackbar] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState('');

  const { courseSlug } = useParams();

  const isTabletOrMobile = useMediaQuery('(max-width:1044px)');

  const getResources = async () => {
    try {
      let response = await axios.get(
        `course/${courseSlug.split('-')[1]}/lecture/resources`,
        {
          withCredentials: true,
        }
      );
      setLessonId(response.data.lesson_id);
      setResources(response.data.weeks);
    } catch (error) {
      alert(error);
    }
  };

  const downloadResource = async (topicId, fileId) => {
    try {
      await axios.get(
        `/course/${courseSlug.split('-')[1]}/lesson/${lessonId}/resources/${topicId}/${fileId}/download`,
        {
          withCredentials: true,
        }
      );
      window.location.href = `http://127.0.0.1:8000/course/${
        courseSlug.split('-')[1]
      }/lesson/${lessonId}/resources/${topicId}/${fileId}/download`;
    } catch (error) {
      alert(error);
    }
  };

  React.useEffect(() => {
    getResources();
  }, [updated, courseSlug]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        <SuccessSnackbar
          open={openSuccessSnackbar}
          setOpen={setOpenSuccessSnackbar}
          msg={'Successfully updated'}
        />
        <WarningSnackbar
          open={openWarningSnackbar}
          setOpen={setOpenWarningSnackbar}
          msg={warningMessage}
        />
        {isStaff === 'staff' && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              boxSizing: 'border-box',
              marginBottom: '1rem',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setOpenTopicModal(true);
              }}
              sx={{
                width: '9rem',
                height: '3rem',
                bgcolor: '#FFBC6C',
                borderRadius: '0.5rem',
                color: 'black',
                marginRight: '1rem',
                '&:hover': {
                  backgroundColor: '#b57b36',
                  color: 'white',
                },
              }}
            >
              + Add Topic
            </Button>
          </Box>
        )}
        {!isTabletOrMobile && (
          <TableContainer
            component={Paper}
            sx={{ overflowY: 'scroll', height: '60vh' }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <HeadingCell>Week</HeadingCell>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <HeadingCell align="left" width={'50%'}>
                      Topic
                    </HeadingCell>
                    <HeadingCell align="left" width={'40%'}>
                      Recording
                    </HeadingCell>
                    <HeadingCell align="left" width={'50%'}>
                      Resources
                    </HeadingCell>
                  </Box>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(resources).map((week) => {
                  return (
                    <TableRow
                      key={week}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {week}
                      </TableCell>
                      {/* topics */}
                      <TableCell align="left" width={'100%'}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {resources[week].map((topic, index) => {
                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  borderBottom:
                                    resources[week].length - 1 === index
                                      ? ''
                                      : 'solid 1px',
                                  borderColor: '#e0e0e0',
                                  boxSizing: 'border-box',
                                  paddingY: '0.5rem',
                                  alignItems: 'center',
                                }}
                              >
                                <Box sx={{ width: '40%' }}>{topic.name}</Box>
                                <Box sx={{ width: '30%' }}>
                                  {topic.recording ? (
                                    <a href={topic.recording} target="_blank">
                                      Video
                                    </a>
                                  ) : (
                                    'N/A'
                                  )}
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '30%',
                                  }}
                                >
                                  {topic.files.length === 0 ? 'N/A' : ''}
                                  {topic.files.map((file) => {
                                    return (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          height: '2.5rem',
                                        }}
                                      >
                                        <Link
                                          variant="body2"
                                          onClick={() => {
                                            downloadResource(topic.id, file[0]);
                                          }}
                                        >
                                          {file[1]}
                                        </Link>
                                      </Box>
                                    );
                                  })}
                                </Box>
                                {isStaff === 'staff' && (
                                  <UpdateCourseContentForm
                                    setOpenSuccessSnackbar={
                                      setOpenSuccessSnackbar
                                    }
                                    setOpenWarningSnackbar={
                                      setOpenWarningSnackbar
                                    }
                                    setWarningMessage={setWarningMessage}
                                    oldWeek={week}
                                    oldTopic={topic.name}
                                    oldLink={topic.recording}
                                    topicId={topic.id}
                                    lessonId={lessonId}
                                    courseId={courseSlug.split('-')[1]}
                                    updated={updated}
                                    setUpdated={setUpdated}
                                    files={topic.files}
                                  />
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {isTabletOrMobile && (
          <Box sx={{ width: '100%', height: '60vh', overflowY: 'scroll' }}>
            {Object.keys(resources).map((week) => {
              return (
                <ResourcesCard
                  week={week}
                  weekResource={resources[week]}
                  isStaff={isStaff}
                  courseId={courseSlug.split('-')[1]}
                  lessonId={lessonId}
                  updated={updated}
                  setUpdated={setUpdated}
                  setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                  setOpenWarningSnackbar={setOpenWarningSnackbar}
                  setWarningMessage={setWarningMessage}
                  downloadResource={downloadResource}
                />
              );
            })}
          </Box>
        )}
      </Box>
      <AddTopicModal
        open={openTopicModal}
        setOpen={setOpenTopicModal}
        courseId={courseSlug.split('-')[1]}
        lessonId={lessonId}
        update={updated}
        setUpdate={setUpdated}
      />
    </>
  );
};

export default LectureResources;