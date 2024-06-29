import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TutorialCard = ({ tutorialCode, courseSlug, onDelete, tutorialId, isStaff }) => {
  const navigate = useNavigate();
  const [isFocused, setFocus] = useState(false);

  const handleClick = () => {
    navigate(`/course/${courseSlug}/tutorials/${tutorialCode}-${tutorialId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(tutorialCode);
  };

  return (
    <Card
      elevation={4}
      sx={{
        width: '175px',
        height: '164px',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          height: '50%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ padding: '8px', color: 'black' }}
        >
          {tutorialCode}
        </Typography>
        { isStaff === 'staff' && 
          <CloseIcon
              onMouseEnter={() => setFocus(true)}
              onMouseLeave={() => setFocus(false)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              cursor: 'pointer',
              color: isFocused ? '#bcbcbc': '#ffffff',
              zIndex: 10000,
            }}
            fontSize='inherit'
            onClick={handleDelete}
          />
        }
      </div>
      <div
        style={{
          borderTop: `1px solid #5AC2D9`,
          backgroundColor: '#5AC2D9',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '42px',
        }}
      ></div>
    </Card>
  );
};

export default TutorialCard;