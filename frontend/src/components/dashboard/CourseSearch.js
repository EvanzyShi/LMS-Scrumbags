import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const CourseSearch = ({ setSearchValue, }) => {

  const searchResults = ['comp3900', 'comp1511'];
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%', borderRadius: '50%' }}>
      <Autocomplete
        sx={{
          '&.MuiAutocomplete-input': { borderRadius: '10rem' },
        }}
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={searchResults.map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search courses"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              style: {
                borderRadius: '10rem',
                display: 'flex',
                alignContent: 'center',
                height: '3rem',
              },
              startAdornment: (
                <SearchIcon
                  sx={{ color: 'rgba(0, 0, 0, 0.54)', marginRight: '0.5rem' }}
                />
              ),
            }}
            onChange={handleInputChange}
          />
        )}
      />
    </Stack>
  );
};

export default CourseSearch;