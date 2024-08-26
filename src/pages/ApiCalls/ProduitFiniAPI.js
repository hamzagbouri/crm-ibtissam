import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const addProduitFiniRequest = async (produitFiniData) => {
    try {
        const response = await axiosWithToken.post('/produit/add', produitFiniData);
        console.log('Body Request' , produitFiniData) ;
        return response.data ;
    } catch (error) {
        console.error('Error adding produit fini:', error);
        throw error;
    } 
};


export const updateProduitFiniRequest =   async(id, updateProduitFini) => {
    try {
        const response = await axiosWithToken.put(`/produit/update/${id}`, updateProduitFini);
        console.log('Updated produit fini:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating produit fini:', error);
        throw error;
    }
} ;


export const deleteProduitFiniRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/produit/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting produit fini:', error);
        throw error;
    }
};