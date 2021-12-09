import axios from "axios";
import React, { useRef, useState } from "react";

import Button from "../../utility/button";
import Modal from "../../utility/modal";

export default function UserInfo({ user={} }) {
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const usernameRef = useRef(user.username);
    const securityRef = useRef(user.security);

    function UpdateUser() {
        const data = user;

        data.username = usernameRef.current.value;
        data.security = securityRef.current.value;

        axios.post("/api/user/update", { data: data })
            .then(window.location.reload())
    }

    function DeleteUser() {
        axios.delete("/api/user/delete", { data: { username: user.username } })
            .then(window.location.reload())
    }

    function ResetPassword() {
        axios.post("/api/user/resetpassword", { username: user.username })
            .then(res => console.log(res.data.response))
    }

    return (
        <tr>
            <td>{user.username}</td>
            <td>
                <Button onClick={_ => setUpdateModal(!updateModal)}>Update</Button>
            </td>
            <td>
                <Button onClick={_ => setDeleteModal(!deleteModal)}>Delete</Button>
            </td>
            <td>
                <Button onClick={ResetPassword}>Reset Password</Button>
            </td>
            <Modal visible={updateModal} onClose={setUpdateModal}>
                <div className="flex add-gap margin-top">
                    <label>Username</label>
                    <input type="email" ref={usernameRef} defaultValue={user.username}/>
                </div>
                <div className="flex add-gap margin-top">
                    <label>Security</label>
                    <input type="text" ref={securityRef} defaultValue={user.security}/>
                </div>
                <Button onClick={UpdateUser}>Update</Button>
            </Modal>
            <Modal visible={deleteModal} onClose={setDeleteModal}>
                <h1>Are you sure?</h1>
                <Button onClick={DeleteUser}>DELETE</Button>
            </Modal>
        </tr>
    )
}