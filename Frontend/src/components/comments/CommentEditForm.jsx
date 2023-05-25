import { useRef, useState } from "react";



function CommentEditForm({text, setIsEdit, editCommentCallback, commentId}) {
    const [commentText, setCommentText] = useState(text);

    function changeCommentSubmit() {
        editCommentCallback(commentId, commentText)
        setIsEdit(false);
    }

    return (
        <form
            onSubmit={changeCommentSubmit}
            className="flex gap-10"
        >
            <input 
                type="text" 
                className="bg-gray-800 border-b-2 w-full py-2 px-3 text-gray-200 leading-tight outline-none"
                name="comment-edit-input" 
                id="comment-edit-input" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            />
        </form>
    )
}


export default CommentEditForm;