import axios from 'axios';

const api = axios.create({
  baseURL: 'https://back-singlens.onrender.com',
})

export default api;
