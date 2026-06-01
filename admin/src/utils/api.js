import axios from 'axios';


export const fetchDataFromAPI = async (url) => {
    try{
        const {data} = await axios.get(process.env.REACT_APP_BASE_URL
+url);
        return data;
    }catch(error){
        console.error('Error fetching data from API:', error);
        throw error;
    }
}
export const postDataToAPI = async (url,data) => {
    try{
        const { data: response }  = await axios.post(process.env.REACT_APP_BASE_URL
+url,data);
        return response;
    }catch(error){
        console.error('Error posting data to API:', error);
        throw error;
    }
}

export const Editdata = async (url,updateddata) => {
    try{
        const { data: response }  = await axios.put(process.env.REACT_APP_BASE_URL
+url,updateddata);
        return response;
    }catch(error){
        console.error('Error posting data to API:', error);
        throw error;
    }
}

export const deletedata = async (url) => {
    try{
        const { data: response }  = await axios.delete(process.env.REACT_APP_BASE_URL
+url);
        return response;
    }catch(error){
        console.error('Error posting data to API:', error);
        throw error;
    }
}

