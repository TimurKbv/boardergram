
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from 'react-icons/ai';
import { HiUserCircle } from 'react-icons/hi';
import UserManagement from './UserManagement';
import ReportManagement from './ReportManagement';
import PostManagement from './PostManagement';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';


function AdminDashboard() {

    const displays = {
        users: <UserManagement />,
        reports: <ReportManagement />,
        posts: <PostManagement />
    };
    const [view, setView] = useState('users')
    const display= displays[view];

    // Style-Parameter
    const choosen = 'pt-3 underline bg-gradient-to-l from-[#FFFFFF09]';
    const notChoosen = 'bg-gradient-to-l from-[#00000050]'


    function changeDisplay(evt) {
        setView(evt.target.name);
    }


    return (


        <div className='flex flex-col justify-center items-center'>

            <div className="md:w-3/4 sm:w-full w-full lg:w-3/4 xl:w-3/4 2xl:w-3/4">

                <button className={`w-1/3 text-xs md:text-lg p-2 bg-gray-900 border-b  text-white rounded-tr focus:outline-none  hover:underline ${view === 'users' ? choosen : notChoosen}`}
                    name='users'
                    onClick={changeDisplay}
                >
                    Users
                </button>

                <button className={`w-1/3 text-xs md:text-lg  p-2 bg-gray-900 border-b  text-white rounded-tr focus:outline-none  hover:underline ${view === 'reports' ? choosen : notChoosen}`}
                    name='reports'
                    onClick={changeDisplay}
                >
                    Reports
                </button>

                <button className={`w-1/3 text-xs md:text-lg p-2 bg-gray-900 border-b  text-white rounded-tr focus:outline-none  hover:underline ${view === 'article' ? choosen : notChoosen}`}
                    name='posts'
                    onClick={changeDisplay}
                >
                    Posts
                </button>

            </div>

            <div className="flex flex-col justify-center items-center  w-full md:w-3/4 h-full bg-gray-900 z-20">

                {display}

            </div>

        </div>

    )
}


export default AdminDashboard;