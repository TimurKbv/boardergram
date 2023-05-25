import useAuthStore from "../store/useAuthStore.js";
import { Navigate, Outlet, useLocation } from "react-router-dom";


function PrivateRoute() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated())
    const location = useLocation();

    return (
        isAuthenticated ? <Outlet /> : <Navigate to='/auth/login' replace state={{from: location}} />
    )
}


export default PrivateRoute;