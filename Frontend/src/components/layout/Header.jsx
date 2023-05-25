import { Link, useLocation } from "react-router-dom";
import Logo from '../../assets/LOgoW.png';
import { FaUserAlt } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import useAuthStore from "../../store/useAuthStore";
import { LoginLogoutButton } from "../buttons/LoginLogoutButton.jsx";


function Header() {

    const isAdmin = useAuthStore(state => state.isAdmin());

    return (

        <header className='fixed top-0 left-0 flex justify-between items-center w-full h-24 bg-black z-40'  >

            <Link to='/' className="flex h-full w-1/4 pl-2 sm:pl-0 sm:pr-10 md:w-1/6 xl:w-1/12 xl:p-0 flex-row justify-center items-center ">
                <img src={Logo} alt="logo" className="w-full h-full object-contain opacity-80 rounded-full" />
            </Link>

            <div className="flex">

                {isAdmin &&
                    <Link to='/protected/admin'> <MdAdminPanelSettings size="20px" className="mr-5 hover:text-orange-500 text-orange-700 " /> </Link>   
                }
                
                <Link to='/user'> <FaUserAlt size="20px" className="mr-5 hover:text-orange-500 text-cyan-600 " /> </Link> 

            </div>

        </header>

    )
}

export default Header;