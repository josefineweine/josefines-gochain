import axios from 'axios';

export const register = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/v1/auth/register',
      data,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/v1/auth/login',
      data,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getMe = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
};

export const update = async (token, data) => {
  try {
    const response = await axios.put(
      'http://localhost:5000/api/v1/auth/updateuser',
      {
        email: data.email,
        fname: data.fname,
        lname: data.lname,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updatePassword = async (token, data) => {
  try {
    const response = await axios.put(
      'http://localhost:5000/api/v1/auth/updatepassword',
      {
        password: data.password,
        newPassword: data.newpassword,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
