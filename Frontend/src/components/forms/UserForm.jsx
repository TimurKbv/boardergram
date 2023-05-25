import { useEffect, useState, useRef } from "react";
import useNotificationStore from "../../store/useNotificationStore";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import * as Styles from "../../services/styles.js";
import { RiShieldKeyholeFill } from 'react-icons/ri';
import { FaCity } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { AiOutlineCloud } from 'react-icons/ai';
import useAuthStore from "../../store/useAuthStore";
import axios from 'axios'
import ImageChooser from "../user/ImageChooser";
import { VscClose } from 'react-icons/vsc';


function UserForm({ userToEdit, sendRequest, isAdminAct }) {

    const [username, setUsername] = useState(userToEdit.username);
    const [fullname, setFullname] = useState(userToEdit.fullname);
    const [email, setEmail] = useState(userToEdit.email);
    const [city, setCity] = useState(userToEdit.city);
    const [bday, setBday] = useState(userToEdit.birthday);
    const [profileImage, setProfileImage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [role, setRole] = useState(userToEdit.role);
    const token = useAuthStore(state => state.getToken());
    const profileImgRef = useRef();
    const bgImgRef = useRef();

    // für Description-Sub-Object, wenn description-key nicht vorhanden dann ersetze durch "n/a"
    const [prefStance, setPrefStance] = useState(!userToEdit.description ? "n/a" : userToEdit.description.prefStance);
    const [favLocations, setFavLocations] = useState(!userToEdit.description ? "n/a" : userToEdit.description.favLocations);
    const [style, setStyle] = useState(!userToEdit.description ? "n/a" : userToEdit.description.style);
    const [equipment, setEquipment] = useState(!userToEdit.description ? "n/a" : userToEdit.description.equipment);
    const [text, setText] = useState(!userToEdit.description ? "n/a" : userToEdit.description.text);

    // State für Fehlermeldung
    const [errormessage, setErrormessage] = useState({
        username: '',
        password: '',
        passwordRepeat: ''
    });

    /* Array mit Objekten der Filtermöglichkeiten */
    let optionValues = [
        { label: 'User', value: 'user' },
        { label: 'Author', value: 'author' },
        { label: 'Admin', value: 'admin' }
    ];

    // für Image-Auswahl
    const [isInit, setIsInit] = useState(true);
    const [cloudFiles, setCloudFiles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [filesFor, setFilesFor] = useState('profile');

    async function getCloudFiles() {
        try {

            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/user/files/${userToEdit._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setCloudFiles([...response.data.urls])

        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (isInit) {
            getCloudFiles()
            setIsInit(false)
        }
    }, []);


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


    const roleSelect = <select defaultValue={userToEdit.role} onChange={evt => setRole(evt.target.value)}
        className="p-1 rounded-md text-white bg-black hover:text-indigo-200 mt-6">
        {optionValues.map((role) => (
            <option key={role.value} value={role.value} className="rounded-md p-2"
                >{role.label}
            </option>
        ))}
    </select>



    // Form Submit
    async function submitHandler(evt) {
        evt.preventDefault();

        // Wenn ist kürzer als 3 Zeichen, dann Fehlermeldung und early return
        if (username.trim().length < 3) {
            setErrormessage(prev => {
                return {
                    username: 'Username should be longer than 3 characters'
                }
            });
            return;
        }


        // Erstelle User-Objekt fuer den Body des Requests
        let updatedUser = {
            username: username,
            fullname: fullname,
            email: email,
            city: city,
            birthday: bday,
            description: {
                prefStance: prefStance,
                favLocations: favLocations,
                style: style,
                equipment: equipment,
                text: text,
            },
            image: profileImage,
            bgImage: backgroundImage
        };

        if (isAdminAct) updatedUser.role = role;

        sendRequest(updatedUser)
    };


    function setImage(evt) {

        let use = evt.target.name;

        const file = evt.target.files[0];

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file)

        fileReader.onloadend = (evt) => {

            const fileData = fileReader.result;

            if (use === "profile") {
                setProfileImage(fileData);
                profileImgRef.current.value = null
            } else if (use === "background") {
                setBackgroundImage(fileData);
                bgImgRef.current.value = null
            };


        }
    };


    function openImageChooser(evt) {
        evt.preventDefault()
        setFilesFor(evt.target.name)
        setIsOpen(true)
    };

    function setURL(url) {
        if (filesFor === 'profile') {
            setProfileImage(url);
            profileImgRef.current.value = null
        } else if (filesFor === 'background') {
            setBackgroundImage(url);
            bgImgRef.current.value = null
        }
    }


    function deleteURL(use) {
        if (use === 'profile') {
            setProfileImage('');
            profileImgRef.current.value = null
        } else if (use === 'background') {
            setBackgroundImage('');
            bgImgRef.current.value = null
        }
    };


    // Wenn user nicht eingelogt ist, dann wird ein Formular erzeugt, ansonsten wird der user zu Loginpage navigiert
    return (
        // FORM
        <form
            id='edit-form'
            className="w-full md:w-1/3 mt-11 flex flex-col justify-start p-4 gap-5"
            onSubmit={submitHandler}
        >

            {isOpen ? <ImageChooser setURL={setURL} files={cloudFiles} isFor={filesFor} setIsOpen={setIsOpen} /> : null}

            {/* PROFILEIMAGE */}
            <div>
                <h5 className="text-zinc-500">Profile image</h5>
                <fieldset className="mb-4 p-2 flex justify-between border-b-2 border-cyan-800">
                    <input name="profile"
                        type="file"
                        className={`text-cyan-500 focus:outline-none border-none outline-none bg-transparent w-5/6`}
                        id="prifile-image"
                        ref={profileImgRef}
                        onChange={(evt) => setImage(evt)}
                    />
                
                    <button
                        className="border flex justify-center items-center rounded-lg border-cyan-500 text-cyan-500 text-[30px]"
                        name="profile"
                        type="button"
                        onClick={(evt) => openImageChooser(evt)}

                    // pointer-events-none: da sonst target.name von icon übergeben wird (= undef.)
                    ><AiOutlineCloud className="pointer-events-none" /></button>
                </fieldset>
            </div>


            {profileImage &&
                <>
                    <ul className=" relative text-cyan-500">
                        <li className="text-white relative  overflow-hidden">{profileImage}</li>

                        <VscClose
                            onClick={() => deleteURL("profile")}
                            size={24}
                            className="hover:text-red-500 absolute -left-8 top-0 cursor-pointer" />
                    </ul>
                </>

            }


            {/* BACKGROUNDIMAGE */}
            <div>
                <h5 className="text-zinc-500">Background image</h5>
                <fieldset className="mb-4 p-2 flex justify-between border-b-2 border-cyan-800">
                    {/* <label htmlFor="bg-profile-image" className="text-white"></label> */}
                    <input name="background"
                        type="file"
                        className={`text-cyan-500 focus:outline-none border-none outline-none bg-transparent w-5/6`}
                        id="bg-profile-image"
                        ref={bgImgRef}
                        onChange={(evt) => setImage(evt)}
                    />

                    <button
                        className="border flex justify-center items-center rounded-lg border-cyan-500 text-cyan-500 text-[30px]"
                        name="background"
                        type="button"
                        onClick={(evt) => openImageChooser(evt)}
                    ><AiOutlineCloud className="pointer-events-none" /></button>

                </fieldset>
            </div>

            {backgroundImage &&
                <>
                    <ul className=" relative text-cyan-500">
                        <li className="text-white relative overflow-hidden">{backgroundImage}</li>

                        <VscClose
                            onClick={() => deleteURL("background")}
                            size={24}
                            className="hover:text-red-500 absolute -left-8 top-0 cursor-pointer" />
                    </ul>
                </>

            }




            {/* Wenn username kürzer als 3 Zeichen dann Fehlermeldung */}
            {errormessage.username && <p className="text-red-600">{errormessage.username}</p>}
            {/* USERNAME */}

            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(evt) => setUsername(evt.target.value)}
                />
            </fieldset>


            {/* FULLNAME */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={(evt) => setFullname(evt.target.value)}
                />
            </fieldset>

            {/* ROLE */}
            {isAdminAct ? roleSelect : null}

            {/* EMAIL */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(evt) => setEmail(evt.target.value)}
                />
            </fieldset>

            {/* CITY */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="City (optional)"
                    value={city}
                    onChange={(evt) => setCity(evt.target.value)}
                />
            </fieldset>

            {/* BIRTHDAY */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="date"
                    value={bday}
                    onChange={(evt) => setBday(evt.target.value)}
                />
            </fieldset>

            {/* PREFERRED POSITION */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="preferred stance"
                    value={prefStance}
                    onChange={(evt) => setPrefStance(evt.target.value)}
                />
            </fieldset>

            {/* FAVORITE LOCATIONS */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="favorite locations"
                    value={favLocations}
                    onChange={(evt) => setFavLocations(evt.target.value)}
                />
            </fieldset>

            {/* RIDING STYLE */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="riding style (f.e.: park/freestyle)"
                    value={style}
                    onChange={(evt) => setStyle(evt.target.value)}
                />
            </fieldset>

            {/* EQUIPMENT */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="your equipment"
                    value={equipment}
                    onChange={(evt) => setEquipment(evt.target.value)}
                />
            </fieldset>

            {/* TEXT */}
            <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <input
                    className={`${Styles.input2}`}
                    type="text"
                    placeholder="your description"
                    value={text}
                    onChange={(evt) => setText(evt.target.value)}
                />
            </fieldset>


            {/* Submit Button */}
            <button
                className={`${Styles.mainButton} my-4`}
                type='submit'
            >Apply
            </button>

        </form>


    );
};


export default UserForm;