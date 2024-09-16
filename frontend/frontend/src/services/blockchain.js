import axios from 'axios';

export const listBlocks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/blockchain');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
