import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useReportStore from '../../store/useReportStore'
import axios from 'axios';
import useNotificationStore from "../../store/useNotificationStore";
import * as Styles from "../../services/styles.js";


function ReportModal() {
    const token = useAuthStore(state => state.getToken())
    const user = useAuthStore(state => state.user)
    // State
    const [reportText, setReportText] = useState("");
    const [showModal, setShowModal] = useState('hidden');
    // useReportStore Show
    const showReport = useReportStore(state => state.showReport);
    // Close report
    const closeReport = useReportStore(state => state.closeReport);
    // docType
    const reportType = useReportStore(state => state.reportType);
    // ID
    const reportId = useReportStore(state => state.reportId);
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


    useEffect(() => {
        if (showReport === false) {
            setShowModal('hidden');
            // setReportText('');
        } else {
            setShowModal('');
        }
    }, [showReport]);


    async function handleSubmit(evt) {

        evt.preventDefault()

        const report = {
            reportedBy: user._id,
            reasonText: reportText,
            doc: reportId,
            docModel: reportType
        };

        try {
            await axios.post(`${import.meta.env.VITE_BASE_API_URL}/protected/report`, report, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            // setReportText('');
            closeReport();   // todo funktioniert nicht korrekt! mus gefixt werden
            setReportText('');
            
            // display eine 'SUCCESS' Meldung
            alertSuccessHandler(`Your report was successfully sended`);


        } catch (error) {
            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.message);
        }
    };

    function cancelReport() {
        closeReport();
        setReportText('');
    }

    return (
        <div className={`${showModal} w-screen h-screen bg-white/30 fixed top-0 left-0 flex justify-center items-center z-50 backdrop-blur-sm`}>
            <div className="px-4 text-xs text-white bg-zinc-900 pb-6 w-full h-fit flex flex-col items-center overflow-hidden md:max-w-sm rounded-lg mx-auto ">

                <h2 className="text-lg">Create Report</h2>

                <div className="text-left w-full">

                    <h5 >Report on: <span className='text-red-500'>{reportType}</span> </h5>

                    <fieldset className="mb-4 p-2 border-b-2 border-cyan-800">

                        <textarea 
                        value={reportText} 
                        onChange={evt => setReportText(evt.target.value)} 
                        className={`${Styles.input2} w-full text-white`} placeholder="Write your Report" id="reportinput"  rows="6"
                        >
                    </textarea>

                    </fieldset>
                    <div className="flex justify-evenly mt-2">
                        <button
                            onClick={() => cancelReport()}
                            className="w-1/4 rounded-full p-1 text-gray-200 bg-red-500 hover:bg-white hover:text-indigo-600">
                                Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="w-1/4 rounded-full p-1 text-gray-200 bg-green-500 hover:bg-white hover:text-indigo-600">
                            Send
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}


export default ReportModal