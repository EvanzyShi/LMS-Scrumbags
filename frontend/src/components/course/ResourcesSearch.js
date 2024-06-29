import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import SearchResourcesModal from './SearchResourcesModal';

const ResourcesSearch = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [searchResults, setSearchResults] = React.useState({});
  const { courseSlug } = useParams();
  const [open, setOpen] = React.useState(false);
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setOpen(true);
    searchResources();
  };

  const searchResources = async () => {
    try {
      let response = await axios.get(
        `/course/${courseSlug.split('-')[1]}/search?search=${searchValue}`,
        {
          withCredentials: true,
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <SearchResourcesModal
        open={open}
        setOpen={setOpen}
        searchValue={searchValue}
        results={searchResults}
      />
      <Box sx={{ bgcolor: 'white', mb: '0.5rem', borderRadius: '2rem' }}>
        <InputBase
          sx={{ ml: 2, flex: 1, '&.MuiInputBase-root': { fontSize: '0.9rem' } }}
          placeholder="Search Course Topics"
          inputProps={{ 'aria-label': 'search resource topics' }}
          onChange={handleInputChange}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              handleSearch();
              ev.preventDefault();
            }
          }}
        />
        <IconButton
          type="button"
          aria-label="search"
          onClick={() => {
            handleSearch();
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default ResourcesSearch;