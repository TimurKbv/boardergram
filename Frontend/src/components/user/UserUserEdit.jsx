import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import axios from "axios";
import UserForm from "../forms/UserForm";
import { useEffect, useState } from "react";


function UserUserEdit({ userToEdit, setIsEdit }) {

    // Auth
    const updateUser = useAuthStore((state) => state.updateUser);
    const token = useAuthStore(state => state.getToken());


    // Notification Handler function
    const notificationHandler = useNotificationStore(state => state.notificationHandler);

    // Wenn die Daten zum Server korrekt gesendet sind, wird ein Alert mit Success erzeugt
    function alertSuccessHandler(msg) {
        notificationHandler('success', msg)
    };
    // Wenn bei register ein Fehler, wird ein Alert mit Fehlermeldung erzeugt
    function alertFailHandler(msg) {
        notificationHandler('fail', msg)
    };


    async function sendRequest(updatedUser) {

        // Sende Request an /register endpoint der API
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/protected/user`, updatedUser, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // display eine 'SUCCESS' Meldung und navigiere zu Login
            alertSuccessHandler(`Your profile was successfully updated!`);

            updateUser(response.data.user);

            setIsEdit(false);

        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.message);
        };
    };


    // Wenn user nicht eingelogt ist, dann wird ein Formular erzeugt, ansonsten wird der user zu Loginpage navigiert
    return (

        <div id="edit" className="container flex flex-col justify-center items-center">

            <h2 className="text-2xl mb-2 font-bold text-center text-cyan-500">EDIT YOUR PROFILE</h2>

            <UserForm userToEdit={userToEdit} sendRequest={sendRequest} isAdminAct={false}/>

        </div>
    );
};


export default UserUserEdit;