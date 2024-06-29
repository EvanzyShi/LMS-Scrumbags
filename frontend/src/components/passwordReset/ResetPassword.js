import {
  Box,
  Button,
  Card,
  FormControl,
  Input,
  InputLabel,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import mascotQuestion from '../../asset/mascotQuestion.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [password, setPassword] = React.useState('');

  const recoveryStage = {
    getEmail: 0,
    getVerification: 1,
    getNewPassword: 2,
  };

  const [showModal, setModal] = React.useState(recoveryStage.getEmail);
  const handleClickStageEmail = () =>
    setModal((state) => recoveryStage.getEmail);

  const dynamixCross = () => {
    if (showModal === recoveryStage.getEmail) {
      navigate('/login/student');
    } else if (showModal === recoveryStage.getVerification) {
      handleClickStageEmail();
    } else {
      handleClickStageEmail();
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = async () => {
    try {
      await axios.post('password_reset/confirm/', {
        withCredentials: false,
        password: password,
        token: token,
      });
      setOpen(true);
    } catch (error) {
      alert(error);
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    navigate('/login/student');
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
        <div>
          <div
            style={{
              position: 'absolute',
              top: 2 + '%',
              right: 6 + '%',
              borderRadius: 50 + '%',
            }}
          >
            <svg
              width='247'
              height='180'
              viewBox='0 0 247 180'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1.99924 8.48578C4.71953 -19.6237 88.5 34.1271 133 8.48428C209.5 -5.37294 115.5 8.48467 227 8.48471C240.001 116.985 227 8.48465 227 97.9843C330.5 171.484 -23.5009 271.985 1.99924 8.48578Z'
                fill='#6ACADF'
              />
            </svg>
          </div>
          <Button
            onClick={() => {
              dynamixCross();
            }}
            style={{
              position: 'absolute',
              top: 9 + '%',
              right: 13 + '%',
              borderRadius: 50 + '%',
            }}
          >
            <svg
              width='50'
              height='50'
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
        </div>
        <Card
          sx={{
            width: '80vw',
            height: '92vh',
            bgcolor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            boxSizing: 'border-box',
            borderRadius: '2rem',
          }}
        >
          <div>
            <div
              style={{
                height: 35 + 'rem',
                position: 'absolute',
                bottom: 12 + '%',
                left: 6 + '%',
              }}
            >
              <svg
                width='860'
                height='750'
                viewBox='0 0 860 750'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M692.328 355.065C486.449 759.016 1389 817.001 344.669 689.637C-15.2242 780.377 21.9395 501.849 37.9999 307.001C-116.5 -254.999 241.5 145.984 416.513 55.3951C567.001 -22.5 846.66 52.2534 692.328 355.065Z'
                  fill='#6ACADF'
                />
              </svg>
            </div>
            <img
              src={mascotQuestion}
              alt='mascotQuestion'
              id='mascotQuestion'
              style={{
                height: 35 + 'rem',
                position: 'absolute',
                bottom: 8 + '%',
                left: 12 + '%',
              }}
            />
          </div>
          <Card
            id='right-card'
            sx={{
              height: '80%',
              width: '45%',
              marginRight: '5rem',
              bgcolor: '#ffffff',
              display: 'flex',
              boxSizing: 'border-box',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              flexDirection: 'column',
              borderRadius: '2rem',
              boxShadow: 'none',
              color: '#256CA4',
            }}
          >
            {/* PASSWORD RESET */}
            <Box
              sx={{
                display: 'flex',
                boxSizing: 'border-box',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '5rem',
                flexDirection: 'column',
              }}
            >
              <h1 style={{ fontSize: '2.5rem' }}>Reset Password</h1>
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
                  id='standard'
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
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
                  <div style={{ marginLeft: 0.4 + 'rem' }}>
                    Confirm Password
                  </div>
                </InputLabel>
                <Input
                  id='standard-adornment-password'
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
                />
                <Button onClick={handleClick}>Reset</Button>
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={open}
                  autoHideDuration={5000}
                  onClose={handleClose}
                  message='Password Reset Successfully'
                />
              </FormControl>
            </Box>
          </Card>
        </Card>
      </Box>
    </>
  );
};

export default ResetPassword;