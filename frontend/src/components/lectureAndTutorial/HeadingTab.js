import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const StyledTab = styled(Tab)(() => ({
  '&.Mui-selected': {
    color: 'black',
    fontWeight: 'bold',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function HeadingTab(props) {
  const { page } = props;
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const { courseSlug, contentType } = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate(`/course/${courseSlug}/${page}/resources`);
    } else {
      navigate(`/course/${courseSlug}/${page}/live`);
    }
  };

  React.useEffect(() => {
    if (contentType === 'live') {
      setValue(1);
    } else if (contentType === 'resources') {
      setValue(0);
    }
  }, [courseSlug]);

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '2rem',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab label="Resources" {...a11yProps(0)} />
          <StyledTab label="Live" {...a11yProps(1)} />
        </Tabs>
      </Box>
    </Box>
  );
}