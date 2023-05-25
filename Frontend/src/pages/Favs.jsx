import { useEffect, useState} from "react";
import usePostsStore from "../store/usePostsStore";
import Post from "../components/post/Post";
import { useInView } from 'react-intersection-observer';
import useAuthStore from "../store/useAuthStore";
import axios from "axios";


function Favs() {
  const setFavorites = usePostsStore(state => state.setFavorites);
  const favorites = usePostsStore(state => state.favorites);
  const token = useAuthStore(state => state.getToken());
  // const [favorites, setFavorites] = useState([]);
  // LAZY LOADING....
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 1,
  });

// wenn trigger-div inView === true dann fetche neue posts
  useEffect(() => {

    if (inView) fetchFavorites(favorites);

  }, [inView]);


  // Fetch function
  async function fetchFavorites() {

    try {
      let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/favorites/` + favorites?.length, {
        headers: {
          'Authorization': `Bearer ${token}`
        }  
      });
      // speichere favorites in state


      if (favorites.length > 0) {
        setFavorites([...favorites, ...resp.data.data]);
      } else {
        setFavorites(resp.data.data)
      }

    } catch (error) {
      console.log(error);
    }
  }


  return (
    /* Render favorites */
    <div className="flex flex-col justify-center items-center w-full h-fit gap-14">

      {favorites.map(fav => {
        return <Post key={fav._id} post={fav} fetchFavorites={fetchFavorites} />
      })}

      {/* TRIGGER DIV */}
      <div ref={ref} className="w-full h-10 text-3xl text-white font-bold text-center ">The end</div>

    </div>
  );
}

export default Favs;
