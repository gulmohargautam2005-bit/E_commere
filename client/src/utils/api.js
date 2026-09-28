import axios from 'axios';

// Production Netlify builds use same-origin /api/* (proxied via _redirects).
// Local dev uses REACT_APP_BASE_URL from .env (e.g. Render or localhost).
const API_BASE = process.env.REACT_APP_BASE_URL || '';

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchDataFromAPI = async (url) => {
    try {
        const { data } = await axios.get(API_BASE + url, { headers: getHeaders() });
        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
}
export const postDataToAPI = async (url, data) => {
    try {
        const { data: response } = await axios.post(API_BASE + url, data, { headers: getHeaders() });
        return response;
    } catch (error) {
        console.error('Error posting data to API:', error);
        throw error;
    }
}

export const Editdata = async (url, updateddata) => {
    try {
        const { data: response } = await axios.put(API_BASE + url, updateddata, { headers: getHeaders() });
        return response;
    } catch (error) {
        console.error('Error posting data to API:', error);
        throw error;
    }
}

export const deletedata = async (url) => {
    try {
        const { data: response } = await axios.delete(API_BASE + url, { headers: getHeaders() });
        return response;
    } catch (error) {
        console.error('Error posting data to API:', error);
        throw error;
    }
}

