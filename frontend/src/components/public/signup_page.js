import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/auth_context";

import Button from "../utility/button";
import DynamicLink from "../utility/dynamic_link";

export default function SignupPage() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const { Signup } = useAuth();
    const [loginState, setLoginState] = useState("signup");

    async function handleSubmit(e) {
        e.preventDefault(); 

        const result = await Signup(usernameRef.current.value, passwordRef.current.value);
        setLoginState(result);
        if (result === "success") {
            window.location = "/";
        }
    }

    function GenerateHeader() {
        if (loginState === "signup") {
            return "Register";
        } else if (loginState === "password_notsaved") {
            return "Email not registered. Contact support!";
        } else if (loginState === "success") {
            return "Please Login"
        } else {
            return "error";
        }
    }

    return (
        <div className="app-body">
            <div className="login-page">
                <h1>
                    {GenerateHeader()}
                </h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="email" ref={usernameRef} placeholder="Enter Email"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" minLength="8" ref={passwordRef} placeholder="Enter Password"/>
                    </div>
                    <div>
                        <DynamicLink className="sub-link" to="/login">Login</DynamicLink>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}