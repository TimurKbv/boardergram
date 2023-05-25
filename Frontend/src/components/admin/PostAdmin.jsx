import ImageSliderAdmin from './ImageSliderAdmin.jsx';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../store/useAuthStore.js';
import useNotificationStore from '../../store/useNotificationStore.js';
import { Link } from 'react-router-dom';
import useSearchStore from '../../store/useSearchStore.js';
import { VscClose, VscSettings } from 'react-icons/vsc';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';

// CLOUDINARY
import { CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from '@cloudinary/react';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";



function PostAdmin({ post, updateTable }) {

    // Auth?
    const token = useAuthStore(state => state.getToken());

    // States
    const [currSlide, setCurrSlide] = useState(1);
    // const [author, setAuthor] = useState(null);
    const [isInit, setIsInit] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [files, setFiles] = useState(post.images);
    const [titleInput, setTitleInput] = useState(post.title);
    const [textInput, setTextInput] = useState(post.text);
    const [categoryInput, setCategoryInput] = useState(post.category);

    // search user by avatar click
    const setSearchUser = useSearchStore(state => state.setSearchUser);


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


    function deleteFile(index) {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
        alertSuccessHandler('File was removed from post');
    };


    async function deletePost() {

        try {

            let response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/protected/post/${post._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alertSuccessHandler('Post deleted');

            updateTable();

        } catch (error) {
            console.log(error);
            alertFailHandler(error.message);
        }
    }


    function cancelEdit() {
        setIsEdit(false)
    };


    async function sendUpdatedPost() {

        const updatePost = {
            title: titleInput,
            category: categoryInput,
            text: textInput,
            images: files
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/protected/post/${post._id}`, updatePost, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            alertSuccessHandler(`Post was successfully updated!`);

            setIsEdit(false);

            updateTable()

        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.message);
        }
    };





    return (

        // Container
        <div className="flex container justify-center relative items-center bg-zinc-900 py-10 rounded-2xl" id={post._id}>

            <>
                <VscSettings
                    onClick={() => setIsEdit(!isEdit)}
                    size={22}
                    className="hover:text-blue-500 absolute top-3 right-12 cursor-pointer text-gray-500"
                />

                < VscClose
                    onClick={() => deletePost()}
                    size={24}
                    className="hover:text-red-500 absolute top-3 right-3 cursor-pointer text-gray-500"
                />
            </>

            <div className=" container flex flex-col gap-7  justify-center items-center w-3/4 md:w-3/4 h-full rounded-md">

                {/* Section 1 mit Bilder */}
                {files.length > 0 && <span className='text-white'>{currSlide}/{files.length}</span>}
                <ImageSliderAdmin slides={files} setCurrSlide={setCurrSlide} isEdit={isEdit} deleteFile={deleteFile} />


                {/* Section 2 Mit Text content*/}
                <section className="text-justify flex flex-col w-full gap-5">

                    <div className="flex flex-row justify-between gap-2 mb-3">

                        {/* Profil image klickbar*/}
                        <div className="flex items-center">

                            {post.author === null ?
                                <div
                                    className="relative shadow mx-auto h-10 w-10 border-white rounded-full overflow-hidden border-4">
                                    <AdvancedImage cldImg={profileImg} />
                                </div>
                                :

                                <div
                                    className="relative shadow mx-auto h-10 w-10 border-white rounded-full overflow-hidden border-4 hover:border-green-400"
                                    onClick={() => {
                                        setSearchUser(post.author)
                                    }}
                                >
                                    <Link to={`/users/${post.author.username}`} >
                                        <AdvancedImage cldImg={profileImg} />
                                    </Link>

                                </div>
                            }
                            <h3 className="ml-2 text-white text-xs font-bold ">{!post.author ? "User deleted" : post.author.fullname}</h3>
                        </div>

                        {/* Category */}
                        {isEdit ?
                            <select value={categoryInput} onChange={event => setCategoryInput(event.target.value)}
                                className="bg-gray-800 appearance-none w-fit h-fit p-1 text-xs text-red-500 focus:outline-none">
                                <option value={'story'}>story</option>
                                <option value={'review'}>review</option>
                                <option value={'market'}>market</option>
                            </select>
                            :
                            (post.category !== 'article' && <span className="text-xs text-red-500 h-fit p-1">{post.category}</span>)
                        }
                    </div>

                    {/* TITLE */}
                    {isEdit ?
                        <input type='text'
                            className='bg-gray-800 font-bold md:text-xl text-gray-200 ml-1'
                            value={titleInput}
                            onChange={evt => setTitleInput(evt.target.value)}
                        />
                        :
                        <h2 className='font-bold md:text-xl text-gray-200 ml-1'>{post.title}</h2>
                    }

                    {/* Text */}
                    {isEdit ?
                        <textarea
                            className='bg-gray-800 text-xs md:text-lg text-gray-400 ml-1 h-auto'
                            value={textInput}
                            onChange={evt => setTextInput(evt.target.value)}
                            rows={5}
                        />
                        :
                        <p className="text-xs md:text-lg text-gray-400 ml-1">
                            {post.text}
                        </p>
                    }

                </section>

            </div>
            {isEdit ?
                <>
                    <AiOutlineCheckCircle
                        className="hover:text-green-500 absolute bottom-3 right-3 cursor-pointer text-gray-500"
                        size={24}
                        onClick={sendUpdatedPost}
                    />
                    <MdOutlineCancel
                        className="hover:text-red-500 absolute bottom-3 right-12 cursor-pointer text-gray-500"
                        size={24}
                        onClick={cancelEdit}
                    />
                </>
                : null
            }
        </div>
    )
}

export default PostAdmin;