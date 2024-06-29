import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as React from 'react';

const CoursePageSearch = () => {
  return (
    <Stack spacing={2} sx={{ width: '15rem', borderRadius: '50%' }}>
      <Autocomplete
        freeSolo
        id='free-solo-2-demo'
        disableClearable
        options={searchResults.map((option) => option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Search course'
            InputProps={{
              ...params.InputProps,
              type: 'search',
              style: {
                borderRadius: '10rem',
                marginTop: '0.4rem',
                height: '2.5rem',
                background: 'white',
              },
            }}
          />
        )}
      />
    </Stack>
  );
};

export default CoursePageSearch;

const searchResults = ['comp3900', 'comp1511'];
