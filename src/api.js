import axios from 'axios';

let api = axios.create( {
    headers: {
        'Client-ID': process.env.CLIENT_ID
    }
})

export default api;