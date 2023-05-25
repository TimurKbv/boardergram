import { TfiViewGrid} from 'react-icons/tfi';
import { BsSuitHeart } from 'react-icons/bs';
import {BsPlusCircle} from 'react-icons/bs';
import { TfiWrite } from 'react-icons/tfi';
import { ImSearch } from 'react-icons/im';
import { Link, useLocation } from 'react-router-dom';
import { navLink, activeNav } from '../../services/styles.js';

function Nav() {

  const location = useLocation();
  let isNews;
  let isBlogs;
  let isFavs;
  let isSearch;
  let isCreate;

  (location.pathname === '/' ? isNews = activeNav : isNews = "");
  (location.pathname === '/blogs' ? isBlogs = activeNav : isBlogs = "");
  (location.pathname === '/favs' ? isFavs = activeNav : isFavs = "");
  (location.pathname === '/search' ? isSearch = activeNav : isSearch = "");
  (location.pathname === '/create' ? isCreate = activeNav : isCreate = "");

  return (


    <nav className="fixed bottom-0 left-0 w-full h-20 z-40 border-slate-400 bg-stone-900">
      <ul className="flex justify-around items-center h-full text-xl text-gray-300 bg-black">


        <li className={`${navLink} ${isNews}`}>
          <Link to="/">
            <TfiViewGrid
              size="40px"
              className="mx-auto bg-stone-900 p-2 rounded-lg hover:text-orange-500 cursor-pointer border border-gray-700 transform hover:scale-110 transition duration-200 ease-in-out"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">News</p>
          </Link>
        </li>

        <li className={`${navLink} ${isFavs}`}>
          <Link to="/favs">
            <BsSuitHeart
              size="40px"
              className="mx-auto bg-stone-900 p-2 rounded-lg hover:text-orange-500 cursor-pointer border border-gray-700 transform hover:scale-110 transition duration-200 ease-in-out"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Favs</p>
          </Link>
        </li>

        <li className={` ${isCreate} ${navLink}`}>
          <Link to='/create'>
            <BsPlusCircle
              size='40px'
              className="mx-auto bg-stone-900 p-2 rounded-lg hover:text-orange-500 cursor-pointer border border-gray-700 transform hover:scale-110 transition duration-200 ease-in-out"
              title='New Post'
            />
          </Link>
          <p className='text-xs text-gray-500 mt-2 text-center'>Create</p>
        </li>

        <li className={`${navLink} ${isBlogs}`}>
          <Link to="/blogs">
            <TfiWrite
              size="40px "
              className="mx-auto bg-stone-900 p-2 rounded-lg hover:text-orange-500 cursor-pointer border border-gray-700 transform hover:scale-110 transition duration-200 ease-in-out"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Blogs</p>
          </Link>
        </li>

        <li className={`${navLink} ${isSearch}`}>
          <Link to="/search">
            <ImSearch
              size="40px"
              className="mx-auto bg-stone-900 p-2 rounded-lg hover:text-orange-500 cursor-pointer border border-gray-700 transform hover:scale-110 transition duration-200 ease-in-out"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Search</p>
          </Link>
        </li>

      </ul>
    </nav>
  );
}



export default Nav;