import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:5173/api',
});

export default api;
