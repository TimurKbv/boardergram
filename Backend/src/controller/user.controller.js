import * as UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import md5 from 'md5';
import * as MailService from '../service/mail.service.js';
import * as PostModel from "../model/post.model.js";
import { getAllFiles } from "../service/cloudinary.service.js";


//! TODO: Filter-Funktion um User nach Name u.a. zu finden
// holt alle User
export async function getUsers(req, res) {

    const searchString = req.query.search;
    const sortVal = req.query.sort;
    const sortDir = req.query.dir;

    try {
        // holt alle User
        let users = await UserModel.getUsers(searchString, sortVal, sortDir)

        res.send({
            success: true,
            users: users
        })

    } catch (error) {
        console.log(error);
    }
};


export async function getUserById(req, res) {

    const userId = req.params.id

    try {
        // holt alle User
        let user = await UserModel.getUser(userId)

        res.send({
            success: true,
            data: user
        })

    } catch (error) {
        console.log(error);
    }
};


// erstellt neuen User / Registrierung
export async function registerNewUser(req, res) {

    // extrahiert User-Informationen aus dem body
    let body = req.body

    // erstellt einen eMail-Hash um Verifizierungs-Link zu senden
    const salt = await bcrypt.genSalt(10);
    body.emailHash = md5(body.email + salt);

    // extrahiert alle fields aus body
    let { username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash } = body;

    // verschlüsselt Passwort / erstellt Passwort-Hash
    password = await bcrypt.hash(password, 10);


    try {
        // übergibt alle fields, erstellt neuen User und gibt diesen zurück
        let newUser = await UserModel.createUser(username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash)

        try {
            // sendet Verifizierungslink via eMail
            MailService.sendVerificationMail(newUser.email, newUser.emailHash);

        } catch (error) {
            console.log(error);
        };

        res.send({
            success: true,
            data: newUser
        });

    } catch (error) {

        console.log(error);

        res.status(error.code).send({
            message: error.message
        });
    }
};


// loggt User ein
export async function loginUser(req, res) {
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
    const isEqual = await bcrypt.compare(password, user.password);

    // Wenn Passwort-Vergleich fehlschlaegt -> Sende Fehler
    if (!isEqual) return res.status(401).send({ message: 'Password incorrect' });

    // Wenn Passwort-Vergleich erfolgreich
    // erstelle tokenPayload
    const tokenPayload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    };
    // erstelle token mit tokenPayload und jwt-Secret
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

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
};


export async function validateUser(req, res) {

    const userId = req.tokenPayload._id;

    try {

        const user = await UserModel.getUserById(userId);

        res.send({
            success: true,
            user: user
        })

    } catch (error) {
        console.log(error);

        res.status(error.code).send({
            message: error.message
        })
    }
}


// aktualisiert eigene Userdaten
export async function updateOwnUserData(req, res) {

    // hole body
    let body = req.body;

    // hole userId aus tokenPayload
    let userId = req.tokenPayload._id;

    try {

        // übergibt/aktualisiert Userdaten und gibt aktualisierten User zurück
        let user = await UserModel.editOwnProfile(body, userId)

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
        })

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    };
};


// aktualisiert Userdaten durch Admin
export async function updateUserData(req, res) {

    // hole body
    let body = req.body;

    // hole userId aus tokenPayload
    let userId = req.params.id;

    try {

        // übergibt/aktualisiert Userdaten und gibt aktualisierten User zurück
        let user = await UserModel.editProfile(body, userId)

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
        })

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    };
};


// Delete User 
export async function deleteUserById(req, res) {

    let userIdToDelete = req.params.id;
    let userTokenId = req.tokenPayload._id;    

    try {


        let user = await UserModel.deleteUser(userIdToDelete, userTokenId);

        res.send({
            success: true,
            data: user
        });

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    };
}

export async function searchUsersByUsername(req, res) {
    let username = req.params.username;

    try {
        let users = await UserModel.findUsersByUsername(username);

        res.send({
            success: true,
            users: users
        });

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}

export async function toggleFavoritePost(req, res) {
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
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}


// Get Posts created from User
export async function getUserPostsById(req, res) {
    let userId = req.params.userId;
    try {
        let posts = await PostModel.getUserPosts(userId);
        res.send({
            success: true,
            posts: posts
        })
    } catch (error) {
        console.log(error);
    }
};


export async function getCloudFiles(req, res) {

    const userId = req.params.id;

    try {
        let result = await getAllFiles(userId)

        let urls = result.resources.map(resource => resource.secure_url)

        res.send({
            success: true,
            urls: urls
        })

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}


//-------------------------------EMAIL-VERIFIZIERUNG-------------------------

// Controller Funktion zum Verifizieren der Email-Adresse des Users
export async function verifyEmail(req, res) {
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
            redirectTo: 'http://localhost:5173/login', // ?????
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
};


// Controller Funktion zum Erneuern des Verifikations Token und versenden einer neuen Email
export async function refreshNewVerification(req, res) {

    // Extrahiere Email aus dem Request-Body
    const { email } = req.body;

    // Erstelle MD5 Hash der Email Adresse mit Salt und fuege sie dem Body hinzu
    const salt = await bcrypt.genSalt(10);
    const newHash = md5(email + salt);

    try {
        // Erneuere den Email-Hash im Eintrag des Users
        await UserModel.updateEmailHash(email, newHash);

        // Versende Verifikations Mail
        MailService.sendVerificationMail(email, newHash);

    } catch (error) {
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


