"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = __importStar(require("../model/user.model.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const md5_1 = __importDefault(require("md5"));
const MailService = __importStar(require("../service/mail.service.js"));
const PostModel = __importStar(require("../model/post.model.js"));
const cloudinary_service_js_1 = require("../service/cloudinary.service.js");
//! TODO: Filter-Funktion um User nach Name u.a. zu finden
// holt alle User
async function getUsers(req, res) {
    const searchString = req.query.search;
    const sortVal = req.query.sort;
    const sortDir = req.query.dir;
    try {
        // holt alle User
        let users = await UserModel.getUsers(searchString, sortVal, sortDir);
        res.send({
            success: true,
            users: users
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getUsers = getUsers;
;
async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        // holt alle User
        let user = await UserModel.getUser(userId);
        res.send({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getUserById = getUserById;
;
// erstellt neuen User / Registrierung
async function registerNewUser(req, res) {
    // extrahiert User-Informationen aus dem body
    let body = req.body;
    // erstellt einen eMail-Hash um Verifizierungs-Link zu senden
    const salt = await bcrypt_1.default.genSalt(10);
    body.emailHash = md5_1.default(body.email + salt);
    // extrahiert alle fields aus body
    let { username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash } = body;
    // verschlüsselt Passwort / erstellt Passwort-Hash
    password = await bcrypt_1.default.hash(password, 10);
    try {
        // übergibt alle fields, erstellt neuen User und gibt diesen zurück
        let newUser = await UserModel.createUser(username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash);
        try {
            // sendet Verifizierungslink via eMail
            MailService.sendVerificationMail(newUser.email, newUser.emailHash);
        }
        catch (error) {
            console.log(error);
        }
        ;
        res.send({
            success: true,
            data: newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            message: error.message
        });
    }
}
exports.registerNewUser = registerNewUser;
;
// loggt User ein
async function loginUser(req, res) {
    // extrahiere body
    const { username, password } = req.body;
    // finde User anhand des usernamen
    const user = await UserModel.findByUsername(username);
    // wenn user nicht gefunden
    if (user === null) {
        // Sende Fehler
        res.status(401).send({
            message: `User not found`
        });
        // Abbruch via early return
        return;
    }
    // wenn user gefunden
    // vergleiche password mit gespeichertem Passwort
    const isEqual = await bcrypt_1.default.compare(password, user.password);
    // Wenn Passwort-Vergleich fehlschlaegt -> Sende Fehler
    if (!isEqual)
        return res.status(401).send({ message: 'Password incorrect' });
    // Wenn Passwort-Vergleich erfolgreich
    // erstelle tokenPayload
    const tokenPayload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    };
    // erstelle token mit tokenPayload und jwt-Secret
    const accessToken = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET);
    let foundUser = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        birthday: user.birthday,
        city: user.city,
        description: user.description ? {
            prefStance: user.description.prefStance,
            favLocations: user.description.favLocations,
            style: user.description.style,
            equipment: user.description.equipment,
            text: user.description.text
        } : null,
        lastLogin: user.lastLogin,
        image: user.image,
        bgImage: user.bgImage,
        role: user.role,
        favorites: user.favorites
    };
    res.send({ user: foundUser, token: accessToken });
}
exports.loginUser = loginUser;
;
async function validateUser(req, res) {
    const userId = req.tokenPayload._id;
    try {
        const user = await UserModel.getUserById(userId);
        res.send({
            success: true,
            user: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            message: error.message
        });
    }
}
exports.validateUser = validateUser;
// aktualisiert eigene Userdaten
async function updateOwnUserData(req, res) {
    // hole body
    let body = req.body;
    // hole userId aus tokenPayload
    let userId = req.tokenPayload._id;
    try {
        // übergibt/aktualisiert Userdaten und gibt aktualisierten User zurück
        let user = await UserModel.editOwnProfile(body, userId);
        let updatedUser = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            birthday: user.birthday,
            city: user.city,
            description: user.description ? {
                prefStance: user.description.prefStance,
                favLocations: user.description.favLocations,
                style: user.description.style,
                equipment: user.description.equipment,
                text: user.description.text
            } : '',
            lastLogin: user.lastLogin,
            image: user.image,
            bgImage: user.bgImage,
            role: user.role,
            favorites: user.favorites
        };
        res.send({
            success: true,
            user: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
    ;
}
exports.updateOwnUserData = updateOwnUserData;
;
// aktualisiert Userdaten durch Admin
async function updateUserData(req, res) {
    // hole body
    let body = req.body;
    // hole userId aus tokenPayload
    let userId = req.params.id;
    try {
        // übergibt/aktualisiert Userdaten und gibt aktualisierten User zurück
        let user = await UserModel.editProfile(body, userId);
        let updatedUser = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            birthday: user.birthday,
            city: user.city,
            description: user.description ? {
                prefStance: user.description.prefStance,
                favLocations: user.description.favLocations,
                style: user.description.style,
                equipment: user.description.equipment,
                text: user.description.text
            } : '',
            lastLogin: user.lastLogin,
            image: user.image,
            bgImage: user.bgImage,
            role: user.role,
            favorites: user.favorites,
            banned: user.banned
        };
        res.send({
            success: true,
            user: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
    ;
}
exports.updateUserData = updateUserData;
;
// Delete User 
async function deleteUserById(req, res) {
    let userIdToDelete = req.params.id;
    let userTokenId = req.tokenPayload._id;
    try {
        let user = await UserModel.deleteUser(userIdToDelete, userTokenId);
        res.send({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
    ;
}
exports.deleteUserById = deleteUserById;
async function searchUsersByUsername(req, res) {
    let username = req.params.username;
    try {
        let users = await UserModel.findUsersByUsername(username);
        res.send({
            success: true,
            users: users
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
exports.searchUsersByUsername = searchUsersByUsername;
async function toggleFavoritePost(req, res) {
    let postId = req.params.postId;
    let userId = req.tokenPayload._id;
    try {
        let user = await UserModel.toggleFavorite(userId, postId);
        let foundUser = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            birthday: user.birthday,
            city: user.city,
            description: user.description ? {
                prefStance: user.description.prefStance,
                favLocations: user.description.favLocations,
                style: user.description.style,
                equipment: user.description.equipment,
                text: user.description.text
            } : '',
            lastLogin: user.lastLogin,
            image: user.image,
            role: user.role,
            favorites: user.favorites
        };
        res.send({
            success: true,
            data: foundUser
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
exports.toggleFavoritePost = toggleFavoritePost;
// Get Posts created from User
async function getUserPostsById(req, res) {
    let userId = req.params.userId;
    try {
        let posts = await PostModel.getUserPosts(userId);
        res.send({
            success: true,
            posts: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getUserPostsById = getUserPostsById;
;
async function getCloudFiles(req, res) {
    const userId = req.params.id;
    try {
        let result = await cloudinary_service_js_1.getAllFiles(userId);
        let urls = result.resources.map(resource => resource.secure_url);
        res.send({
            success: true,
            urls: urls
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
exports.getCloudFiles = getCloudFiles;
//-------------------------------EMAIL-VERIFIZIERUNG-------------------------
// Controller Funktion zum Verifizieren der Email-Adresse des Users
async function verifyEmail(req, res) {
    // Extrahiere Email-Token aus query Parametern
    const emailToken = req.body.token;
    // Finde User Eintrag anhand des Email-Tokens
    const user = await UserModel.getByEmailHash(emailToken);
    // Datumsobjekt fuer JETZT
    const now = new Date();
    // Wenn kein User gefunden ODER letztes Update des Eintrags laenger als 10 Minuten her
    if (user === null || (now - user.updatedAt > (10 * 30 * 1000))) {
        // Redirect auf entsprechende Frontend-Page
        res.status(401).send({
            redirectTo: 'http://localhost:5173/login',
            message: 'E-Mail verification token invalid'
        });
        // Early return
        return;
    }
    // Alles ok
    // Setze User-Rolle auf "user" (also ist verifiziert)
    const verifiedUser = await UserModel.setVerified(user._id);
    // Redirect auf entsprechende Frontend-Page
    res.send({
        redirectTo: 'http://localhost:5173/login',
        message: 'Thank you for verifying your e-mail address'
    });
}
exports.verifyEmail = verifyEmail;
;
// Controller Funktion zum Erneuern des Verifikations Token und versenden einer neuen Email
async function refreshNewVerification(req, res) {
    // Extrahiere Email aus dem Request-Body
    const { email } = req.body;
    // Erstelle MD5 Hash der Email Adresse mit Salt und fuege sie dem Body hinzu
    const salt = await bcrypt_1.default.genSalt(10);
    const newHash = md5_1.default(email + salt);
    try {
        // Erneuere den Email-Hash im Eintrag des Users
        await UserModel.updateEmailHash(email, newHash);
        // Versende Verifikations Mail
        MailService.sendVerificationMail(email, newHash);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: error.message
        });
        return;
    }
    // Sende Erfolgsnachricht, egal ob User gefunden wurde oder nicht
    res.send({
        success: true,
        message: 'Verification E-Mail has been sent'
    });
}
exports.refreshNewVerification = refreshNewVerification;
//# sourceMappingURL=user.controller.js.map