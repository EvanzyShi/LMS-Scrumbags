import styled from '@emotion/styled';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import rocketImage from '../../asset/rocket.png';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '60%',
  padding: 20,
  maxWidth: '1000px',
  margin: 'auto',
  borderRadius: '8px',
  alignItems: 'center',
});

const TeacherRegister = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [institute, setInstitute] = useState('');
  const [agree, setAgree] = useState(false);
  const [isCertifiedTeacher, setIsCertifiedTeacher] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleTeacherRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !institute) {
      alert('Please fill in all the fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }
    axios
      .post('/register', {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        is_staff: true,
      })
      .then((response) => {
        alert('You have successfully registered!');
        navigate('/login/teacher');
      })
      .catch((error) => {
        alert('An error occurred while registering. Please try again.');
      });
  };

  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: 'center',
        height: '107vh',
        backgroundColor: '#F3F9FD',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: isSmallScreen ? 'none' : 'block',
          backgroundImage: `url(${rocketImage})`,
          backgroundPosition: 'center left',
          backgroundRepeat: 'no-repeat',
          minHeight: '100%',
          minWidth: '60%',
          backgroundSize: 'cover',
        }}
      ></Box>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Typography variant="h3" color="#4783C9" align="center">
          Get Started by Creating an Account
        </Typography>
        <Typography variant="subtitle2" align="center">
          Your easy portal to manage your class
        </Typography>
        <Typography variant="body2" color="#BCA591" align="center">
          {' '}
          <Link
            href="#"
            onClick={() => navigate('/register/student')}
            style={{ color: '#285785' }}
          >
            Sign Up as a student
          </Link>
        </Typography>
        <Typography variant="body2" color="black" align="center" sx={{ mb: 2 }}>
          Already a member?{' '}
          <Link
            href="#"
            onClick={() => navigate('/')}
            style={{ color: '#285785' }}
          >
            Sign in
          </Link>
        </Typography>
        <TextField
          label="First Name"
          variant="filled"
          onFocus={() => setFocusedField('firstName')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon sx={{ color: focusedField === 'firstName' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          variant="filled"
          onFocus={() => setFocusedField('lastName')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineOutlinedIcon sx={{ color: focusedField === 'lastName' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="filled"
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: focusedField === 'email' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          variant="filled"
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: focusedField === 'password' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: focusedField === 'password' ? '#1976d2' : '#D3F3FD' }}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Confirm Password"
          variant="filled"
          onFocus={() => setFocusedField('confirmPassword')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: focusedField === 'confirmPassword' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: focusedField === 'confirmPassword' ? '#1976d2' : '#D3F3FD' }}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TextField
          label="Institute"
          variant="filled"
          onFocus={() => setFocusedField('institute')}
          onBlur={() => setFocusedField(null)}
          sx={{
            '& .MuiFilledInput-root': {
              backgroundColor: '#70CDE1',
              borderRadius: '14px',
              width: 371,
              height: 60,
              color: 'black',
              marginBottom: '13px',
            },
            '& .MuiInputLabel-root': {
              color: '#D3F3FD',
            },
            '& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after':
              {
                display: 'none',
              },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SchoolOutlinedIcon sx={{ color: focusedField === 'institute' ? '#1976d2' : '#D3F3FD' }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setInstitute(e.target.value)}
        />
        <Box 
        sx={{ 
          alignSelf: 'flex-start',
          pl: isSmallScreen ? '0px' : '80px',
          mb: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSmallScreen ? 'flex-start' : 'flex-start',
        }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            }
            label="I agree to the website's Privacy Policy & Terms and Conditions"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCertifiedTeacher}
                onChange={(e) => setIsCertifiedTeacher(e.target.checked)}
              />
            }
            label="I certify that I am accredited teacher"
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleTeacherRegister}
          disabled={!agree || !isCertifiedTeacher}
          style={{
            width: 371,
            height: 60,
            borderRadius: '99px',
            background: '#FFBC6C',
            color: 'white',
            textTransform: 'none',
          }}
        >
          Register
        </Button>
      </Form>
    </Box>
  );
};

export default TeacherRegister;