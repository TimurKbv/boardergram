import { Link } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore";





function FoundUserLi({user}) {

    const setSearchUser = useSearchStore(state => state.setSearchUser)
    
    return (
        <li
            onClick={() => setSearchUser(user)}
            className="bg-gray-500 px-3 py-2 w-5/6 xl:w-3/4 text-center rounded-xl hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 cursor-pointer shadow-xl"
        >
            <Link to={`/users/${user.username}`} > {user.username}</Link>

        </li>
    );
}


export default FoundUserLi;
