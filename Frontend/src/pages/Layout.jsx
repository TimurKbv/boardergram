import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/layout/Header';
import useAuthStore from '../store/useAuthStore';
import Nav from '../components/layout/Nav';
import Notification from '../components/Notification';
import ReportModal from '../components/user/ReportModal';
import LoadingSpinner from '../components/user/LoadingSpinner';



function Layout() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const token = useAuthStore(state => state.getToken());
    const validateToken = useAuthStore(state => state.validateToken);

    //Auto Auth
    useEffect(() => {
        if (token && !isAuthenticated) {
            validateToken();
        }
    }, []);


    return (
        <div className='container mx-auto min-h-screen relative lg:w-5/6 ' >
            
            <Header />

            <Nav />

            <Notification />

            <LoadingSpinner />

            <div className='container min-h-screen py-24' id='layout'>

                <Outlet />

                <ReportModal />

            </div>
        </div>
    );
}

export default Layout;