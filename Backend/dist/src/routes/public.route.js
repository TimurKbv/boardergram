"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controller/user.controller.js");
const post_controller_js_1 = require("../controller/post.controller.js");
const user_controller_js_2 = require("../controller/user.controller.js");
const PublicRouter = express_1.Router();
// Route zum registrieren
PublicRouter.route('/register')
    .post(user_controller_js_1.registerNewUser);
// Route zum einloggen
PublicRouter.route('/login')
    .post(user_controller_js_1.loginUser);
// Route zum fetchen aller sichtbaren Articles
PublicRouter.route('/articles/:skip')
    .get(post_controller_js_1.getAllArticles);
// Routen Definition fuer /verify (Email-Verifikation)
PublicRouter.route('/verify')
    .post(user_controller_js_2.verifyEmail)
    .put(user_controller_js_2.refreshNewVerification);
exports.default = PublicRouter;
//# sourceMappingURL=public.route.js.map