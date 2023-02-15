import axios from 'axios';

const api = axios.create({
  baseURL: 'https://brave-red-blazer.cyclic.app',
})

export default api;