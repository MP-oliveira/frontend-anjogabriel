import axios from 'axios';

// Configurando a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export default api;
