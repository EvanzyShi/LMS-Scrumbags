import axios from 'axios';
const getStaff = async (setIsStaff) => {
  try {
    let response = await axios.get('/user', {
      withCredentials: true,
    });

    if (response.data.user.is_staff) {
      setIsStaff('staff');
    } else {
      setIsStaff('student');
    }
  } catch (error) {
    alert(error);
  }
};

export default getStaff;