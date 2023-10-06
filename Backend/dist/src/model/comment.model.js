"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_js_1 = __importDefault(require("./user.model.js"));
const post_model_js_1 = __importDefault(require("./post.model.js"));
// Comment-Schema
exports.commentsSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    visible: { type: Boolean, required: true, default: true },
    type: { type: String, default: 'Comment', enum: ['Comment'] },
}, { timestamps: true });
// erstellt Comment-Model
exports.Comment = mongoose_1.default.model("Comment", exports.commentsSchema);
// holt alle Comments (zu Entwicklungszwecken)
async function getAllComments() {
    return await exports.Comment.find({});
}
exports.getAllComments = getAllComments;
;
// holt alle Comments (zu Entwicklungszwecken)
async function getComment(commentId) {
    return await exports.Comment.findById(commentId);
}
exports.getComment = getComment;
;
// erstellt Comment
async function createComment(text, userId) {
    // baut Comment aus übergebenem Text und userId zusammen
    let newComment = new exports.Comment({
        author: userId,
        text: text,
        visible: true
    });
    // speichert neuen Comment und gibt ihn zurück
    return (await newComment.save()).populate({
        path: "author",
        select: ["fullname", "username", "email", "birthday", "city", "image", "description", 'type', 'bgImage']
    });
}
exports.createComment = createComment;
;
// aktualisiert Comment
async function editComment(text, userId, commentId) {
    // finde Comment via commentId
    let comment = await exports.Comment.findById(commentId);
    // Finde user, der gerade editen will by id 
    let user = await user_model_js_1.default.findById(userId);
    // schmeiße Fehler wenn User nicht Author ist
    if (comment.author.toString() !== userId && user.role !== 'admin') {
        throw {
            code: 403,
            message: "invalid user"
        };
    }
    ;
    // überschreibe Text mit neuem Text
    comment.text = text;
    // speichert aktualisierten Comment und gibt ihn zurück
    return await comment.save();
}
exports.editComment = editComment;
;
// Delete Comment
async function deleteComment(commentId, userId) {
    let user = await user_model_js_1.default.findById(userId);
    let comment = await exports.Comment.findById(commentId);
    if (user.role !== 'admin' && comment.author.toString() !== userId) { //? geht?
        throw {
            code: 403,
            message: `User with id: ${userId} is not allowed`
        };
    }
    return await exports.Comment.findByIdAndDelete(commentId);
}
exports.deleteComment = deleteComment;
// Get Comment By ID
async function getCommentsByPostId(postId) {
    let post = await post_model_js_1.default.findById(postId).populate([{
            path: "comments",
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
            },
        }]);
    if (!post) {
        throw {
            code: 404,
            message: `Post with id: ${postId} not found`
        };
    }
    return post.comments;
}
exports.getCommentsByPostId = getCommentsByPostId;
;
async function hideCommentById(commentId, visible) {
    // hole comment 
    let comment = await exports.Comment.findById(commentId);
    if (!comment) {
        throw {
            code: 404,
            message: `Comment with id: ${commentId} not found`
        };
    }
    return await exports.Comment.updateOne({ _id: commentId }, { $set: { visible: visible } });
}
exports.hideCommentById = hideCommentById;
;
exports.default = exports.Comment;
//# sourceMappingURL=comment.model.js.map