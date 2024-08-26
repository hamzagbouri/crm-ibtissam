import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const addClientRequest = async (clientData) => {
    try {
        console.log("client dada",clientData)
        const response = await axiosWithToken.post('/client/add', clientData);
        console.log('Body Request' , clientData) ;
        return response.data ;
    } catch (error) {
        console.error('Error adding client:', error);
        throw error;
    } 
};


export const updateClientRequest =   async(id, updateClient) => {
    try {
        const response = await axiosWithToken.put(`/client/update/${id}`, updateClient);
        console.log('Updated client:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error;
    }
} ;


export const deleteClientRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/client/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting produit fini:', error);
        throw error;
    }
};