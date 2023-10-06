"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_controller_js_1 = require("../controller/user.controller.js");
const post_controller_js_1 = require("../controller/post.controller.js");
const report_controller_js_1 = require("../controller/report.controller.js");
const comment_controller_js_1 = require("../controller/comment.controller.js");
const update_collection_js_1 = require("../service/update.collection.js");
// Middleware-Funktion zum Validieren von Tokens im Header
function verifyAdminToken(req, res, next) {
    // Wenn Authorization im Header nicht gesetzt, breche ab und sende Fehler
    if (!req.headers.authorization)
        return res.status(401).send({ success: false, message: 'Token missing!!!' });
    // Extrahiere Token aus dem authorization Feld im HTTP Request Header
    let token = req.headers.authorization.split(' ')[1];
    // Verifiziere extrahierten Token mittels Signaturpruefung
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // Wenn Verifizierung fehlgeschlagen, brich ab und sende Fehler
        if (err)
            return res.status(401).send({ success: false, message: 'Invalid token' });
        // Wenn User kein Admin, brich ab und sende Fehler
        if (payload.role !== 'admin')
            return res.status(401).send({ success: false, message: 'You are not an admin' });
        // Alles gut, speichere payload im req-Objekt
        req.tokenPayload = payload;
        // Fahre mit Anfrage fort
        next();
    });
}
exports.verifyAdminToken = verifyAdminToken;
;
const AdminRouter = express_1.Router();
AdminRouter.use(verifyAdminToken);
// USER
AdminRouter.route('/users')
    .get(user_controller_js_1.getUsers);
AdminRouter.route('/user/:id')
    .delete(user_controller_js_1.deleteUserById) // löscht Userprofile
    .put(user_controller_js_1.updateUserData) // editiert Userprofile
    .get(user_controller_js_1.getUserById);
// REPORTS
AdminRouter.route('/reports')
    .get(report_controller_js_1.getReports); // fetcht alle Reports
AdminRouter.route('/report/:id')
    .delete(report_controller_js_1.deleteReportById)
    .put(report_controller_js_1.closeReport);
AdminRouter.route('/reports/amount/:id')
    .get(report_controller_js_1.getReportAmountOfUser);
// POSTS
AdminRouter.route('/posts/amount/:id')
    .get(post_controller_js_1.getPostAmountOfUser); // holt die Anzahl der Posts eines Users
AdminRouter.route('/post/:id')
    .put(post_controller_js_1.hidePost);
AdminRouter.route('/posts')
    .get(post_controller_js_1.getSortedPosts);
// COMMENTS
AdminRouter.route('/comment/:id')
    .put(comment_controller_js_1.hideComment);
// Pfad um key-value-Paar zu allen Dokumenten einer Collection hinzuzufügen
AdminRouter.route('/updatecollection') // Queries: model, key, value
    .put(update_collection_js_1.updateCollection);
exports.default = AdminRouter;
//# sourceMappingURL=admin.route.js.map