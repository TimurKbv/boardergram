// CLOUDINARY
import { CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from "@cloudinary/react";
// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import useAuthStore from "../../store/useAuthStore.js";
import { VscClose, VscSettings, VscWarning } from 'react-icons/vsc';
import { useState } from "react";
import CommentEditForm from "./CommentEditForm.jsx";
import useReportStore from "../../store/useReportStore.js";
import { Link } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore.js";



function Comment({ comment, editCommentCallback, deleteCommentCallback }) {

    const user = useAuthStore(state => state.user);
    const [isEdit, setIsEdit] = useState(false)
    const sendReport = useReportStore(state => state.sendReport);
    const setSearchUser = useSearchStore(state => state.setSearchUser);
    const isAdmin = useAuthStore(state => state.isAdmin());

    // CLOUDINARY
    const publicId = getImgPublicId(comment.author.image)
    const profileImg = CLOUD.image(publicId);
    profileImg.resize(thumbnail().width(50).height(50)).roundCorners(byRadius(50));

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

    return (
        <li className="relative px-5 py-3 bg-gray-800 rounded-xl flex flex-col gap-5 text-xs md:text-lg">

            <div className="flex items-center gap-3">
                {/* author image klickbar */}
                <div
                    className="h-8 w-8 border-white rounded-full overflow-hidden border-4 hover:border-green-400"
                    onClick={() => setSearchUser(comment.author)}
                >
                    <Link to={`/users/${comment.author.username}`} >
                        <AdvancedImage cldImg={profileImg} />
                    </Link>
                </div>
                {/*  author name */}
                <span className="text-gray-500">{comment.author.fullname}</span>
            </div>
            {/*  Text */}
            {isEdit ?
                <CommentEditForm setIsEdit={setIsEdit} editCommentCallback={editCommentCallback} commentId={comment._id} text={comment.text} />
                :
                <span className="px-3  bg-gray-800 ">{comment.text}</span>}



            {
                (user._id === comment.author._id || isAdmin) &&
                <>
                    <VscSettings
                        onClick={() => setIsEdit(true)}
                        size={22}
                        className="hover:text-blue-500 absolute top-3 right-12 cursor-pointer"
                    />

                    < VscClose
                        onClick={() => deleteCommentCallback(comment._id)}
                        size={24}
                        className="hover:text-red-500 absolute top-3 right-3 cursor-pointer"
                    />
                </>
            }
            <VscWarning
                className="self-end hover:text-red-600 cursor-pointer"
                onClick={() => sendReport(comment.type, comment._id)}
            />
        </li>
    )
}

export default Comment;