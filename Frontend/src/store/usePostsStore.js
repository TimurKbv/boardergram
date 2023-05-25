import axios from "axios";
import { create } from "zustand";


const usePostsStore = create((set, get) => ({
    favorites: [],
    fetchFavorites: async () => {
        let token = localStorage.getItem('token');
        try {
            let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/favorites/0`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }  
            });
            
            set({favorites: resp.data.data});

        } catch (error) {
          console.log(error);
        } 
    },
    setFavorites: (favs) => set({favorites: favs})
 
}))


export default usePostsStore;