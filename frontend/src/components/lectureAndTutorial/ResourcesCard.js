import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Link, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import * as React from 'react';
import UpdateCourseContentForm from './UpdateContentForm';

const ResourcesCard = ({
  week,
  weekResource,
  isStaff,
  courseId,
  lessonId,
  updated,
  setUpdated,
  setOpenSuccessSnackbar,
  setOpenWarningSnackbar,
  setWarningMessage,
  downloadResource,
}) => {
  return (
    <Box sx={{ mb: '1rem' }}>
      <Accordion
        disableGutters
        sx={{
          border: '#5AC2D9',
          '&.MuiAccordion-root': {
            borderRadius: '0.5rem',
            border: 'solid',
            borderColor: '#5AC2D9',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{
            '&.MuiAccordionSummary-root': {
              borderRadius: '0.2rem',
              bgcolor: '#5AC2D9',
            },
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Week {week}
        </AccordionSummary>
        <AccordionDetails>
          {weekResource.map((topic) => {
            return (
              <Box>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    bgcolor: '#EDF7F9',
                    color: '#3696AC',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: '0.5rem',
                    height: '3rem',
                  }}
                >
                  {topic.name}
                  {isStaff === 'staff' && (
                    <AccordionActions>
                      <UpdateCourseContentForm
                        setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                        setOpenWarningSnackbar={setOpenWarningSnackbar}
                        setWarningMessage={setWarningMessage}
                        oldWeek={week}
                        oldTopic={topic.name}
                        oldLink={topic.recording}
                        topicId={topic.id}
                        lessonId={lessonId}
                        courseId={courseId}
                        updated={updated}
                        setUpdated={setUpdated}
                        files={topic.files}
                      />
                    </AccordionActions>
                  )}
                </Typography>
                <Typography padding={'0.5rem'} fontWeight={'bold'}>
                  Recording
                </Typography>
                <Box sx={{ paddingX: '0.5rem' }}>
                  {topic.recording ? (
                    <a href={topic.recording} target="_blank">
                      Video
                    </a>
                  ) : (
                    'N/A'
                  )}
                </Box>
                <Typography padding={'0.5rem'} fontWeight={'bold'}>
                  Resources
                </Typography>
                <Box
                  sx={{
                    paddingX: '0.5rem',
                    paddingBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {topic.files.map((file) => {
                    return (
                      <Link
                        variant="body2"
                        onClick={() => {
                          downloadResource(topic.id, file[0]);
                        }}
                      >
                        {file[1]}
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResourcesCard;