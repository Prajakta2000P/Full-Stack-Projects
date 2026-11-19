import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // लूप टाळण्यासाठी फक्त खऱ्या एरर केसेस मध्येच टोकन साफ करणे
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.clear();
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    return res.data;
  },
  registerUser: async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/registernormaluser`, userData);
    return res.data;
  },
  registerAdmin: async (adminData) => {
    const res = await axios.post(`${API_BASE_URL}/admin/registeradminuser`, adminData);
    return res.data;
  },
  logout: () => {
    localStorage.clear();
  }
};

export const bookService = {
  getBooks: async () => {
    const res = await api.get('/books/getallbooks');
    return res.data;
  },
  addBook: async (bookData) => {
    const res = await api.post('/books/addbook', bookData);
    return res.data;
  },
  updateBook: async (id, updatedData) => {
    const res = await api.put(`/books/updatebook/${id}`, updatedData);
    return res.data;
  },
  deleteBook: async (id) => {
    const res = await api.delete(`/books/deletebook/${id}`);
    return res.data;
  }
};

export const libraryService = {
  issueBook: async (bookId) => {
    const res = await api.post(`/issuerecords/issuethebook/${bookId}`);
    return res.data;
  },
  returnBook: async (issueRecordId) => {
    const res = await api.post(`/issuerecords/returnthebook/${issueRecordId}`);
    return res.data;
  },
  getAllRecords: async () => {
    const res = await api.get('/issuerecords/getallrecords');
    return res.data;
  },
  getMyRecords: async () => {
    const res = await api.get('/issuerecords/myrecords');
    return res.data;
  }
};

export default api;
