import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import axios from "axios";
import UserForm from "../forms/UserForm";


function AdminUserEdit({ userToEdit, setIsEdit, refresh }) {

    // Auth
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

        // Sende Request an  API
        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/admin/user/${userToEdit._id}`, updatedUser, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // display eine 'SUCCESS' Meldung und navigiere zu Login
            alertSuccessHandler(`${response.data.user.username}'s profile was successfully updated!`);

            setIsEdit(false);

            refresh();

        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.message);
        }
    };


    // Wenn user nicht eingelogt ist, dann wird ein Formular erzeugt, ansonsten wird der user zu Loginpage navigiert
    return (

        <div id="register" className=" container font-mono flex flex-col justify-center ">

            <h2 className="text-2xl mb-2 font-bold text-center text-orange-700">EDIT USER-PROFILE</h2>

            <UserForm userToEdit={userToEdit} sendRequest={sendRequest} isAdminAct={true}/>

        </div>

    );
};


export default AdminUserEdit;