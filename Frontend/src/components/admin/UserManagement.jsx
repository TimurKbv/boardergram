
import { useEffect, useState } from "react";
import { IoMdSearch } from 'react-icons/io';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import UserTableRow from "./UserTableRow";
import useDebounce from "../../hooks/debounce";
import useNotificationStore from "../../store/useNotificationStore.js";
import * as Styles from "../../services/styles.js";



function UserManagement() {

    // Auth
    const user = useAuthStore(state => state.user);
    const token = useAuthStore(state => state.getToken());

    const [searchString, setSearchString] = useState("");
    const [usersArr, setUsersArr] = useState([]);
    const [isInit, setIsInit] = useState(true);
    const [sortVal, setSortVal] = useState({ key: "username", upDir: false });
    const [dirArrow, setDirArrow] = useState(<BsArrowDown className="self-center" />);
    const debounced = useDebounce(searchString);

    // Notification Handler function
    const notificationHandler = useNotificationStore(state => state.notificationHandler);


    async function getFilteredAndSortedUsers() {

        const sortDir = sortVal.upDir ? -1 : 1

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/admin/users?search=${searchString}&sort=${sortVal.key}&dir=${sortDir}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setUsersArr(response.data.users);

            setDirArrow(sortVal.upDir ? <BsArrowUp className="self-center" /> : <BsArrowDown className="self-center" />)

        } catch (error) {

            console.log(error);
            // Display eine Fehlermeldung
            alertFailHandler(error.response.data.message);
        }
    };


    // Wenn bei register ein Fehler, wird ein Alert mit Fehlermeldung erzeugt
    function alertFailHandler(msg) {
        notificationHandler('fail', msg)
    };


    useEffect(() => {
        if (isInit) {
            getFilteredAndSortedUsers();
            setIsInit(false);
        }
    }, []);


    useEffect(() => {
        getFilteredAndSortedUsers();
    }, [sortVal, debounced]);


    function handleSortClick(evt) {

        if (evt.target.name === sortVal.key) {
            setSortVal({ key: sortVal.key, upDir: !sortVal.upDir })
        } else {
            setSortVal({ key: evt.target.name, upDir: false })
        }
    };


    function handleSubmit(evt) {
        evt.preventDefault()
        getFilteredAndSortedUsers()
    };


    function refresh() {
        getFilteredAndSortedUsers()
    };


    const userTable = usersArr.map(user => {

        return (
            <UserTableRow user={user} key={user._id} refresh={refresh}/>
        )
    });


    return (

        <div className="container flex flex-col justify-center items-center min-h-full">

            <form 
                method="get" onSubmit={handleSubmit} 
                className="w-xs mx-auto w-full md:w-1/2 flex  md:flex-row justify-center gap-5 items-center"
            >


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

            </form>

            <div className="w-full relative bg-gray-900 mt-4 table-wrp block h-[60vh] overflow-y-scroll">
                <table className="table-fixed w-full md:text-sm pb-4">
                    <thead className="text-white sticky bg-gray-900 z-50 top-0">
                        <tr>

                            <th className="border-l" colSpan="2">
                                <span className="flex">
                                    <button name="username" onClick={(evt) => handleSortClick(evt)} className="flex align-middle w-full pl-1">
                                        User
                                    </button>
                                    {sortVal.key === "username" ? dirArrow : null}
                                </span>

                            </th>

                            <th className="border-l">
                                <span className="flex">
                                    <button name="role" onClick={(evt) => handleSortClick(evt)} className="flex align-middle w-full pl-1">
                                        Role
                                    </button>
                                    {sortVal.key === "role" ? dirArrow : null}
                                </span>

                            </th>

                            <th className="border-l">
                                <button className="flex align-middle w-full pl-1">
                                    Posts
                                    {sortVal.key === "posts" ? dirArrow : null}
                                </button>
                            </th>

                            <th className="border-l" colSpan="1">
                                <span className="flex align-middle pl-1">
                                    Reports
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="text-center text-black">
                        {userTable}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default UserManagement;