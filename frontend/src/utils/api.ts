// make reusable axios create instance for api calls with typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const get = async (url: string, params?: any) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const post = async (url: string, data: any) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const put = async (url: string, data: any) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const del = async (url: string) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { get, post, put, del };
