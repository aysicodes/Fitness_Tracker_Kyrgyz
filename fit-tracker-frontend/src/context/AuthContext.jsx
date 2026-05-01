import React, { createContext, useContext, useState } from 'react';
import { AuthService } from "../api/axiosConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());


    const login = async (username, password) => {
        const token = await AuthService.login(username, password);
        if (token) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
    };

    const contextValue = {
        isAuthenticated,
        login,
        logout,

    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};