import axios from 'axios';

export const listTransactions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/v1/wallet/transactions',
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendTransaction = async (data, token) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/v1/wallet/transaction',
      data,
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

export const calculateBalance = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/v1/wallet/info',
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const mine = async (token) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/v1/wallet/mine',
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
