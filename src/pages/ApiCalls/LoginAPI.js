import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";

export const LoginCollaborator = async (collaboratorDataLogin) => {
    try {
        const response = await axiosInstance.post('/login', collaboratorDataLogin);
console.log(response.data)

        const { token } = response.data;
        Cookies.set('accessToken', token, { expires: 5 });
        sessionStorage.setItem('authUser', JSON.stringify({ data: collaboratorDataLogin }));

        return response.data;
    } catch (error) {
        console.error('Error logging in collaborator:', error);
        throw error;
    }
};
export const LogoutCollaborator = () => {
    try {
        // Remove access token from cookies
        Cookies.remove('accessToken');
        
        // Clear session storage (or local storage if applicable)
        sessionStorage.removeItem('authUser');
        
        // Optionally redirect the user to the login page or any other page
        window.location.href = '/login'; // Adjust the redirect path as needed
    } catch (error) {
        console.error('Error during logout:', error);
    }
};