import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenString = localStorage.getItem("token");
        setCurrentUser(JSON.parse(tokenString));
        setLoading(false);
    }, [])

    async function Signup(username, password) {
        let result = "failure";

        await axios.post("/api/user/password", { username: username, password: password })
            .then(res => {
                if (res.data.response === "password_saved") {
                    localStorage.setItem("token", JSON.stringify(res.data.token));
                    setCurrentUser(res.data.token);
                    result = "success";
                } else {
                    result = res.data.response;
                }
            })
            .catch(() => { result = "failure" })

        return result;
    }

    async function Login(username, password) {
        let result = "failure";

        await axios.post("/api/user/login", { username: username, password: password })
            .then(res => {
                if (res.data.response === "authenticated") {
                    localStorage.setItem("token", JSON.stringify(res.data.token));
                    setCurrentUser(res.data.token);
                    result = "success";
                } else if (res.data.response === "create_password") {
                    result = "signup";
                } else {
                    result = res.data.response;
                }
            })
            .catch(() => { result = "failure" });

        return result;
    }
    
    async function Logout() {

    }

    const values = {
        currentUser,
        Signup,
        Login,
        Logout
    };

    return (
        <AuthContext.Provider value={values}>
            {!loading && children}
        </AuthContext.Provider>
    )
}