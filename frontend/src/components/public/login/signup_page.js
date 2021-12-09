import React, { useRef, useState } from "react";
import { useAuth } from "../../../contexts/auth_context";

import Button from "../../utility/button";
import DynamicLink from "../../utility/dynamic_link";

export default function SignupPage() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const { Signup } = useAuth();
    const [loginState, setLoginState] = useState("signup");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const result = await Signup(usernameRef.current.value, passwordRef.current.value);
        setLoginState(result);
        if (result === "success") {
            window.location = "/";
        }

        setLoading(false);
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
                <div className="login-page-form">
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>
                            {GenerateHeader()}
                        </h1>
                        <div className="form-group">
                            <input required type="email" ref={usernameRef} placeholder="Enter Email"/>
                            <label>Username</label>
                        </div>
                        <div className="form-group">
                            <input required type="password" minLength="8" ref={passwordRef} placeholder="Enter Password"/>
                            <label>Password</label>
                        </div>
                        <div className="form-buttons">
                            <DynamicLink className="sub-link" to="/login">Login</DynamicLink>
                            <Button disabled={loading} type="submit">Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}