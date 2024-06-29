import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
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

const CoursesNavBar = (props) => {
  const navigate = useNavigate();
  const { setSelectedType } = props;

  const { courseType } = useParams();
  const tabList = ['all', 'ongoing', 'completed', 'join'];

  const [selectedIndex, setSelectedIndex] = React.useState(
    tabList.indexOf(courseType)
  );

  const handleListItemClick = (event, index, type) => {
    setSelectedIndex(index);
    setSelectedType(type);
    navigate(`/courses/${type.split(' ')[0].toLowerCase()}`);
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

  return (
    <>
      {!isTabletOrMobile && (
        <Box
          sx={{
            width: '12rem',
            height: '100%',
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            bgcolor: '#F4F4F4',
            borderRadius: '1rem',
            paddingX: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <List component="nav" aria-label="course types">
            <NavItem
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0, 'All courses')}
            >
              <ListItemText primary="All courses" />
            </NavItem>
            <NavItem
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1, 'Ongoing')}
            >
              <ListItemText primary="Ongoing" />
            </NavItem>
            <NavItem
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2, 'Completed')}
            >
              <ListItemText primary="Completed" />
            </NavItem>
          </List>
          <List component="nav" aria-label="join course">
            <NavItem
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3, 'Join Course')}
            >
              <ListItemText primary="Join Course" />
            </NavItem>
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
            <NavItem
              sx={{ width: '40vw', marginX: '1rem' }}
              selected={selectedIndex === 0}
              onClick={(event) => {
                handleListItemClick(event, 0, 'All courses');
                handleClose();
              }}
            >
              <ListItemText primary="All courses" />
            </NavItem>
            <NavItem
              sx={{ width: '40vw', marginX: '1rem' }}
              selected={selectedIndex === 1}
              onClick={(event) => {
                handleListItemClick(event, 1, 'Ongoing');
                handleClose();
              }}
            >
              <ListItemText primary="Ongoing" />
            </NavItem>
            <NavItem
              sx={{ width: '40vw', marginX: '1rem' }}
              selected={selectedIndex === 2}
              onClick={(event) => {
                handleListItemClick(event, 2, 'Completed');
                handleClose();
              }}
            >
              <ListItemText primary="Completed" />
            </NavItem>
            <NavItem
              sx={{ width: '40vw', marginX: '1rem' }}
              selected={selectedIndex === 3}
              onClick={(event) => {
                handleListItemClick(event, 3, 'Join Course');
                handleClose();
              }}
            >
              <ListItemText primary="Join Course" />
            </NavItem>
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

export default CoursesNavBar;