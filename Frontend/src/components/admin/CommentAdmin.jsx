// CLOUDINARY
import { CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from "@cloudinary/react";
// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { Link } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { VscClose, VscSettings, VscWarning } from 'react-icons/vsc';
import CommentEditForm from "../comments/CommentEditForm.jsx";
import useNotificationStore from "../../store/useNotificationStore.js";



function CommentAdmin({ comment, updateTable }) {


    const token = useAuthStore(state => state.getToken());
    const [isEdit, setIsEdit] = useState(false);
    const setSearchUser = useSearchStore(state => state.setSearchUser);


    // CLOUDINARY
    let publicId
    let profileImg
    if (comment.author !== null) {
        publicId = getImgPublicId(comment.author.image)
        profileImg = CLOUD.image(publicId);
        profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));
    } else {
        publicId = getImgPublicId("https://res.cloudinary.com/djiwww2us/image/upload/v1683293216/Asset-Images/deleted_user_pdfhxh.png")
        profileImg = CLOUD.image(publicId);
        profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));
    };


    // Notification Handler function
    const notificationHandler = useNotificationStore(state => state.notificationHandler);

    // Wenn die Daten zum Server korrekt gesendet sind, wird ein Alert mit Success erzeugt
    function alertSuccessHandler(msg) {
        notificationHandler('success', msg)
    }
    // Wenn bei register ein Fehler, wird ein Alert mit Fehlermeldung erzeugt
    function alertFailHandler(msg) {
        notificationHandler('fail', msg)
    }



    function getImgPublicId(url) {

        let publicId;

        if (!url || url.length < 1) {
            // Setzt Default Image aus Asset-Ordner (Cloudinary)
            publicId = "Asset-Images/anonym_bllrvm";
        } else {
            // Sucht nach dem zweitletzten "/" und speichert dessen Index
            const secondLastSlashIndex = url.lastIndexOf('/', url.lastIndexOf('/') - 1);
            // Extrahiert den Teilstring zwischen dem zweitletzten "/" und dem letzten "."
            publicId = url.substring(secondLastSlashIndex + 1, url.lastIndexOf('.'));
        }
        // Gibt den extrahierten Dateinamen zurück
        return publicId;
    };


    async function deleteComment(id) {

        try {
            // delete comment von server
            await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/` + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alertSuccessHandler('Comment deleted');

            updateTable();

        } catch (error) {
            console.log(error);
            alertFailHandler(error.message);
        }
    };


    async function editComment(id, text) {
        try {
            // edit comment Anfrage an server
            await axios.put(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/` + id, { text }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alertSuccessHandler('Comment successfully edited');

            updateTable();

        } catch (error) {
            console.log(error);
            alertFailHandler(error.message);
        }
    };


    return (
        <ul className='w-full bg-gray-500 text-gray-400  rounded-xl p-4 flex flex-col gap-5'>
            <li className="relative px-5 py-3 bg-gray-800 rounded-xl flex flex-col gap-5 text-xs md:text-lg">

                <div className="flex items-center gap-3">

                    {/* author image klickbar */}
                    {comment.author === null ?
                        <div
                            className="h-8 w-8 border-white rounded-full overflow-hidden border-4">
                            <AdvancedImage cldImg={profileImg} />
                        </div>
                        :

                        <div
                            className="h-8 w-8 border-white rounded-full overflow-hidden border-4 hover:border-green-400"
                            onClick={() => {
                                setSearchUser(comment.author)
                            }}
                        >
                            <Link to={`/users/${comment.author.username}`} >
                                <AdvancedImage cldImg={profileImg} />
                            </Link>

                        </div>
                    }

                    {/*  author name */}
                    <span className="text-gray-500">{!comment.author ? "User deleted" : comment.author.fullname}</span>
                </div>
                {/*  Text */}
                {isEdit ?
                    <CommentEditForm setIsEdit={setIsEdit} editCommentCallback={editComment} commentId={comment._id} text={comment.text} />
                    :
                    <span className="px-3  bg-gray-800 ">{comment.text}</span>}
                {
                    <>
                        <VscSettings
                            onClick={() => setIsEdit(true)}
                            size={22}
                            className="hover:text-blue-500 absolute top-3 right-12 cursor-pointer text-gray-500"
                        />

                        < VscClose
                            onClick={() => deleteComment(comment._id)}
                            size={24}
                            className="hover:text-red-500 absolute top-3 right-3 cursor-pointer text-gray-500"
                        />
                    </>
                }

            </li>
        </ul>
    )
}

export default CommentAdmin;