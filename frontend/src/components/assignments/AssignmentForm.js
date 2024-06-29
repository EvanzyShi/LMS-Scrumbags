import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Button,
	TextField,
	Typography,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCookie from '../../helpers/getCookie';

const AssignmentForm = () => {
  	const { courseSlug } = useParams();
	const [title, setTitle] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [endDate, setEndDate] = React.useState(new Date());
	const [files, setFiles] = React.useState([]);
	const [selectedFileName, setSelectedFileName] = React.useState('');
	const navigate = useNavigate();

  	const handleUploadFiles = newFiles => {
		// copy the uploaded files
		const uploaded = [...files];
		newFiles.forEach(file => {
		// prevent same file name to be uploaded twice
		if (uploaded.findIndex(f => f.name === file.name) === -1) {
			uploaded.push(file);
		}
		});
		setFiles(uploaded);
	};

	const handleFileChange = e => {
		const chosenFiles = Array.from(e.target.files);
		handleUploadFiles(chosenFiles);
		if (chosenFiles.length > 0) {
		setSelectedFileName(chosenFiles[0].name);
		}
	};

	const handleDeleteFile = fileName => {
		const updatedFiles = files.filter(file => file.name !== fileName);
		setFiles(updatedFiles);
		setSelectedFileName('');
	  };

	const createAssignment = async () => {
		try {
		var data = new FormData();
		for (let i = 0; i < files.length; i++) {
			data.append('files', files[i]);
		};
		data.append('title', title)
		data.append('description', description)
		data.append('due_date', endDate)

		await axios.post(
			`/course/${courseSlug.split('-')[1]}/assessments/assignments/new`,
					data,
			{
			withCredentials: true,
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
			},
			}
		);
		navigate(`/course/${courseSlug}/assessments`);
		} catch (error) {
		alert(error);
		}
	}

  return (
    <Box>
    <Typography variant="h4" gutterBottom>
      Assignment Creation
    </Typography>
    <Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				maxWidth: '1200px',
				margin: 'auto',
				padding: '10px',
				boxSizing: 'border-box',
				overflow: 'auto',
			}}>
			<Box sx={{ 
					gap: '6rem', 
					alignItems: 'center'
					}}
				>
				<Typography>Assignment Information</Typography>
				<TextField
					placeholder='Assignment Title'
					variant="outlined" 
					sx={{ 
						width: '50rem',
					}}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Box>
			<Box sx={{ 
					display: 'flex', 
					flexDirection: 'row', 
					gap: '1rem' 
					}}
				>
				<Typography 
					variant="h7" 
					gutterBottom
					sx={{ 
						marginTop: '1rem',
					}}
				>
					Due:
				</Typography>
				<TextField
					type="datetime-local"
					variant="outlined"
					defaultValue={new Date()}
					sx={{ 
						width: '20rem' 
					}}
					onChange={(e) => {setEndDate(e.target.value)}}
				/>
			</Box>
			<Box
			sx={{      
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				maxWidth: '1200px',
				margin: 'auto',
				padding: '10px',
				boxSizing: 'border-box',
				overflow: 'auto',
			}}
			>
				<TextField
					placeholder='Description for your assignment'
					multiline
					rows={4}
					sx={{
						width: '50rem'
					}}
					onChange={(e) => {setDescription(e.target.value)}}
				></TextField>
			</Box>
			<Button
				component="label"
				role={undefined}
				variant="contained"
				tabIndex={-1}
				startIcon={<CloudUploadIcon />}
				sx={{
					backgroundColor: '#70cde0',
					textTransform: 'none',
					color: 'white',
					'&:hover': {
					  backgroundColor: '#4a90e2',
					},
				}}
			>
				Upload Files
				<input
					type='file'
					onChange={handleFileChange}
					hidden
          			enctype="multipart/form-data"
				>
				</input>
			</Button>
			{selectedFileName && (
			<Box 
				sx={{ 
					display: 'flex', 
					alignItems: 'center' 
				}}
			>
				<Typography 
					variant="body1"
				>	
					Selected File: {selectedFileName}
				</Typography>
				<Button
				onClick={() => handleDeleteFile(selectedFileName)}
				sx={{ 
					color: 'error.main' 
				}}
				>
				<DeleteIcon />
				</Button>
			</Box>
			)}
			<Button
				onClick={createAssignment}
				sx={{
					backgroundColor: '#FFBC6C',
					color: 'white',
					'&:hover': {
					  backgroundColor: '#fa8b02',
					},
					width: '100%',
					height: '40px',
					textTransform: 'none',
				  }}
			>
				Create
			</Button>
		</Box>

  </Box>
  );
};

export default AssignmentForm;