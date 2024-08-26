import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const addCommandeRequest = async (commandeData) => {
    try {
        console.log('Body Request' , commandeData) ;
        const response = await axiosWithToken.post('/commande/add', commandeData);
      
        return response.data ;
    } catch (error) {
        console.error('Error adding produit fini:', error);
        throw error;
    } 
};


export const updateCommandeRequest =   async(id, updateCommande) => {
    try {
        const response = await axiosWithToken.put(`/commande/update/${id}`, updateCommande);
        console.log('Updated produit fini:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating produit fini:', error);
        throw error;
    }
} ;


export const deleteCommandeRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/commande/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting produit fini:', error);
        throw error;
    }
};