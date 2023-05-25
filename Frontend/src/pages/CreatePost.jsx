import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { VscClose } from 'react-icons/vsc';
import { GrAdd } from 'react-icons/gr';
import useAuthStore from "../store/useAuthStore";
import useNotificationStore from "../store/useNotificationStore";
import urlValidator from 'url-validator';
import Post from "../components/post/Post";
import { useNavigate } from "react-router-dom";
import useSpinnerStore from "../store/useSpinnerStore";
import * as Styles from "../services/styles.js";




function CreatePost() {

    const token = useAuthStore(state => state.getToken());
    const user = useAuthStore(state => state.user);
    const isAdmin = useAuthStore(state => state.isAdmin());
    const isAuthor = useAuthStore(state => state.isAuthor());
    const navigate = useNavigate();
    const [category, setCategory] = useState('story');
    const [files, setFiles] = useState([]);
    const [urls, setUrls] = useState([]);
    const titleInputRef = useRef('');
    const textInputRef = useRef('');
    const urlInputRef = useRef('');
    const fileInputRef = useRef();
    const setShowSpinner = useSpinnerStore(state => state.setShowSpinner)
    const spinnerHandler = useSpinnerStore(state => state.spinnerHandler)

    const [newPost, setNewPost] = useState({
        isCreate: true,
        author: user,
        category: category,
        title: titleInputRef.current.value,
        text: textInputRef.current.value,
        images: urls,
        comments: [],
    })

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            category: category,
            title: titleInputRef.current.value,
            text: textInputRef.current.value,
            urls: urls,
            files: files
        }

        try {
            spinnerHandler("Uploading files...")

            let response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/protected/post`, newPost, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setShowSpinner(false)

            alertSuccessHandler('New post created')
            navigate('/blogs')
        } catch (error) {
            console.log(error);
            setShowSpinner(false)
            alertFailHandler(error.message)
        }
    };


    const addToFiles = async () => {
        const inputFiles = fileInputRef.current.files;
        const inputFilesList = Array.from(inputFiles);
        const fileObjArr = await Promise.all(inputFilesList.map(async (file) => {
            const baseStr = await fileToBaseStr(file);
            const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
            const fileObj = {
                baseStr: baseStr,
                fileName: fileName
            };
            return fileObj;
        }));
        setFiles([...files, ...fileObjArr]);
    };


    async function fileToBaseStr(file) {

        const fileReader = new FileReader();

        const baseStr = await new Promise((resolve, reject) => {
            fileReader.onloadend = (evt) => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (evt) => {
                reject(evt);
            };
            fileReader.readAsDataURL(file);
        });

        return baseStr;
    };


    const handleUrlsChange = () => {
        // Teste auf gültige URL
        if (urlValidator(urlInputRef.current.value)) {

            if (urlInputRef.current.value) {
                setUrls(prev => ([
                    ...prev,
                    urlInputRef.current.value]));
            };
            alertSuccessHandler('Added URL')
        } else {
            alertFailHandler('Invalid URL')
        }
    };


    // delete Urls
    function deleteUrlsFromList(i) {
        let newUrls = [...urls];
        newUrls.splice(i, 1);
        setUrls(newUrls);
    };


    // delete files
    function deleteFilesFromList(i) {
        let newFiles = [...files];
        newFiles.splice(i, 1);
        setFiles(newFiles);
    };


    useEffect(() => {
        fileInputRef.current.value = '';

        // Hole base-Formate aus Array
        const baseArr = files.map(file => {
            return file.baseStr
        });

        //Fusioniere beide Arrays
        const fileArr = [...urls, ...baseArr];

        // Übergebe an newPost
        setNewPost({ ...newPost, images: fileArr })
    }, [files]);


    useEffect(() => {
        urlInputRef.current.value = '';

        // Hole base-Formate aus Array
        const baseArr = files.map(file => {
            return file.baseStr
        });

        //Fusioniere beide Arrays
        const fileArr = [...urls, ...baseArr];

        // Übergebe an newPost
        setNewPost({ ...newPost, images: fileArr })
    }, [urls]);


    useEffect(() => {
        setNewPost({ ...newPost, category: category })
    }, [category]);


    function updatePreview(evt) {
        setNewPost({ ...newPost, [evt.target.name]: evt.target.value })
    }


    return (
        <div className="mx-auto w-full md:w-3/4  flex flex-col-reverse  p-4 gap-10">

            <div className="w-full">
                <Post post={newPost} />
            </div>

            <form 
                onSubmit={handleSubmit} 
                className="w-full flex flex-col justify-start gap-5" 
            >
                {/* TITLE */}
                <fieldset className="mb-4 p-2 border-b-2 border-cyan-800">
                    <input
                        type="text"
                        name="title"
                        ref={titleInputRef}
                        onChange={(evt) => updatePreview(evt)}
                        className={`${Styles.input2} w-full`}
                        placeholder="Title"
                        required
                    />
                </fieldset>
                {/* TEXT CONTENT */}
                <fieldset className="mb-4 p-2 border-b-2 border-cyan-800">
                    <textarea
                        ref={textInputRef}
                        name="text"
                        onChange={(evt) => updatePreview(evt)}
                        id="content"
                        className={`${Styles.input2} w-full`}
                        rows="10"
                        placeholder="Create your content ...">

                    </textarea>
                </fieldset>
                {/* CATEGORY */}
                <fieldset className="mb-4 p-2 ">
                    <select 
                        defaultValue={category} 
                        className={`bg-transparent border border-cyan-500 text-cyan-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        onChange={(evt) => setCategory(evt.target.value)} 
                    >
                        <option className="bg-gray-700 " value={'story'}>story</option>
                        <option className="bg-gray-700" value={'review'}>review</option>
                        <option className="bg-gray-700" value={'market'}>market</option>
                        {(isAdmin || isAuthor) && <option className="bg-gray-700" value='article'>article</option>}
                    </select>
                </fieldset>


                <div className=" mb-4 w-full">
                    {/* FILES INPUT */}
                    <fieldset className="mb-4 p-2 flex justify-between border-b-2 border-cyan-800">


                        {/* FILES */}
                        <input
                            type="file"
                            id="file"
                            ref={fileInputRef}
                            multiple
                            className={`text-cyan-500 focus:outline-none border-none outline-none bg-transparent w-5/6`}
                        />                           

                        {/* Add file button */}
                        <button
                            type="button"
                            onClick={addToFiles}
                            className="bg-green-600 rounded-md h-10 w-10 flex justify-center items-center">
                            <GrAdd />
                        </button>
                    </fieldset>


                    {/* FILES LIST */}
                    <ol className="flex flex-col gap-5 my-5 list-decimal overflow-hidden">

                        {files.map((file, i) => {
                            return <li className="text-white relative left-24"
                                key={i}
                            >
                                < VscClose
                                    onClick={() => deleteFilesFromList(i)}
                                    size={24}
                                    className="hover:text-red-500 absolute -left-24 cursor-pointer"
                                />
                                <span>{file.fileName}</span>                       
                            </li>
                        })}

                    </ol>

                        {/* URL INPUT */}
                    <fieldset className="mb-4 p-2 flex justify-between border-b-2 border-cyan-800">

                        <input
                            ref={urlInputRef}
                            type="text"
                            className={`${Styles.input2} `}
                            placeholder="Save Url"
                        />

                        {/* Add URL button */}
                        <button type="button" className="text-white bg-green-600 rounded-md h-10 w-10 flex justify-center items-center"
                            onClick={handleUrlsChange}>
                            <GrAdd className="text-white" />
                        </button>

                    </fieldset>


                    <ol className="flex flex-col gap-5 my-5 list-decimal overflow-hidden">

                        {urls.map((link, i) => {
                            return <li className="text-white relative left-24"
                                key={i}
                            >
                                < VscClose
                                    onClick={() => deleteUrlsFromList(i)}
                                    size={24}
                                    className="hover:text-red-500 absolute -left-24 cursor-pointer"
                                />
                                <span>{link}</span>                       
                            </li>
                        })}

                    </ol>

                </div>
                <div className="flex flex-col items-center">
                    <button type="submit" 
                    className="w-fit bg-indigo-500 font-bold text-white py-2 px-4 focus:outline-none focus:shadow-outline rounded-full"
                    >
                        Create Post
                    </button>

                </div>

            </form>
        </div>

    )
}

export default CreatePost;