import axios from 'axios';

// Create a custom instance of Axios
const api = axios.create({
    baseURL: 'https://silver-spork-wr99rrv7xjvv3gw49-8000.app.github.dev/api/', 
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;