import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import useNotificationStore from "../../store/useNotificationStore";
import axios from 'axios';
import useAuthStore from "../../store/useAuthStore";
import useSearchStore from '../../store/useSearchStore';
import AdminUserEdit from './AdminUserEdit';
import { Link } from 'react-router-dom';

// Clodinary
import { CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from '@cloudinary/react';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";



export function UserTableRow({ user, refresh }) {

    const token = useAuthStore(state => state.getToken());
    const [isDetailView, setIsDetailView] = useState(false);
    const [chevron, setChevron] = useState(<BsChevronDown />);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const date = getDateString(user.lastLogin);
    const time = getTimeString(user.lastLogin);
    const [postAmount, setPostAmount] = useState(0);
    const [reportAmount, setReportAmount] = useState(0)
    const setSearchUser = useSearchStore(state => state.setSearchUser);


    // Notification Handler function
    const notificationHandler = useNotificationStore(state => state.notificationHandler);

    const publicId = getImgPublicId(user.image);
    const profileImg = CLOUD.image(publicId);
    profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));

    useEffect(() => {
        setChevron(isDetailView ? <BsChevronUp /> : <BsChevronDown />)
    }, [isDetailView]);


    async function getPostAmount() {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/posts/amount/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setPostAmount(response.data.postAmount);

        } catch (error) {

            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };

    async function getReportAmount() {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/reports/amount/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setReportAmount(response.data.reportAmount);

        } catch (error) {

            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };

    getPostAmount();
    getReportAmount();


    // Wenn die Daten zum Server korrekt gesendet sind, wird ein Alert mit Success erzeugt
    function alertSuccessHandler(msg) {
        notificationHandler('success', msg)
    };
    // Wenn bei register ein Fehler, wird ein Alert mit Fehlermeldung erzeugt
    function alertFailHandler(msg) {
        notificationHandler('fail', msg)
    };


    function getImgPublicId(url) {

        let publicId

        if (!url || url.length < 1) {

            // Setzt Default Image aus Asset-Ordner (Cloudinary)
            publicId = "Asset-Images/anonym_bllrvm"

        } else {

            // Sucht nach dem zweitletzten "/" und speichert dessen Index
            const secondLastSlashIndex = url.lastIndexOf('/', url.lastIndexOf('/') - 1);

            // Extrahiert den Teilstring zwischen dem zweitletzten "/" und dem letzten "."
            publicId = url.substring(secondLastSlashIndex + 1, url.lastIndexOf('.'));
        }

        // Gibt den extrahierten Dateinamen zurück
        return publicId;
    };


    function handleShowDetails() {
        setIsDetailView(!isDetailView)
    };


    function toggleDeleteModal() {
        setIsDelete(isDelete => !isDelete)
    };


    async function deleteUser() {

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/admin/user/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            toggleDeleteModal();

            refresh()

            // display eine 'SUCCESS' Meldung und navigiere zu Login
            alertSuccessHandler(`User ${user.username} was deleted!`);

        } catch (error) {

            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };


    function toggleEditMode() {
        setIsEdit(isEdit => !isEdit)
    }


    function getDateString(date) {

        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const dayOfMonth = dateObj.getDate();

        const dateString = `${dayOfMonth < 10 ? 0 : ""}${dayOfMonth}.${month < 10 ? 0 : ""}${month}.${year}`

        return dateString
    };


    function getTimeString(date) {

        const dateObj = new Date(date);
        const hour = dateObj.getHours();
        const min = dateObj.getMinutes();
        const sec = dateObj.getSeconds();

        const timeString = `${hour < 10 ? 0 : ""}${hour}:${min < 10 ? 0 : ""}${min}:${sec < 10 ? 0 : ""}${sec}`

        return timeString
    };


    return (
        <>
            <tr className="even:bg-gray-100 odd:bg-white border-b hover:bg-gray-400" onClick={handleShowDetails}>
                {/* <td className="p-1 flex justify-center bg-opacity-0" colSpan="1"></td> */}
                <td className="border-l text-left p-1" colSpan="2">
                    <div className='flex items-center'>
                        <div
                            className="relative mx-2 shadow h-10 w-10 border-white rounded-full overflow-hidden border-4 hover:border-green-400"
                            onClick={() => {
                                setSearchUser(user)
                            }}
                        >
                            <Link to={`/users/${user.username}`} >
                                <AdvancedImage cldImg={profileImg} />
                            </Link>

                        </div>
                        <b>{user.username}</b>
                    </div>
                </td>
                <td className="border-l" colSpan="1">{user.role}</td>
                <td className="border-l" colSpan="1">{postAmount}</td>
                <td className="border-l" colSpan="1">{reportAmount}</td>
            </tr>
            <tr className={`even:bg-gray-100 odd:bg-white ${isDetailView ? null : 'hidden'}`}>

                <td className="table-span border-l" colSpan="5">

                    <div className="w-full p-3 text-left">

                        <div className="w-full flex justify-between">
                            <p>Fullname: {user.fullname}</p>
                            <p>Last Login: {user.lastLogin === undefined ? "n/a" : (`${date}, ${time}`)}</p>
                        </div>

                        <p>eMail: <a href={`mailto:${user.email}`}></a>{user.email}</p>

                        <p className="underline mt-3">Description:</p>

                        <div className="w-full flex justify-between">

                            <div className="w-full flex">
                                <p className="mr-2">Preferred Stance:</p>
                                <p>{user.description === undefined ? "n/a" : user.description.prefStance}</p>
                            </div>

                            <div className="w-full flex justify-end">
                                <p className="mr-2">Style:</p>
                                <p>{user.description === undefined ? "n/a" : user.description.style}</p>
                            </div>

                        </div>

                        <div className="w-full flex">
                            <p className="mr-2">Equipment:</p>
                            <p>{user.description === undefined ? "n/a" : user.description.equipment}</p>
                        </div>

                        <div className="w-full flex">
                            <p className="mr-2">Favorite Locations:</p>
                            <p>{user.description === undefined ? "n/a" : user.description.favLocations}</p>
                        </div>

                        <p className="underline mt-3">About me:</p>
                        <div className="w-full text-center border">{user.description === undefined ? "n/a" : user.description.text}</div>

                        {isDelete ?
                            (
                                <div className="bg-white w-full flex items-center mt-3">
                                    <p className="w-full">Are you sure you want to delete this user?</p>
                                    <button onClick={toggleDeleteModal} className="w-auto px-3 mr-2 rounded-full p-1 text-gray-200 bg-indigo-500 hover:bg-white hover:text-indigo-600">Cancel</button>
                                    <button onClick={deleteUser} className="w-auto px-3 rounded-full p-1 text-gray-200 bg-indigo-500 hover:bg-white hover:text-indigo-600">Delete</button>
                                </div>

                            ) :
                            (
                                <div className="w-full flex justify-end mt-3">
                                    <button onClick={toggleEditMode} className="w-auto px-3 mr-2 rounded-full p-1 text-gray-200 bg-indigo-500 hover:bg-white hover:text-indigo-600">Edit</button>
                                    <button onClick={toggleDeleteModal} className="w-auto px-3 rounded-full p-1 text-gray-200 bg-indigo-500 hover:bg-white hover:text-indigo-600">Delete</button>
                                </div>
                            )
                        }

                        {isEdit &&
                            <AdminUserEdit userToEdit={user} setIsEdit={setIsEdit} refresh={refresh} />
                        }



                    </div>
                </td>
            </tr>
        </>
    )
};


export default UserTableRow;