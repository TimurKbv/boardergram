import Comment from "./Comment"
import { useRef, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";


function Comments({post}) {
    const token = useAuthStore(state => state.getToken());
    // Text aus der Form furs neue Kommentar
    const commentText = useRef();
    // State
    const [comments, setComments] = useState(post.comments);
    const user = useAuthStore(state => state.user);
    
    // function um zu aktuellste comments zu fetchen
    async function fetchComments() {
        try {
            // Hole comments nach postID
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/` + post._id, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }  
            });
            // speichere Comments
            setComments(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Sende neues Kommentar zur DB und fetche favorites neu
    async function addCommentSubmitHandler(e) {
        e.preventDefault();
        // prüfe ob comment field nicht leer ist
        if (commentText.current.value.trim().length < 1) {
            return;
        }
        // erstelle body 
        let commentBody = {
            text: commentText.current.value
        }
        try {
            // server post anfrage um das neue Kommentar zu erstellen
            await axios.post(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/` + post._id, commentBody, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }  
            });
            // rerender aktuelste comments
            fetchComments()
            // Input feld leer machen
            commentText.current.value = '';

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteComment(id) {

        try {
            // delete comment von server
            await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/`+ id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }  
            });
            // render aktuelste comments
            fetchComments()
        } catch (error) {
            console.log(error);
        }
    }

    async function editComment(id, text) {

        try {
            // edit comment Anfrage an server
            await axios.put(`${import.meta.env.VITE_BASE_API_URL}/protected/comments/`+ id, {text}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }  
            });
            // render aktuelste comments
            fetchComments()
        } catch (error) {
            console.log(error);
        }
    }
    return (
        // Kommentar liste
        <ul className='w-full bg-gray-500 text-gray-400  rounded-xl p-4 flex flex-col gap-5'>
            {/* render alle Kommentare */}
            {comments.map(comment => {
                return <Comment 
                    key={comment._id} 
                    comment={comment} 
                    deleteCommentCallback={deleteComment} 
                    editCommentCallback={editComment}
                />
            })}

            {/* Add Komment Form */}
            {
                !user.isBanned && <form 
                    className="flex flex-col gap-3"
                    onSubmit={addCommentSubmitHandler}
                    >
                        {/* BUTTON */}
                    <button 
                        type="submit" 
                        className='text-white bg-green-500 hover:bg-gray-300 hover:text-black w-fit px-3 py-1 rounded-md  transition-colors duration-150'
                    >
                        Add comment
                    </button>

                    {/* Text Feld von Kommentar */}
                    <textarea 
                        className="bg-gray-800 w-full rounded-lg py-2 px-3 text-gray-200 leading-tight outline-none"
                        name="comment-input" 
                        id="comment-input" 
                        cols="1" 
                        rows="3"
                        ref={commentText}
                    ></textarea>
                </form>
            }
            
        </ul>
    )
}

export default Comments;