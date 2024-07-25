import axiosWithToken from "./axiosWithToken";
import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";


export const addLead = async (LeadData) => {
    try {
        const response = await axiosWithToken.post('/leads/add-lead', LeadData);
        console.log('Body Request' , LeadData) ;
        console.log('Response' , response.data) ;
        return response.data ;
    } catch (error) {
        console.error('Error adding lead :', error);
        throw error;
    }
};

export const updateLeadRequest =   async(id, updateLead) => {
    try {
        const response = await axiosWithToken.put(`/leads/update-lead/${id}`, updateLead);
        console.log('Updated lead:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
} ;


export const deleteLeadRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/leads/delete-lead/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
};