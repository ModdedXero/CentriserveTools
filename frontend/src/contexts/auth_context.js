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
        const tokenString = sessionStorage.getItem("token");
        if (tokenString && tokenString.auth === "approved") {
            setToken("token", tokenString);
        }

        setLoading(false);
    }, [])

    async function Signup(username, password) {
        let result = "failure";

        await axios.post("/api/user/password", { username: username, password: password })
            .then(res => {
                if (res.data.response === "password_saved") {
                    console.log(res.data.token)
                    setToken("token", JSON.stringify(res.data.token));
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
                    console.log(res.data.token);
                    setToken("token", JSON.stringify(res.data.token));
                    result = "success";
                } else if (res.data.response === "create_password") {
                    console.log(res.data.response)
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

    function setToken(token) {
        console.log(token);
        sessionStorage.setItem("token", token);
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