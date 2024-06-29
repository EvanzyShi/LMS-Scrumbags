import {
  Box,
  Button,
  Card,
  FormControl,
  Input,
  InputLabel,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import mascot from '../../asset/mascot.png';
import moon from '../../asset/moon.png';
import saturn from '../../asset/saturn.png';
import star from '../../asset/star.png';

const TeacherLogin = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      await axios.post('/login',
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        navigate('/courses/all');
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: '#6ACADF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Card
          sx={{
            width: '80vw',
            height: '92vh',
            bgcolor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            borderRadius: '2rem',
          }}
        >
          <Button
            onClick={() => {
              navigate('/');
            }}
            style={{
              position: 'absolute',
              top: 9 + '%',
              right: 13 + '%',
              borderRadius: 50 + '%',
            }}
          >
            <svg
              width={isSmallScreen ? '35' : '50'}
              viewBox='0 0 50 50'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M40.1679 37.9569C40.313 38.1021 40.4282 38.2744 40.5068 38.4641C40.5853 38.6538 40.6258 38.8571 40.6258 39.0624C40.6258 39.2677 40.5853 39.471 40.5068 39.6607C40.4282 39.8503 40.313 40.0227 40.1679 40.1679C40.0227 40.313 39.8503 40.4282 39.6607 40.5068C39.471 40.5853 39.2677 40.6258 39.0624 40.6258C38.8571 40.6258 38.6538 40.5853 38.4641 40.5068C38.2744 40.4282 38.1021 40.313 37.9569 40.1679L24.9999 27.2089L12.0429 40.1679C11.7497 40.4611 11.352 40.6258 10.9374 40.6258C10.5228 40.6258 10.1251 40.4611 9.83192 40.1679C9.53873 39.8747 9.37402 39.477 9.37402 39.0624C9.37402 38.6478 9.53873 38.2501 9.83192 37.9569L22.7909 24.9999L9.83192 12.0429C9.53873 11.7497 9.37402 11.352 9.37402 10.9374C9.37402 10.5228 9.53873 10.1251 9.83192 9.83192C10.1251 9.53873 10.5228 9.37402 10.9374 9.37402C11.352 9.37402 11.7497 9.53873 12.0429 9.83192L24.9999 22.7909L37.9569 9.83192C38.2501 9.53873 38.6478 9.37402 39.0624 9.37402C39.477 9.37402 39.8747 9.53873 40.1679 9.83192C40.4611 10.1251 40.6258 10.5228 40.6258 10.9374C40.6258 11.352 40.4611 11.7497 40.1679 12.0429L27.2089 24.9999L40.1679 37.9569Z'
                fill='#256CA4'
              />
            </svg>
          </Button>
          <Card
            id='left-card'
            sx={{
              height: '90%',
              width: '45%',
              margin: '1rem',
              bgcolor: '#70CDE1',
              boxSizing: 'border-box',
              borderRadius: '2rem',
              display: isSmallScreen ? 'none' : 'flex',
              flexDirection: 'column',
            }}
          >
            <img
              src={mascot}
              alt='mascot'
              id='mascot'
              style={{
                height: 23 + 'rem',
                position: 'absolute',
                bottom: 12 + '%',
                left: 15 + '%',
              }}
            />
            <img
              src={moon}
              alt='moon'
              id='moon'
              style={{
                height: 4 + 'rem',
                position: 'absolute',
                top: 12 + '%',
                left: 33 + '%',
              }}
            />
            <img
              src={saturn}
              alt='saturn'
              id='saturn'
              style={{
                height: 8 + 'rem',
                position: 'absolute',
                top: 14 + '%',
                left: 42 + '%',
              }}
            />
            <img
              src={star}
              alt='star'
              id='star'
              style={{
                height: 2 + 'rem',
                position: 'absolute',
                top: 15 + '%',
                left: 22 + '%',
              }}
            />
            <img
              src={star}
              alt='star'
              id='star'
              style={{
                height: 2 + 'rem',
                position: 'absolute',
                top: 25 + '%',
                left: 17 + '%',
              }}
            />
            <img
              src={star}
              alt='star'
              id='star'
              style={{
                height: 2 + 'rem',
                position: 'absolute',
                top: 29 + '%',
                left: 32 + '%',
              }}
            />
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: 14 + '%',
                left: 55 + '%',
              }}
            >
              <svg
                width='222'
                height='15'
                viewBox='0 0 242 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='222' height='15' rx='7.5' fill='#D9D9D9' />
              </svg>
              <svg
                width='19'
                height='15'
                viewBox='0 0 19 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='19' height='15' rx='7.5' fill='#D9D9D9' />
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: 19 + '%',
                left: 58 + '%',
              }}
            >
              <svg
                width='222'
                height='15'
                viewBox='0 0 242 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='222' height='15' rx='7.5' fill='#D9D9D9' />
              </svg>
              <svg
                width='19'
                height='15'
                viewBox='0 0 19 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='19' height='15' rx='7.5' fill='#D9D9D9' />
              </svg>
            </div>
          </Card>
          <Card
            sx={{
              height: '80%',
              width: isSmallScreen ? '90' : '45%',
              margin: '1rem',
              bgcolor: '#ffffff',
              boxSizing: 'border-box',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              padding: isSmallScreen ? '1rem' : '5rem',
              borderRadius: '2rem',
              boxShadow: 'none',
              color: '#256CA4',
            }}
          >
            <h1
              style={{
                textAlign: 'center',
                fontSize: isSmallScreen ? '2.5rem' : '2.5rem',
              }}
            >
              Teacher Login
            </h1>
            <FormControl variant='standard' style={{ marginBottom: '1rem' }}>
              <InputLabel
                htmlFor='component-simple'
                size='large'
                sx={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginLeft: 1 + 'rem' }}>
                  <svg
                    width='22'
                    height='20'
                    viewBox='0 0 22 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M15.8666 7.65381L12.016 10.4417C11.2885 10.9556 10.2649 10.9556 9.53739 10.4417L5.6543 7.65381'
                      stroke='#256CA4'
                      stroke-width='1.2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M15.0061 17.0282C17.6418 17.0347 19.4181 15.1065 19.4181 12.7368V7.43706C19.4181 5.06729 17.6418 3.13916 15.0061 3.13916H6.49797C3.8623 3.13916 2.08594 5.06729 2.08594 7.43706V12.7368C2.08594 15.1065 3.8623 17.0347 6.49797 17.0282H15.0061Z'
                      stroke='#256CA4'
                      stroke-width='1.2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </div>
                <div style={{ marginLeft: 0.4 + 'rem' }}>Email</div>
              </InputLabel>
              <Input
                required
                id='email'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
            <FormControl variant='standard' style={{ marginBottom: '1rem' }}>
              <InputLabel
                htmlFor='standard-adornment-password'
                sx={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginLeft: 1 + 'rem' }}>
                  <svg
                    width='20'
                    height='18'
                    viewBox='0 0 14 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M10.3388 6.4664V4.85615C10.3388 2.9714 8.8103 1.4429 6.92555 1.4429C5.0408 1.43465 3.5063 2.95565 3.49805 4.84115V4.85615V6.4664'
                      stroke='#256CA4'
                      stroke-width='1.2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      fill-rule='evenodd'
                      clip-rule='evenodd'
                      d='M9.78373 15.3178H4.05298C2.48248 15.3178 1.20898 14.0451 1.20898 12.4738V9.25709C1.20898 7.68584 2.48248 6.41309 4.05298 6.41309H9.78373C11.3542 6.41309 12.6277 7.68584 12.6277 9.25709V12.4738C12.6277 14.0451 11.3542 15.3178 9.78373 15.3178Z'
                      stroke='#256CA4'
                      stroke-width='1.2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M6.91846 10.0327V11.6985'
                      stroke='#256CA4'
                      stroke-width='1.2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </div>
                <div style={{ marginLeft: 0.4 + 'rem' }}>Password</div>
              </InputLabel>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <svg
                          width='16'
                          height='14'
                          viewBox='0 0 16 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M6.2582 8.58775C5.82695 8.15725 5.56445 7.57225 5.56445 6.916C5.56445 5.60125 6.62345 4.5415 7.93745 4.5415C8.5877 4.5415 9.1862 4.80475 9.60995 5.23525'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M10.2665 7.33691C10.0925 8.30441 9.33052 9.06791 8.36377 9.24341'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M3.92875 10.917C2.7385 9.98248 1.7305 8.61748 1 6.91573C1.738 5.20648 2.75275 3.83398 3.9505 2.89198C5.14075 1.94998 6.514 1.43848 7.9375 1.43848C9.36925 1.43848 10.7418 1.95748 11.9395 2.90623'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M13.5236 4.55566C14.0396 5.24116 14.4933 6.03241 14.8751 6.91516C13.3998 10.3329 10.7928 12.3917 7.93757 12.3917C7.29032 12.3917 6.65207 12.2867 6.03857 12.0819'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M13.853 1L2.02246 12.8305'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      ) : (
                        <svg
                          width='16'
                          height='14'
                          viewBox='0 0 16 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M6.2582 8.58775C5.82695 8.15725 5.56445 7.57225 5.56445 6.916C5.56445 5.60125 6.62345 4.5415 7.93745 4.5415C8.5877 4.5415 9.1862 4.80475 9.60995 5.23525'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M9.7838 5.37563C10.1641 5.85172 10.3595 6.46244 10.286 7.11456C10.1387 8.42104 8.96768 9.35552 7.66195 9.20835C7.01579 9.13553 6.45054 8.8069 6.07767 8.33165'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M12.0107 3.00002C13.201 3.93452 14.209 5.29952 14.9395 7.00127C14.2015 8.71052 13.1867 10.083 11.989 11.025C10.7987 11.967 9.42545 12.4785 8.00195 12.4785C6.5702 12.4785 5.1977 11.9595 3.99995 11.0108'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                          <path
                            d='M3.92875 10.917C2.7385 9.98248 1.7305 8.61748 1 6.91573C1.738 5.20648 2.75275 3.83398 3.9505 2.89198C5.14075 1.94998 6.514 1.43848 7.9375 1.43848C9.36925 1.43848 10.7418 1.95748 11.9395 2.90623'
                            stroke='#256CA4'
                            stroke-width='1.2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </FormControl>
            <Button
              variant='text'
              onClick={() => {
                navigate('/forgot-password');
              }}
              sx={{
                textTransform: 'none',
              }}
            >
              Forgot your password?
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                handleLogin();
              }}
              sx={{
                boxSizing: 'border-box',
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                borderRadius: '5rem',
                fontSize: '1.2rem',
                backgroundColor: '#256CA4',
                color: '#D3F3FD',
                margin: '1.5rem',
                padding: '0.8rem',
              }}
            >
              <svg
                width='23'
                height='21'
                viewBox='0 0 23 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M11.1013 0.0976562H16.9241C19.8355 0.0976562 22.21 2.15529 22.21 4.66561V16.1061C22.21 18.6267 19.8355 20.674 16.9002 20.674H11.0894C8.17796 20.674 5.79156 18.6267 5.79156 16.1164V11.178H13.1894L11.2803 12.8241C10.9223 13.1328 10.9223 13.6369 11.2803 13.9456C11.4593 14.0999 11.6979 14.1719 11.9365 14.1719C12.1632 14.1719 12.4019 14.0999 12.5809 13.9456L16.065 10.9517C16.244 10.8077 16.3394 10.6019 16.3394 10.3858C16.3394 10.1801 16.244 9.97431 16.065 9.83028L12.5809 6.83642C12.2229 6.52777 11.6382 6.52777 11.2803 6.83642C10.9223 7.14506 10.9223 7.64918 11.2803 7.95783L13.1894 9.59365H5.79156V4.6759C5.79156 2.15529 8.17796 0.0976562 11.1013 0.0976562ZM0.255859 10.3857C0.255859 9.95363 0.66632 9.59355 1.15887 9.59355H5.79121V11.1779H1.15887C0.66632 11.1779 0.255859 10.8281 0.255859 10.3857Z'
                  fill='#D3F3FD'
                />
              </svg>
              <div
                style={{ marginLeft: 0.5 + 'rem', textTransform: 'capitalize' }}
              >
                Login
              </div>
            </Button>
            <Link
              href=''
              onClick={() => {
                navigate('/register/teacher');
              }}
              style={{ display: 'flex' }}
            >
              <div style={{ color: 'black', textDecoration: 'none' }}>
                Not a member yet?
              </div>
              <div style={{ marginLeft: '0.5rem' }}>Sign up</div>
            </Link>
          </Card>
        </Card>
      </Box>
    </>
  );
};

export default TeacherLogin;