import Post from "../components/post/Post";
import useSearchStore from "../store/useSearchStore";





function PostInfo() {
    // aktuellse Post holen und Post.jsx uebergeben
    const searchPost = useSearchStore(state => state.searchPost);

    return (
       <>
         {searchPost &&
            <div className="container w-full mx-auto mt-10 items-center flex flex-col gap-16 min-h-full justify-center text-white ">
                <Post post={searchPost} />
            </div>
        }
       </>

    )
}


export default PostInfo;