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
        const tokenString = JSON.parse(localStorage.getItem("token"));
        if (tokenString && tokenString.auth === "approved") {
            setToken(tokenString);
        }

        // Send JWT Auth token to server for verification
        // await axios.post()

        setLoading(false);
    }, [])

    async function Signup(username, password) {
        let result = "failure";

        await axios.post("/api/user/password", { username: username, password: password })
            .then(res => {
                if (res.data.response === "password_saved") {
                    setToken(res.data.token);
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
                    setToken(res.data.token);
                    result = "success";
                } else {
                    result = res.data.response;
                }
            })
            .catch(() => { result = "failure" });

        return result;
    }
    
    async function Logout() {
        setToken({});
    }

    function setToken(token) {
        localStorage.setItem("token", JSON.stringify(token));
        setCurrentUser(token);
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