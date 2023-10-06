"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controller/user.controller.js");
const post_controller_js_1 = require("../controller/post.controller.js");
const report_controller_js_1 = require("../controller/report.controller.js");
const comment_controller_js_1 = require("../controller/comment.controller.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware-Funktion zum Validieren von Tokens im Header
function verifyUserToken(req, res, next) {
    // Wenn Authorization im Header nicht gesetzt, breche ab und sende Fehler
    if (!req.headers.authorization)
        return res.status(401).send({ success: false, message: 'Token missing' });
    // Extrahiere Token aus dem authorization Feld im HTTP Request Header
    let token = req.headers.authorization.split(' ')[1];
    // Verifiziere extrahierten Token mittels Signaturpruefung
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // Wenn Verifizierung fehlgeschlagen, brich ab und sende Fehler
        if (err)
            return res.status(401).send({ success: false, message: 'Invalid token' });
        // Alles gut, speichere payload im req-Objekt
        req.tokenPayload = payload;
        // Fahre mit Anfrage fort
        next();
    });
}
exports.verifyUserToken = verifyUserToken;
const ProtectedRouter = express_1.Router();
ProtectedRouter.use(verifyUserToken);
// Route für Posts (Posts = Articles + Stories + Reviews + Market)
ProtectedRouter.route('/post')
    .post(post_controller_js_1.addNewPost); // erstellt neuen Post
ProtectedRouter.route('/post/:id')
    .delete(post_controller_js_1.deletePostById) // lösche Post by ID
    .get(post_controller_js_1.getPostById) // hole Post by ID
    .put(post_controller_js_1.updatePost);
// Route für Blogs (Blogs = Posts - Articles)
ProtectedRouter.route('/blogs')
    .get(post_controller_js_1.getPostsWOArticles); // fetcht alle sichtbaren & veröffentlichten Blogs
// Route für Reports (Meldungen)
ProtectedRouter.route('/report')
    .post(report_controller_js_1.createReport); // erstellt Report
// Route für Favorites
ProtectedRouter.route('/favorites/:skip')
    .get(post_controller_js_1.getUserFavorites); // fetcht alle Favorites des Users
ProtectedRouter.route('/favorites/:postId')
    .put(user_controller_js_1.toggleFavoritePost);
ProtectedRouter.route('/uservalidation')
    .get(user_controller_js_1.validateUser);
ProtectedRouter.route('/user')
    .delete(user_controller_js_1.deleteUserById) // löscht Userprofil
    .put(user_controller_js_1.updateOwnUserData); // editiert Userprofil
ProtectedRouter.route('/user/files/:id')
    .get(user_controller_js_1.getCloudFiles);
// Route für Comments
ProtectedRouter.route('/comments/:id')
    .put(comment_controller_js_1.editComment) // editiert Comment, Parameter:  commentId
    .post(comment_controller_js_1.addNewComment) // erstellt Comment, Parameter:  postId
    .delete(comment_controller_js_1.deleteCommentById) // Delete Comment
    .get(comment_controller_js_1.getCommentsById) // get comments by post id, Parameter: postId
    .get(comment_controller_js_1.getCommentById); // holt EINEN Comment by ID
// sueche users
ProtectedRouter.route('/search_user/:username')
    .get(user_controller_js_1.searchUsersByUsername);
// suche news nach text oder title
ProtectedRouter.route('/search_post/news/:title')
    .get(post_controller_js_1.getSearchNewsByTitle);
// sueche blogs nach text oder title
ProtectedRouter.route('/search_post/blogs/:title')
    .get(post_controller_js_1.getSearchBlogsByTitle);
ProtectedRouter.route('/:userId/posts')
    .get(user_controller_js_1.getUserPostsById);
exports.default = ProtectedRouter;
//# sourceMappingURL=protected.route.js.map