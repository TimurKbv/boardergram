import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ------- PAGES ---------------- */
import Search from './pages/Search';
import Layout from './pages/Layout';
import News from './pages/News';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './services/PrivateRoute';
import AdminRoute from './services/AdminRoute';
import Login from './pages/Login'
import Blogs from './pages/Blogs'
import CreatePost from './pages/CreatePost';
import Favs from './pages/Favs';
import Register from './pages/Register';
import UserInfo from './pages/UserInfo';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import { Navigate } from 'react-router-dom';
import PostInfo from './pages/PostInfo';

function App() {


  return (
    <div className="App text-black font-mono  bg-black min-h-screen ">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<News />} />

            <Route path='/auth/register' element={<Register />} />
            <Route path='/auth/login' element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route path='/user' element={<UserProfile />} />
              <Route path='/create' element={<CreatePost />} />
              <Route path='/blogs' element={<Blogs />} />
              <Route path='/favs' element={<Favs />} />

              <Route path='/search' element={<Search />} />
              <Route path='/users/:username' element={<UserInfo />} />
              <Route path='/posts/:title' element={<PostInfo />} />

              <Route path='/usermanagement' element={<UserManagement />} />

              <Route element={<AdminRoute />}>
                <Route path='/protected/admin' element={<AdminDashboard />} />
              </Route>

            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

          </Route>

        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
