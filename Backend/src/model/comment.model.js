import mongoose from "mongoose";
import User from "./user.model.js";
import Post from "./post.model.js";


// Comment-Schema
export const commentsSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visible: { type: Boolean, required: true, default: true },
    type: { type: String, default: 'Comment', enum: ['Comment'] },
}, { timestamps: true });

// erstellt Comment-Model
export const Comment = mongoose.model("Comment", commentsSchema);


// holt alle Comments (zu Entwicklungszwecken)
export async function getAllComments() {
    return await Comment.find({})
};


// holt alle Comments (zu Entwicklungszwecken)
export async function getComment(commentId) {
    return await Comment.findById(commentId)
};


// erstellt Comment
export async function createComment(text, userId) {

    // baut Comment aus übergebenem Text und userId zusammen
    let newComment = new Comment({
        author: userId,
        text: text,
        visible: true
    })

    // speichert neuen Comment und gibt ihn zurück
    return (await newComment.save()).populate({
        path: "author",
        select: ["fullname", "username", "email", "birthday", "city", "image", "description", 'type', 'bgImage']
    })
};


// aktualisiert Comment
export async function editComment(text, userId, commentId) {

    // finde Comment via commentId
    let comment = await Comment.findById(commentId)

    // Finde user, der gerade editen will by id 
    let user = await User.findById(userId);

    // schmeiße Fehler wenn User nicht Author ist
    if (comment.author.toString() !== userId && user.role !== 'admin') {

        throw {
            code: 403,
            message: "invalid user"
        };
    };

    // überschreibe Text mit neuem Text
    comment.text = text;

    // speichert aktualisierten Comment und gibt ihn zurück
    return await comment.save();
};


// Delete Comment
export async function deleteComment(commentId, userId) {
    let user = await User.findById(userId);

    let comment = await Comment.findById(commentId);

    if (user.role !== 'admin' && comment.author.toString() !== userId) {  //? geht?
        throw {
            code: 403,
            message: `User with id: ${userId} is not allowed`
        }
    }
    return await Comment.findByIdAndDelete(commentId);
}

// Get Comment By ID
export async function getCommentsByPostId(postId) {

    let post = await Post.findById(postId).populate([{
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
        }
    }
    return post.comments;
};


export async function hideCommentById(commentId, visible) {

    // hole comment 
    let comment = await Comment.findById(commentId);

    if (!comment) {
        throw {
            code: 404,
            message: `Comment with id: ${commentId} not found`
        }
    }

    return await Comment.updateOne({ _id: commentId }, { $set: { visible: visible } })
};


export default Comment