import axios from "axios";
import React, { useRef, useState } from "react";

import Button from "../../utility/button";
import Modal from "../../utility/modal";

export default function UserInfo({ user={} }) {
    const [modal, setModal] = useState(false);

    const usernameRef = useRef(user.username);
    const securityRef = useRef(user.security);

    function UpdateUser() {
        const data = user;

        data.username = usernameRef.current.value;
        data.security = securityRef.current.value;

        axios.post("/api/user/update", { data: data })
            .then(window.location.reload())
    }

    return (
        <tr>
            <td>{user.username}</td>
            <td>
                <Button onClick={_ => setModal(!modal)}>Update</Button>
            </td>
            <Modal visible={modal} onClose={setModal}>
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
        </tr>
    )
}