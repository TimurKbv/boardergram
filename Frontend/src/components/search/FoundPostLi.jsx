import { Link } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore";





function FoundPostLi({post}) {
    // aktuell gesuchte Post setter
    const setSearchPost = useSearchStore(state => state.setSearchPost)
    
    return (
        <li 
            // beim klick post speichern als aktuellste um dann im PostInfo zu holen
            onClick={() => setSearchPost(post)}
            className="bg-gray-500 px-3 py-2 w-5/6 xl:w-3/4 text-center rounded-xl hover:bg-gray-700 hover:text-gray-200 transition-colors duration-200 cursor-pointer shadow-xl"
        >   
            <Link to={`/posts/${post.title}`} > {post.title}</Link>
        </li>
    );
}


export default FoundPostLi;
