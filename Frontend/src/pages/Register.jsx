import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useNotificationStore from "../store/useNotificationStore";
import axios from "axios";
import * as Styles from "../services/styles.js";
import {RiShieldKeyholeFill } from 'react-icons/ri';
import {FaCity } from 'react-icons/fa';
import {AiOutlineMail } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';






function Register() {
    // refs zu Formdaten
    const usernameRef = useRef();
    const fullnameRef = useRef();
    const emailRef = useRef();
    const cityRef = useRef();
    const passwordRef = useRef();
    const passwordRepeatRef = useRef();
    // State für Fehlermeldung
    const [errormessage, setErrormessage] = useState({
        username: '',
        password: '',
        passwordRepeat: ''
    });
    // Auth
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    // Nav
    const navigate = useNavigate();
    const location = useLocation();
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


    // Form Submitt
    async function submitHandler(evt) {
        evt.preventDefault();

        // Wenn ist kürzer als 3 Zeichen, dann Fehlermeldung und early return
        if (usernameRef.current.value.trim().length < 3) {
            setErrormessage(prev => {
                return {
                    username: 'Username should be longer than 3 letters'
                }
            });
            return;
        }
        // Wenn password ist kurzer als 5 Zeichen, dann Fehlermeldung und early return
        if (passwordRef.current.value.trim().length < 5) {
            setErrormessage(prev => {
                return {
                    password: 'Password should be longer than 5 symbols'
                }
            });
            return;
        }
        // Wenn password und wiederhol-password nicht gleich sind, dann Fehlermeldung und early return
        if (passwordRepeatRef.current.value !== passwordRef.current.value) {
            setErrormessage(prev => {
                return {
                    passwordRepeat: `Passwords are not identical`
                }
            });
            return;
        }

        // Erstelle User-Objekt fuer den Body des Requests
        let registrationData = {
            username: usernameRef.current.value,
            fullname: fullnameRef.current.value,
            email: emailRef.current.value,
            city: cityRef.current.value,
            password: passwordRef.current.value,
        };

        // Sende Request an /register endpoint der API
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/public/register`, registrationData);

            // display eine 'SUCCESS' Meldung und navigiere zu Login
            alertSuccessHandler(`Thank you for registration, ${registrationData.username}!`);
            navigate('/auth/login');

        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };
    // Wenn user ist nicht eingelogt, dann wird eine Form erzeugt, ansonsten wird der user zu Loginpage navigiert
    return (!isAuthenticated ?

        <div id="register" className="container flex flex-col justify-center items-center">

            <h2 className="text-2xl mb-2 font-bold text-center text-cyan-500">REGISTER NOW!</h2>

            <form 
                id='register-form' 
                className="w-full md:w-1/3 mt-11 flex flex-col justify-start p-4 gap-5" 
                onSubmit={submitHandler}>
                
                {/* USERNAME */}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                    <FaUser className="text-cyan-700 " size={'15px'} />
                    <input
                        className={`${Styles.input2}`}
                        type="text"
                        placeholder="Username"
                        ref={usernameRef}
                    />
                </fieldset>

                {/* Wenn username kürzer als 3 Zeichen dann Fehlermeldung */}
                {errormessage.username && <p className="text-red-400">{errormessage.username}</p>}

                {/* FULLNAME */}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                    <FaUser className="text-cyan-700 " size={'15px'} />
                    <input
                        className={`${Styles.input2}`}
                        type="text"
                        placeholder="Fullname"
                        ref={fullnameRef}
                    />
                </fieldset>


                {/* EMAIL */}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                    <AiOutlineMail className="text-cyan-700 " size={'15px'} />
                    <input
                        className={`${Styles.input2}`}
                        type="email"
                        placeholder="E-mail"
                        ref={emailRef}
                    />
                </fieldset>

                {/* CITY */}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                    <FaCity className="text-cyan-700 " size={'15px'} />
                    <input
                        className={`${Styles.input2}`}
                        type="text"
                        placeholder="City (optional)"
                        ref={cityRef}
                    />
                </fieldset>

                {/* PASSWORD */}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <RiShieldKeyholeFill className="text-cyan-700 " size={'15px'}/>

                    <input
                        className={`${Styles.input2}`}
                        type="password"
                        placeholder="Password"
                        ref={passwordRef}
                    />
                </fieldset>

                {/* Wenn password ist kürzer als 5 Zeichen dann Fehlermeldung */}
                {errormessage.password && <p className="text-red-600">{errormessage.password}</p>}

                {/* PASSWORD WIEDERGABE*/}
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <RiShieldKeyholeFill className="text-cyan-700 " size={'15px'}/>

                    <input
                        className={`${Styles.input2}`}
                        type="password"
                        placeholder="Password again"
                        ref={passwordRepeatRef}
                    />
                </fieldset>

                {/* Wenn passwörter nicht stimmen, dann Fehlermeldung */}
                {errormessage.passwordRepeat && <p className="text-red-600">{errormessage.passwordRepeat}</p>}
                {/* Submit Button */}
                <button
                    type='submit'
                    className={`${Styles.mainButton} mt-4`}
                >Register
                </button>

            </form>
        </div>
        :
        // wenn user is authenticated - navigate to news
        <Navigate to={'/news'} replace state={{ from: location }} />

    );
};


export default Register;