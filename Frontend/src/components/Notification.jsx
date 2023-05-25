
import { useEffect } from "react";
import useNotificationStore from "../store/useNotificationStore";

function Notification() {

    const type = useNotificationStore(state => state.type);
    const message = useNotificationStore(state => state.message);
    const showNotification = useNotificationStore(state => state.showNotification);
    const setShowNotification = useNotificationStore(state => state.setShowNotification)

    useEffect(() => {
        const time = setTimeout(() => {
            setShowNotification(false)
        }, 3000);
        return () => clearTimeout(time);
    }, [showNotification]);


    return (
        showNotification &&
            <div className="fixed top-20 right-20 z-50">
                {showNotification &&
                    (type === 'success' 
                    ?
                    <div
                        className="mb-3 inline-flex w-full items-center rounded-lg bg-green-100 py-5 px-6 text-base text-green-700"
                        role="alert">
                            <span className="mr-2">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5">
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clipRule="evenodd" />
                                </svg>
                            </span>
                        {message}
                    </div>
                    :
                    <div
                        className="mb-3 inline-flex w-full items-center rounded-lg bg-red-100 py-5 px-6 text-base text-red-700"
                        role="alert">
                        <span className="mr-2">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5">
                            <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                clipRule="evenodd" />
                            </svg>
                        </span>
                        {message}
                    </div>)
                    }
            </div>
    )
}

export default Notification;