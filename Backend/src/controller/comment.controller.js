import * as CommentModel from "../model/comment.model.js"
import * as PostModel from "../model/post.model.js"


// fetcht alle Comments
export async function getAll(req, res) {
    
    try{
        let comments = await CommentModel.getAllComments()

        console.log(comments);

        res.send({
            success: true,
            data: comments
        })

    } catch (error) {
        console.log(error);
    }
};


// fetcht alle Comments
export async function getCommentById(req, res) {
    
    const commentId = req.params.id;

    try{
        let comment = await CommentModel.getComment(commentId)

        res.send({
            success: true,
            data: comment
        })

    } catch (error) {
        console.log(error);
    }
};


// erstellt neuen Comment
export async function addNewComment(req, res) {

    // hole Text aus dem body
    let text = req.body.text;

    // hole postId aus den Parametern (:id)
    let postId = req.params.id

    // hole userId vom tokenPayload
    let userId = req.tokenPayload._id;

    try {

        // ertsellt Comment und gibt ihn zurück
        let comment = await CommentModel.createComment(text, userId);

        // pusht commentId in den zugehörigen Post und gibt ihn zurück
        let post = await PostModel.addCommentToPost(postId, comment._id)

        res.send({
            success: true,
            data: comment
        })

    } catch (error) {
        console.log(error);
    }

}

// editiert Comment
export async function editComment(req, res) {

    // holt commentId aus den Parametern (:id)
    let commentId = req.params.id
    
    // holt Text aus dem body
    let text = req.body.text;

    // holt userId vom tokenPayload
    let userId = req.tokenPayload._id;

    try {

        //  aktualisiert den Comment und gibt den aktualisierten Comment zurück
        let updatedComment = await CommentModel.editComment(text, userId, commentId)

        res.send({
            success: true,
            data: updatedComment
        })
        
    } catch (error) {
        console.log(error);

        res.status(error.code).send({
            message: error.message
        })
    }
}


// Delete comment
export async function deleteCommentById(req, res) {
    
    let commentId = req.params.id;
    let userId = req.tokenPayload._id;

    try {
        let comment = await CommentModel.deleteComment(commentId, userId);
        res.send({
            success: true,
            data: comment
        })
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
}

// hollt Comments by ID
export async function getCommentsById(req, res) {

    // hole postId aus den Parametern (:id)
    let postId = req.params.id

    try {
        // sucht Commentare nach postId
        let comments = await CommentModel.getCommentsByPostId(postId);

        // sende data zur Frontend
        res.send({
            success: true,
            data: comments
        })
    } catch (error) {
        console.log(error);
    }

};


export async function hideComment(req, res) {

    const commentId = req.params.id;
    const visible = req.body.visible;

    try {
        let comment = await CommentModel.hideCommentById(commentId, visible);

        console.log(comment);

        res.send({
            success: true,
            data: comment
        })
    } catch (error) {
        console.log(error);res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
}