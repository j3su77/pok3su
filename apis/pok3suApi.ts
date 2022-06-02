import axios from 'axios';



const pok3suApi = axios.create({
    baseURL: '/api',
    responseType: 'json'
});


export default pok3suApi;