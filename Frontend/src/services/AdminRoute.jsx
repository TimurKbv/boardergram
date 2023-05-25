import useAuthStore from "../store/useAuthStore.js";
import { Navigate, Outlet, useLocation } from "react-router-dom";


function AdminRoute() {

    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated())
    const location = useLocation();

    return (
        user.role === "admin" ? <Outlet /> : <Navigate to='/news' replace state={{from: location}} />
    )
}


export default AdminRoute;