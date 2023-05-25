import { Router } from "express";
import { registerNewUser, loginUser } from "../controller/user.controller.js";
import { getAllArticles } from "../controller/post.controller.js";
import { verifyEmail, refreshNewVerification } from "../controller/user.controller.js";



const PublicRouter = Router();

// Route zum registrieren
PublicRouter.route('/register')
    .post(registerNewUser)

// Route zum einloggen
PublicRouter.route('/login')
    .post(loginUser)

// Route zum fetchen aller sichtbaren Articles
PublicRouter.route('/articles/:skip')
    .get(getAllArticles)

// Routen Definition fuer /verify (Email-Verifikation)
PublicRouter.route('/verify')
    .post(verifyEmail)
    .put(refreshNewVerification);



export default PublicRouter