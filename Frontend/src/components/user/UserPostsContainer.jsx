import axios from "axios";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import UserPost from "./UserPost";



function UserPostsContainer({userId}) {
    // posts die user erstellt hat
    const [userPosts, setUserPosts] = useState([]);
    const token = useAuthStore(state => state.getToken());

    // fetche und speichere posts die user erstellt hat
    useEffect(() => {
        fetchUserPosts()
    }, []);

    async function fetchUserPosts() {
        try {
            let response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/` + userId + '/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }  
            });

            setUserPosts(response.data.posts)
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <>
        {
            userPosts.length > 0 &&
            <div className={`grid container grid-cols-3 grid-rows-${Math.ceil(userPosts.length / 3)} gap-5 p-5 bg-zinc-900`} >
            {userPosts.map(post => {
                return <UserPost post={post} key={post._id} />
            })}
        </div>
        }
        </>

    )
}


export default UserPostsContainer;