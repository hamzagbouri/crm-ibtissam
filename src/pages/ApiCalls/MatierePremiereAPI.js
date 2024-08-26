import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const addMatierePremiereRequest = async (matierePremiereData) => {
    try {
        const response = await axiosWithToken.post('/matiere/add', matierePremiereData);
        console.log('Body Request' , matierePremiereData) ;
        return response.data ;
    } catch (error) {
        console.error('Error adding matiere :', error);
        throw error;
    } 
};


export const updateMatierePremiereRequest =   async(id, updateMatierePremiere) => {
    try {
        const response = await axiosWithToken.put(`/matiere/update/${id}`, updateMatierePremiere);
        console.log('Updated matiere :', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating matiere :', error);
        throw error;
    }
} ;


export const deleteMatierePremiereRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/matiere/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting matiere :', error);
        throw error;
    }
};