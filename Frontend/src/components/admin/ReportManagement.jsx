import { useEffect, useState } from "react";
import { IoMdSearch } from 'react-icons/io';
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import ReportTableRow from "./ReportTableRow";
import useDebounce from "../../hooks/debounce";
import useNotificationStore from "../../store/useNotificationStore";
import * as Styles from "../../services/styles.js";



function ReportManagement() {

    const token = useAuthStore(state => state.getToken());
    const [searchString, setSearchString] = useState("");
    const [reportsArr, setReportsArr] = useState([]);
    const [dirArrow, setDirArrow] = useState(<BsArrowDown className="self-center" />);
    const [sortVal, setSortVal] = useState({ key: "createdAt", upDir: true, isClosed: false })
    const [isInit, setIsInit] = useState(true);
    const debounced = useDebounce(searchString);

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



    async function getFilteredAndSortedReports() {

        const sortDir = sortVal.upDir ? -1 : 1

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/reports?search=${searchString}&state=${sortVal.isClosed}&sort=${sortVal.key}&dir=${sortDir}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setReportsArr(response.data.reports);

            setDirArrow(sortVal.upDir ? <BsArrowUp className="self-center" /> : <BsArrowDown className="self-center" />)

        } catch (error) {

            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.message);
        }
    };


    useEffect(() => {
        if (isInit) {
            getFilteredAndSortedReports();
            setIsInit(false);
        }
    }, []);


    useEffect(() => {
        getFilteredAndSortedReports();
    }, [sortVal, debounced]);


    function updateTable() {
        getFilteredAndSortedReports()
    };


    function handleSortClick(evt) {
        if (evt.target.name === sortVal.key) {
            setSortVal({ ...sortVal, upDir: !sortVal.upDir })
        } else {
            setSortVal({ ...sortVal, key: evt.target.name, upDir: false })
        }
    };


    function handleSubmit(evt) {
        evt.preventDefault()
        getFilteredAndSortedReports()
    };


    const reportsTable = reportsArr.map(report => {

        return (
            <ReportTableRow report={report} key={report._id} updateTable={updateTable} />
        )
    });


    let optionValues = [,
        { label: 'Open', value: false },
        { label: 'Closed', value: true }
    ];


    const reportSelect = <select onChange={evt => setSortVal({ ...sortVal, isClosed: evt.target.value })}
        className="p-1 absolute right-0 rounded-md text-white bg-black hover:text-indigo-200 justify-self-end"
        defaultValue={sortVal.isClosed ? 'Closed' : 'Open'}>
        {optionValues.map((state, index) => (
            <option key={index} value={state.value} className="rounded-md p-2">{state.label}</option>
        ))}
    </select>


    return (
        <div className="relative container flex flex-col justify-center items-center min-h-full">

            <form 
                method="get" 
                onSubmit={handleSubmit} 
                className="w-xs mx-auto w-full md:w-1/2 flex  md:flex-row justify-center gap-5 items-center">

                <fieldset className="my-4 p-2 flex gap-4 items-center border-b-2 border-cyan-800">

                    <input
                        type="search"
                        name="search"
                        value={searchString}
                        onChange={(event) => setSearchString(event.target.value)}
                        className={`${Styles.input2}`}
                        placeholder='Search for User'
                    />
                </fieldset>
                

                <button 
                    className={`rounded-full p-1 text-gray-200 bg-indigo-500 hover:bg-gray-300 hover:text-indigo-600 w-fit `}
                
                >
                    <IoMdSearch className="text-2xl" />
                </button>

                {reportSelect}

            </form>

            <div className="w-full relative bg-gray-900 mt-4 table-wrp block h-[60vh] overflow-y-scroll">
                <table className="table-fixed w-full md:text-sm pb-4">
                    <thead className="text-white sticky bg-gray-900 z-50 top-0">
                        <tr>
                            <th className="border-l" colSpan="2">
                                <span className="flex">
                                    <button name="username" onClick={(evt) => handleSortClick(evt)} className="flex align-middle w-full pl-1">
                                        Reported By
                                    </button>
                                    {sortVal.key === "username" ? dirArrow : null}
                                </span>
                            </th>

                            <th className="border-l" colSpan="1">
                                <span className="flex">
                                    <button name="docModel" onClick={(evt) => handleSortClick(evt)} className="flex align-middle w-full pl-1">
                                        Doc-Type
                                    </button>
                                    {sortVal.key === "docModel" ? dirArrow : null}
                                </span>
                            </th>

                            <th className="border-l" colSpan="1">
                                <span className="flex">
                                    <button name="createdAt" onClick={(evt) => handleSortClick(evt)} className="flex align-middle w-full pl-1">
                                        Date
                                    </button>
                                    {sortVal.key === "createdAt" ? dirArrow : null}
                                </span>
                            </th>

                            <th className="border-l" colSpan="2">
                                <span className="flex align-middle pl-1">
                                    Reason
                                </span>
                            </th>

                        </tr>
                    </thead>

                    <tbody className="text-center text-black">
                        {reportsTable}
                    </tbody>

                </table>
            </div>

        </div>
    )
}


export default ReportManagement;