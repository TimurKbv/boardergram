import { useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import {RiShieldKeyholeFill } from 'react-icons/ri';
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useNotificationStore from "../store/useNotificationStore";
import * as Styles from "../services/styles.js";



function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const authenticate = useAuthStore((state) => state.authenticate);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());

    const token = useAuthStore(state => state.getToken());
    const validateToken = useAuthStore(state => state.validateToken);
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

    const navigate = useNavigate();

    useEffect(() => {
        if (token && !isAuthenticated) {
            validateToken()
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
        navigate('/')
        }
    }, [isAuthenticated]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Erstelle Objekt fuer den Body des Requests
        const loginData = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/public/login`, loginData);
            
            authenticate(response.data.user, response.data.token);

            // display eine 'SUCCESS' Meldung 
            alertSuccessHandler(`Hey, ${response.data.user.username}!`);

        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };





    return (
        <div className="container flex flex-col bg-black h-screen" id="login">

            <div className="flex flex-col items-center ">

                <h2 className={`${Styles.heading2}`}>Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto w-full h-full md:w-1/3 p-6 flex flex-col rounded-md">
                
                <fieldset className="mb-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                    <FaUser className="text-cyan-700 " size={'15px'}/>
                    <input

                        type="text"
                        name="username"
                        ref={usernameRef}
                        className={`${Styles.input2}`}
                        placeholder="Username"
                        required
                    />
                </fieldset>

                <fieldset className="mb-5 p-2 flex gap-4 items-center border-b-2 border-cyan-800">
                <RiShieldKeyholeFill className="text-cyan-700 " size={'15px'}/>
                    <input
                        type="password"
                        name="password"
                        ref={passwordRef}
                        className={`${Styles.input2}`}
                        placeholder="Password"
                        required
                    />
                </fieldset>

                <a
                    href="/forgot-password"
                    className=" text-xs text-gray-400 hover:text-red-300 mb-5"
                >
                    Forgot Password?
                </a>



                <div className="flex flex-col items-center">

                    <button className={`${Styles.mainButton}`} >Sign in</button>
                    <p className="text-xs text-gray-400 mt-6">Not registered?<Link to='/auth/register'> <span className="text-white hover:text-green-300 underline md:underline-offset-8"> Create an account </span></Link></p>
                </div>


            </form>
        </div>
    )
}

export default Login;