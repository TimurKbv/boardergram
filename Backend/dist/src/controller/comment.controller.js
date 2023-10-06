"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentModel = __importStar(require("../model/comment.model.js"));
const PostModel = __importStar(require("../model/post.model.js"));
// fetcht alle Comments
async function getAll(req, res) {
    try {
        let comments = await CommentModel.getAllComments();
        console.log(comments);
        res.send({
            success: true,
            data: comments
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getAll = getAll;
;
// fetcht alle Comments
async function getCommentById(req, res) {
    const commentId = req.params.id;
    try {
        let comment = await CommentModel.getComment(commentId);
        res.send({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getCommentById = getCommentById;
;
// erstellt neuen Comment
async function addNewComment(req, res) {
    // hole Text aus dem body
    let text = req.body.text;
    // hole postId aus den Parametern (:id)
    let postId = req.params.id;
    // hole userId vom tokenPayload
    let userId = req.tokenPayload._id;
    try {
        // ertsellt Comment und gibt ihn zurück
        let comment = await CommentModel.createComment(text, userId);
        // pusht commentId in den zugehörigen Post und gibt ihn zurück
        let post = await PostModel.addCommentToPost(postId, comment._id);
        res.send({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.addNewComment = addNewComment;
// editiert Comment
async function editComment(req, res) {
    // holt commentId aus den Parametern (:id)
    let commentId = req.params.id;
    // holt Text aus dem body
    let text = req.body.text;
    // holt userId vom tokenPayload
    let userId = req.tokenPayload._id;
    try {
        //  aktualisiert den Comment und gibt den aktualisierten Comment zurück
        let updatedComment = await CommentModel.editComment(text, userId, commentId);
        res.send({
            success: true,
            data: updatedComment
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            message: error.message
        });
    }
}
exports.editComment = editComment;
// Delete comment
async function deleteCommentById(req, res) {
    let commentId = req.params.id;
    let userId = req.tokenPayload._id;
    try {
        let comment = await CommentModel.deleteComment(commentId, userId);
        res.send({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}
exports.deleteCommentById = deleteCommentById;
// hollt Comments by ID
async function getCommentsById(req, res) {
    // hole postId aus den Parametern (:id)
    let postId = req.params.id;
    try {
        // sucht Commentare nach postId
        let comments = await CommentModel.getCommentsByPostId(postId);
        // sende data zur Frontend
        res.send({
            success: true,
            data: comments
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getCommentsById = getCommentsById;
;
async function hideComment(req, res) {
    const commentId = req.params.id;
    const visible = req.body.visible;
    try {
        let comment = await CommentModel.hideCommentById(commentId, visible);
        console.log(comment);
        res.send({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}
exports.hideComment = hideComment;
//# sourceMappingURL=comment.controller.js.map