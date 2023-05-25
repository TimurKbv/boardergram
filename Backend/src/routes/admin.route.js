import { Router } from "express";
import jwt from "jsonwebtoken";
import { deleteUserById, getUsers, updateUserData, getUserById } from "../controller/user.controller.js";
import { getPostAmountOfUser, hidePost, getSortedPosts } from "../controller/post.controller.js";
import { getReportAmountOfUser, deleteReportById, getReports, closeReport } from "../controller/report.controller.js";
import { addNewComment, deleteCommentById, editComment, getCommentsById, hideComment } from "../controller/comment.controller.js";
import { updateCollection } from "../service/update.collection.js";



// Middleware-Funktion zum Validieren von Tokens im Header
export function verifyAdminToken(req, res, next) {
    // Wenn Authorization im Header nicht gesetzt, breche ab und sende Fehler
    if (!req.headers.authorization) return res.status(401).send({ success: false, message: 'Token missing!!!' });
    // Extrahiere Token aus dem authorization Feld im HTTP Request Header
    let token = req.headers.authorization.split(' ')[1];
    // Verifiziere extrahierten Token mittels Signaturpruefung
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // Wenn Verifizierung fehlgeschlagen, brich ab und sende Fehler
        if (err) return res.status(401).send({ success: false, message: 'Invalid token' });
        // Wenn User kein Admin, brich ab und sende Fehler
        if (payload.role !== 'admin') return res.status(401).send({ success: false, message: 'You are not an admin' });
        // Alles gut, speichere payload im req-Objekt
        req.tokenPayload = payload;
        // Fahre mit Anfrage fort
        next();
    });
};


const AdminRouter = Router();

AdminRouter.use(verifyAdminToken);

// USER
AdminRouter.route('/users')
    .get(getUsers)

AdminRouter.route('/user/:id')
    .delete(deleteUserById)     // löscht Userprofile
    .put(updateUserData)        // editiert Userprofile
    .get(getUserById)

// REPORTS
AdminRouter.route('/reports')
    .get(getReports)            // fetcht alle Reports

AdminRouter.route('/report/:id')
    .delete(deleteReportById)
    .put(closeReport)

AdminRouter.route('/reports/amount/:id')
    .get(getReportAmountOfUser)

// POSTS
AdminRouter.route('/posts/amount/:id')
    .get(getPostAmountOfUser)   // holt die Anzahl der Posts eines Users

AdminRouter.route('/post/:id')
    .put(hidePost)

AdminRouter.route('/posts')
    .get(getSortedPosts)

// COMMENTS
AdminRouter.route('/comment/:id')
    .put(hideComment)

// Pfad um key-value-Paar zu allen Dokumenten einer Collection hinzuzufügen
AdminRouter.route('/updatecollection') // Queries: model, key, value
    .put(updateCollection)


export default AdminRouter