import { MAIN_URL, TOKEN } from './config';

import axios from 'axios';

axios.defaults.baseURL = MAIN_URL;
axios.defaults.headers.common['Authorization'] = TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const api = {
    get( url = '/', data = {} ) {
        return axios.get(url);
    },
    post( url = '/', data = {} ) {
        return axios.post(url, data);
    },
    delete( url = '/', data = {} ) {
        return axios.delete(url, data);
    },
    put( url = '/', data = {} ) {
        return axios.put(url, data);
    },
};
