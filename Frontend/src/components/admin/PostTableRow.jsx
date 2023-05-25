import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import useNotificationStore from "../../store/useNotificationStore";
import axios from 'axios';
import useAuthStore from "../../store/useAuthStore";
import useSearchStore from '../../store/useSearchStore';
import AdminUserEdit from './AdminUserEdit';
import { Link } from 'react-router-dom';
import PostAdmin from './PostAdmin';

// Clodinary
import { CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from '@cloudinary/react';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";



export function PostTableRow({ post, updateTable }) {

    const token = useAuthStore(state => state.getToken());
    const [isDetailView, setIsDetailView] = useState(false);
    const [chevron, setChevron] = useState(<BsChevronDown />);
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const date = getDateString(post.createdAt);
    const time = getTimeString(post.createdAt);
    const [postAmount, setPostAmount] = useState(0);
    const [reportAmount, setReportAmount] = useState(0)
    const setSearchUser = useSearchStore(state => state.setSearchUser);

    // Notification Handler function
    const notificationHandler = useNotificationStore(state => state.notificationHandler);


    // CLOUDINARY
    let publicId
    let profileImg
    if (post.author !== null) {
        publicId = getImgPublicId(post.author.image)
        profileImg = CLOUD.image(publicId);
        profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));
    } else {
        publicId = getImgPublicId("https://res.cloudinary.com/djiwww2us/image/upload/v1683293216/Asset-Images/deleted_user_pdfhxh.png")
        profileImg = CLOUD.image(publicId);
        profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));
    };

    useEffect(() => {
        setChevron(isDetailView ? <BsChevronUp /> : <BsChevronDown />)
    }, [isDetailView]);


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

                <td className="border-l text-left p-1" colSpan="2">
                    <div className='flex items-center'>
                        <div className="flex items-center">

                            {post.author === null ?
                                <div
                                    className="relative shadow mx-2 h-10 w-10 border-white rounded-full overflow-hidden border-4">
                                    <AdvancedImage cldImg={profileImg} />
                                </div>
                                :

                                <div
                                    className="relative shadow mx-2 h-10 w-10 border-white rounded-full overflow-hidden border-4 hover:border-green-400"
                                    onClick={() => {
                                        setSearchUser(post.author)
                                    }}
                                >
                                    <Link to={`/users/${post.author.username}`} >
                                        <AdvancedImage cldImg={profileImg} />
                                    </Link>

                                </div>
                            }
                            <b>{!post.author ? "User deleted" : post.author.username}</b>
                        </div>
                    </div>
                </td>
                <td className="border-l" colSpan="2">{post.title}</td>
                <td className="border-l" colSpan="1">{post.category}</td>
                <td className="border-l" colSpan="1">{date} <br /> {time}</td>
            </tr>
            <tr className={`even:bg-gray-100 odd:bg-white ${isDetailView ? null : 'hidden'}`}>

                <td className="table-span border-l" colSpan="6">

                    <PostAdmin post={post} updateTable={updateTable} />

                </td>
            </tr>
        </>
    )
};


export default PostTableRow;