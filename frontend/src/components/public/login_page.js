import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/auth_context";

import Button from "../utility/button";
import DynamicLink from "../utility/dynamic_link";

export default function LoginPage() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const { Login } = useAuth();
    const [loginState, setLoginState] = useState("login");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const result = await Login(usernameRef.current.value, passwordRef.current.value);
        setLoginState(result);
        if (result === "success") {
            window.location = "/";
        }

        setLoading(false);
    }

    function GenerateTitle() {
        if (loginState === "login") {
            return "Enter Login";
        } else if (loginState === "success") {
            return "Login Successful!"
        } else if (loginState === "create_password"){
            return "Email not registered. Signup below."
        } else if (loginState === "bad_password") {
            return "Incorrect Password"
        } else if (loginState === "not_authenticated") {
            return "Email not registered. Contact support!"
        } else {
            return "Error";
        }
    }

    return (
        <div className="app-body">
            <div className="login-page">
                <h1>
                    {GenerateTitle()}
                </h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input required type="email" ref={usernameRef} placeholder="Enter Email"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input required type="password" minLength="8" ref={passwordRef} placeholder="Enter Password"/>
                    </div>
                    <div>
                        <DynamicLink className="sub-link" to="/signup">Register Login</DynamicLink>
                        <Button disabled={loading} type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}