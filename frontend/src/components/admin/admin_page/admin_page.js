import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "../../utility/button";
import UserInfo from "./user_info";
import Modal from "../../utility/modal";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [createUserModal, setCreateUserModal] = useState(false);

    const usernameRef = useRef("");
    const securityRef = useRef(0);

    useEffect(() => {
        axios.get("/api/user/all")
            .then(res => {
                setUsers(res.data.response);
            })
    }, [])

    function CreateUser() {
        axios.post("/api/user/create", 
            { username: usernameRef.current.value, security: securityRef.current.value })
            .then(window.location.reload())
    }

    return (
        <div className="app-body">
            <div className="report-page">
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Users</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(usr => {
                                return (
                                    <UserInfo user={usr} />
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Button onClick={_ => setCreateUserModal(!createUserModal)}>Create User</Button>
                <Modal visible={createUserModal} onClose={setCreateUserModal}>
                    <div className="flex add-gap margin-top">
                        <label>Username</label>
                        <input type="email" ref={usernameRef}/>
                    </div>
                    <div className="flex add-gap margin-top">
                        <label>Security</label>
                        <input type="text" ref={securityRef} defaultValue={0}/>
                    </div>
                    <Button onClick={CreateUser}>Create</Button>
                </Modal>
            </div>
        </div>
    )
}