import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import { useMediaQuery, useTheme } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const NavItem = styled(ListItemButton)(() => ({
  '&.Mui-selected': {
    borderRadius: '1rem',
    background: '#5AC2D9',
    color: 'white',
  },
  '&:hover': {
    borderRadius: '1rem',
    background: '#acd9e3',
    color: 'black',
  },
}));

// pass in selectied index
const CoursePageNavBar = ({ activeTab, setActiveTab, navList, isStaff }) => {
  const navigate = useNavigate();
  const { courseSlug } = useParams();

  const [selectedIndex, setSelectedIndex] = React.useState(
    navList && activeTab ? navList.indexOf(activeTab) : 0
  );

  const logout = async () => {
    try {
      await axios.get('/logout', {
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      alert(error);
    }
  };

  const handleListItemClick = (event, index, tab) => {
    setSelectedIndex(index);
    setActiveTab(tab);
    if (tab === 'Lectures') {
      navigate(`/course/${courseSlug}/${tab.toLowerCase()}/resources`);
    } else if (tab === 'Quizzes') {
      navigate(`/course/${courseSlug}/${tab.toLowerCase()}`);
    } else {
      navigate(`/course/${courseSlug}/${tab.toLowerCase().replace(/ /g, '')}`);
    }
  };

  // for small screen menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {!isTabletOrMobile && (
        <Box
          sx={{
            width: '12rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            bgcolor: '#F4F4F4',
            borderRadius: '1rem',
            paddingX: '1rem',
            boxSizing: 'border-box',
            marginRight: '1rem',
          }}
        >
          <List component="nav" aria-label="course types">
            {navList.map((tab, index) => {
              return (
                <NavItem
                  id={`${tab}-nav`}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index, tab)}
                >
                  <ListItemText primary={tab} />
                </NavItem>
              );
            })}
          </List>
        </Box>
      )}
      {isTabletOrMobile && (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon fontSize={'large'} sx={{ color: '#5AC2D9' }} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {navList.map((tab, index) => {
              return (
                <NavItem
                  id={`${tab}-nav`}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index, tab)}
                  sx={{ width: '40vw', marginX: '1rem' }}
                >
                  <ListItemText primary={tab} />
                </NavItem>
              );
            })}
            <hr width={'80%'} />
            <NavItem
              id={`logout-nav`}
              onClick={logout}
              sx={{ width: '40vw', marginX: '1rem' }}
            >
              <ListItemText primary={'Logout'} />
            </NavItem>
          </Menu>
        </div>
      )}
    </>
  );
};

export default CoursePageNavBar;