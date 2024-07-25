import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const addCollaboratorRequest = async (collaboratorData) => {
    try {
        const response = await axiosWithToken.post('/collaborators/add-collaborator', collaboratorData);
        console.log('Body Request' , collaboratorData) ;
        return response.data ;
    } catch (error) {
        console.error('Error adding collaborator:', error);
        throw error;
    }
};


export const updateCollaboratorRequest =   async(id, updateCollaborator) => {
    try {
        const response = await axiosWithToken.put(`/collaborators/update-collaborator/${id}`, updateCollaborator);
        console.log('Updated collaborator:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating collaborator:', error);
        throw error;
    }
} ;


export const deleteCollaboratorRequest = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/collaborators/remove-collaborator/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting collaborator:', error);
        throw error;
    }
};