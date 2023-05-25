import { Router } from "express";
import { deleteUserById, toggleFavoritePost, searchUsersByUsername, updateOwnUserData, validateUser, getUserPostsById, getCloudFiles } from "../controller/user.controller.js";
import { addNewPost, deletePostById, getPostsWOArticles, getUserFavorites, getPostById, getSearchNewsByTitle, getSearchBlogsByTitle, updatePost } from "../controller/post.controller.js";
import { createReport } from "../controller/report.controller.js";
import { addNewComment, deleteCommentById, editComment, getCommentsById, getCommentById } from "../controller/comment.controller.js";
import jwt from "jsonwebtoken";


// Middleware-Funktion zum Validieren von Tokens im Header
export function verifyUserToken(req, res, next) {
    // Wenn Authorization im Header nicht gesetzt, breche ab und sende Fehler
    if (!req.headers.authorization) return res.status(401).send({ success: false, message: 'Token missing' });
    // Extrahiere Token aus dem authorization Feld im HTTP Request Header
    let token = req.headers.authorization.split(' ')[1];
    // Verifiziere extrahierten Token mittels Signaturpruefung
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // Wenn Verifizierung fehlgeschlagen, brich ab und sende Fehler
        if (err) return res.status(401).send({ success: false, message: 'Invalid token' });
        // Alles gut, speichere payload im req-Objekt
        req.tokenPayload = payload;
        // Fahre mit Anfrage fort
        next();
    });
}


const ProtectedRouter = Router();

ProtectedRouter.use(verifyUserToken)

// Route für Posts (Posts = Articles + Stories + Reviews + Market)
ProtectedRouter.route('/post')
    .post(addNewPost)       // erstellt neuen Post

ProtectedRouter.route('/post/:id')
    .delete(deletePostById)     // lösche Post by ID
    .get(getPostById)           // hole Post by ID
    .put(updatePost)

// Route für Blogs (Blogs = Posts - Articles)
ProtectedRouter.route('/blogs')
    .get(getPostsWOArticles)        // fetcht alle sichtbaren & veröffentlichten Blogs

// Route für Reports (Meldungen)
ProtectedRouter.route('/report')
    .post(createReport)     // erstellt Report

// Route für Favorites
ProtectedRouter.route('/favorites/:skip')
    .get(getUserFavorites)      // fetcht alle Favorites des Users

ProtectedRouter.route('/favorites/:postId')
    .put(toggleFavoritePost)

ProtectedRouter.route('/uservalidation')
    .get(validateUser)

ProtectedRouter.route('/user')
    .delete(deleteUserById)     // löscht Userprofil
    .put(updateOwnUserData)     // editiert Userprofil

ProtectedRouter.route('/user/files/:id')
    .get(getCloudFiles)

// Route für Comments
ProtectedRouter.route('/comments/:id')
    .put(editComment)           // editiert Comment, Parameter:  commentId
    .post(addNewComment)        // erstellt Comment, Parameter:  postId
    .delete(deleteCommentById)  // Delete Comment
    .get(getCommentsById)       // get comments by post id, Parameter: postId
    .get(getCommentById)        // holt EINEN Comment by ID

// sueche users
ProtectedRouter.route('/search_user/:username')
    .get(searchUsersByUsername)

// suche news nach text oder title
ProtectedRouter.route('/search_post/news/:title')
    .get(getSearchNewsByTitle)

// sueche blogs nach text oder title
ProtectedRouter.route('/search_post/blogs/:title')
    .get(getSearchBlogsByTitle)


ProtectedRouter.route('/:userId/posts')
    .get(getUserPostsById)

export default ProtectedRouter