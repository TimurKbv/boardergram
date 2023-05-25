import { styles } from "../../services/styles.js";
import useAuthStore from "../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { RiLoginBoxLine } from 'react-icons/ri'



export function LoginLogoutButton() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    //const {hoverColor, textColor} = colors;
    let textColor = isAuthenticated ? "text-white" : "text-green-400";
    let hoverColor = isAuthenticated ? "hover:text-red-700" : "hover:text-green-700";

    function clickHandler() {
        if (isAuthenticated) {
            logout();
        } else {
            navigate('auth/login');
        }
    };

    return (
        <button onClick={clickHandler}><RiLoginBoxLine size="22px" className={
            `mr-5 ${hoverColor} ${textColor}`} />
        </button>
    )
}