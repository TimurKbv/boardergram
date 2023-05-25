import FoundResultsList from "../components/search/FoundResultsList";
import FindUsersForm from "../components/search/FindUsersForm";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/debounce";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";


function Search() {
    // token
    const token = useAuthStore(state => state.getToken());
    // State
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [category, setCategory] = useState('user');
    // custom hooks 
    const debounced = useDebounce(search);

    // use debounced-custom-hook um server nicht zu viel Anfragen zu senden
    useEffect(() => {
        // fetche daten, entsprechend category
        if (search.length > 0) {
            if (category === 'user') {
                fetchUsers(debounced);
            }
            if (category === 'news') {
                fetchNews(debounced);
            }
            if (category === 'blogs') {
                fetchBlogs(debounced);
            }
        } else {
            setResults([]);
        }
    }, [debounced]);

    async function fetchUsers(username) {
        try {
            let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/search_user/` + username, {
              headers: {
                'Authorization': `Bearer ${token}`
              }  
            });
            setResults(resp.data.users);
        } catch (error) {
          console.log(error);
        } 
    }
    async function fetchNews(title) {
        try {
            let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/search_post/news/` + title, {
              headers: {
                'Authorization': `Bearer ${token}`
              }  
            });

            setResults(resp.data.posts);
        } catch (error) {
          console.log(error);
        } 
    }
    async function fetchBlogs(title) {
        try {
            let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/search_post/blogs/` + title, {
              headers: {
                'Authorization': `Bearer ${token}`
              }  
            });

            setResults(resp.data.posts);
        } catch (error) {
          console.log(error);
        } 
    }

    return (
        <div className="container h-full flex flex-col items-center gap-10 ">

            <FindUsersForm setSearch={setSearch} search={search} setCategory={setCategory} category={category} />

            <FoundResultsList results={results} category={category} />

        </div>
    )
}



export default Search;