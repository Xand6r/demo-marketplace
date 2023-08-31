import axios from 'axios';

export const URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;

// preset requests set
export const postReq = async (path: string, obj: Record<string, unknown>) => {
  try {
    const response = await axios.post(URL + path, obj);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReq = async (path: string) => {
  try {
    const response = await axios.get(URL + path);
    return response;
  } catch (error) {
    throw error;
  }
};
