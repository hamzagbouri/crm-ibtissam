import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";
import axiosWithToken from "./axiosWithToken";


export const LoginCollaborator = async (collaboratorDataLogin) => {
    try {
        const response = await axiosInstance.post('/login-collaborator', collaboratorDataLogin);
        console.log('Body Request' , collaboratorDataLogin) ;
        console.log("Response Data", response.data , response) ;
        Cookies.set('accessToken',  response.data, { expires: 5 });
        sessionStorage.setItem('authUser', JSON.stringify({ data: collaboratorDataLogin }));

        return response.data ;
    } catch (error) {
        console.error('Error Login collaborator:', error);
        throw error;
    }
};
