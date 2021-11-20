import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/auth_context";
import Button from "../utility/button";

export default function LoginPage() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const { Login, Signup } = useAuth();
    const [loginState, setLoginState] = useState("login");

    async function handleSubmit(e) {
        e.preventDefault();

        if (loginState === "login" || loginState === "bad_password") {
            const result = await Login(usernameRef.current.value, passwordRef.current.value);
            setLoginState(result);
        } else if (loginState === "signup") {
            const result = await Signup(usernameRef.current.value, passwordRef.current.value);
            setLoginState(result);
        }
    }

    function GenerateTitle() {
        if (loginState === "login") {
            return "Enter Username";
        } else if (loginState === "signup") {
            return "Enter new password";
        } else if (loginState === "success") {
            return "Login Successful!"
        } else if (loginState === "password_saved") {
            return "Login Created Succesfully!"
        } else if (loginState === "bad_password") {
            return "Please enter password"
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
                        <input type="email" ref={usernameRef} placeholder="Enter Username"/>
                    </div>
                    {loginState !== "login" && <div className="form-group">
                        <label>Password</label>
                        <input type="password" ref={passwordRef} placeholder="Enter Password"/>
                    </div>}
                    <div>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}