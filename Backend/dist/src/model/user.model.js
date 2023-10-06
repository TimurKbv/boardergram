"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_service_js_1 = require("../service/cloudinary.service.js");
// import { loginUser } from "../controller/user.controller";
// Subschema für User-Description
const descriptionSchema = new mongoose_1.default.Schema({
    _id: false,
    prefStance: {
        type: String,
        // enum: ['regular', 'goofy'] 
        default: ''
    },
    favLocations: { type: String, default: '' },
    style: { type: String, default: '' },
    equipment: { type: String, default: '' },
    text: { type: String, default: '' },
});
// User-Schema
exports.userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: String, default: '' },
    city: { type: String },
    description: { type: descriptionSchema },
    role: { type: String, enum: ['admin', 'author', 'user'], default: 'user' },
    // cloudinary-URL für Profilbild hinterlegen:
    image: { type: String, default: "https://res.cloudinary.com/djiwww2us/image/upload/v1681913777/Asset-Images/anonym_bllrvm.png" },
    bgImage: { type: String, default: "https://res.cloudinary.com/djiwww2us/image/upload/v1684312200/Asset-Images/piste_u9tckk.jpg" },
    favorites: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }],
    lastLogin: { type: Date, default: Date.now() },
    emailHash: { type: String },
    type: { type: String, default: 'User', enum: ['User'] },
    banned: { type: Boolean, default: false },
    video: { type: String, default: "" }
}, { timestamps: true });
// erstellt User-Model
exports.User = mongoose_1.default.model("User", exports.userSchema);
getUser;
async function getUser(userId) {
    return await exports.User.findById(userId);
}
exports.getUser = getUser;
// holt alle User (zu Entwicklungszwecken)
async function getUsers(searchString, sortVal, sortDir) {
    const regex = new RegExp(searchString, 'i');
    // Gibt alle user zurück die den Such-String enthalten (case-insensitive)
    return await exports.User.find({ username: { $regex: regex } }, { password: 0 })
        // und sortiert die Ergebnisse ebenso case-insensitive (collation) nach dem übergebenen Schlüssel (role,username,etc)
        .sort({ [sortVal]: sortDir }).collation({ locale: 'en', strength: 2 });
}
exports.getUsers = getUsers;
;
// erstellt neuen User (bei Registrierung)
async function createUser(username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash) {
    // testet, ob Username bereits vorhanden
    let userExists = await exports.User.findOne({ username });
    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        };
    }
    ;
    // testet, ob eMail bereits vorhanden
    let emailExists = await exports.User.findOne({ email });
    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        };
    }
    ;
    // setzt neuen User zusammen
    let user = new exports.User({
        username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash
    });
    // speichert neuen User und gibt ihn zurück
    return await user.save();
}
exports.createUser = createUser;
;
async function getUserById(id) {
    let user = await exports.User.findById(id);
    if (!user) {
        throw {
            code: 404,
            message: `User does not exists`
        };
    }
    ;
    let updatedUser = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        birthday: user.birthday,
        city: user.city,
        description: user.description && {
            prefStance: user.description.prefStance,
            favLocations: user.description.favLocations,
            style: user.description.style,
            equipment: user.description.equipment,
            text: user.description.text
        },
        lastLogin: user.lastLogin,
        image: user.image,
        bgImage: user.bgImage,
        role: user.role,
        favorites: user.favorites
    };
    return updatedUser;
}
exports.getUserById = getUserById;
// holt User mittel Username (nur bei Login!!)
async function findByUsername(username) {
    let user = await exports.User.findOne({ username: username });
    if (user) {
        // aktualisiert lastLogin bei jedem neuen Login
        user.lastLogin = Date.now();
        // speichert User
        await user.save();
    }
    // gibt user zurück
    return user;
}
exports.findByUsername = findByUsername;
;
// editiert eigenes User-Profil
async function editOwnProfile(body, userId) {
    // holt Username und eMail aus body
    let { username, email } = body;
    // testet, ob Username bereits vorhanden
    let userExists = await exports.User.findOne({ username });
    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists && userId != userExists._id) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        };
    }
    ;
    // testet, ob eMail bereits vorhanden
    let emailExists = await exports.User.findOne({ email });
    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists && userId != emailExists._id) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        };
    }
    ;
    const currUser = await exports.User.findById(userId);
    let imageURL = "";
    if ((body.image != currUser.image) && (body.image.length > 0)) {
        if (body.image.substring(0, 26) === 'https://res.cloudinary.com') {
            imageURL = body.image;
        }
        else {
            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;
            imageURL = await cloudinary_service_js_1.uploadFile(body.image, imageName, userId);
        }
    }
    ;
    let bgImageURL = "";
    console.log(body.bgImage.substring(0, 26));
    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        if (body.bgImage.substring(0, 26) === 'https://res.cloudinary.com') {
            bgImageURL = body.bgImage;
        }
        else {
            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;
            bgImageURL = await cloudinary_service_js_1.uploadFile(body.bgImage, imageName, userId);
        }
    }
    ;
    let userDescription;
    if (!currUser.description) {
        userDescription = {
            prefStance: "n/a",
            favLocations: "n/a",
            style: "n/a",
            equipment: "n/a",
            text: "n/a"
        };
    }
    else {
        userDescription = { ...body.description };
    }
    // setzt User-Objekt zusammen, ausschließlich mit Feldern die erlaubt sind (z.B. kein Passwort überschreiben)
    let newUser = {
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        birthday: body.birthday,
        city: body.city,
        description: { ...userDescription }
    };
    if ((body.image != currUser.image) && (body.image.length > 0)) {
        newUser.image = imageURL;
    }
    ;
    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        newUser.bgImage = bgImageURL;
    }
    // aktualisert User und gibt diesen zurück
    return await exports.User.findOneAndUpdate({ _id: userId }, newUser, { new: true });
}
exports.editOwnProfile = editOwnProfile;
;
// editiert User-Profil durch Admin
async function editProfile(body, userId) {
    // holt Username und eMail aus body
    let { username, email } = body;
    // testet, ob Username bereits vorhanden
    let userExists = await exports.User.findOne({ username });
    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists && userId != userExists._id) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        };
    }
    ;
    // testet, ob eMail bereits vorhanden
    let emailExists = await exports.User.findOne({ email });
    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists && userId != emailExists._id) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        };
    }
    ;
    const currUser = await exports.User.findById(userId);
    let imageURL = "";
    if ((body.image != currUser.image) && (body.image.length > 0)) {
        if (body.image.substring(0, 26) === 'https://res.cloudinary.com') {
            imageURL = body.image;
        }
        else {
            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;
            imageURL = await cloudinary_service_js_1.uploadFile(body.image, imageName, userId);
        }
    }
    ;
    let bgImageURL = "";
    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        if (body.bgImage.substring(0, 26) === 'https://res.cloudinary.com') {
            bgImageURL = body.bgImage;
        }
        else {
            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;
            bgImageURL = await cloudinary_service_js_1.uploadFile(body.bgImage, imageName, userId);
        }
    }
    ;
    let userDescription;
    if (!currUser.description) {
        userDescription = {
            prefStance: "n/a",
            favLocations: "n/a",
            style: "n/a",
            equipment: "n/a",
            text: "n/a"
        };
    }
    else {
        userDescription = { ...body.description };
    }
    // setzt User-Objekt zusammen, ausschließlich mit Feldern die erlaubt sind (z.B. kein Passwort überschreiben)
    let newUser = {
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        birthday: body.birthday,
        city: body.city,
        description: { ...userDescription },
        role: body.role,
        banned: body.banned
    };
    if ((body.image != currUser.image) && (body.image.length > 0)) {
        newUser.image = imageURL;
    }
    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        newUser.bgImage = bgImageURL;
    }
    // aktualisert User und gibt diesen zurück
    return await exports.User.findOneAndUpdate({ _id: userId }, newUser, { new: true });
}
exports.editProfile = editProfile;
;
// Delete user
async function deleteUser(userParamsId, userTokenId) {
    let userAdmin = await exports.User.findById(userTokenId);
    if (userAdmin.role !== 'admin' && userParamsId !== userTokenId) {
        throw {
            code: 403,
            message: `User with id: ${userTokenId} is not allowed!`
        };
    }
    ;
    let user = await exports.User.findById(userParamsId);
    if (!user) {
        throw {
            code: 404,
            message: `user with id: ${userParamsId} does not exists`
        };
    }
    return await exports.User.findByIdAndDelete(userParamsId);
}
exports.deleteUser = deleteUser;
// Search Users
async function findUsersByUsername(username) {
    return await exports.User.find({ username: { $regex: username, $options: 'i' } }, { password: 0 });
}
exports.findUsersByUsername = findUsersByUsername;
async function toggleFavorite(userId, postId) {
    // finde user
    let user = await exports.User.findById(userId);
    if (user.favorites.includes(postId)) {
        // wenn post ist in favorites, dann fav finden und delete
        let favIndex = user.favorites.indexOf(postId);
        if (favIndex !== -1) {
            user.favorites.splice(favIndex, 1);
        }
    }
    else {
        // wenn post ist nicht in favs, dann add
        user.favorites.push(postId);
    }
    return user.save();
}
exports.toggleFavorite = toggleFavorite;
//------------------------------------EMAIL-VERIFIZIERUNG-------------------------------
// holt User mittels email-Hash
async function getByEmailHash(hash) {
    return await exports.User.findOne({ emailHash: hash });
}
exports.getByEmailHash = getByEmailHash;
;
// Setze User per ID auf Rolle "user"
async function setVerified(id) {
    const user = await exports.User.findById(id);
    // TODO pruefe existenz
    user.role = "user";
    user.emailHash = undefined;
    return await user.save();
}
exports.setVerified = setVerified;
;
// Ueberschreibe mailHash fuer User Eintrag, der mittels email Adresse gefunden wird
async function updateEmailHash(email, hash) {
    const user = await exports.User.findOne({ email: email });
    if (user === null)
        throw {
            code: 404,
            message: `This e-mail address is unknown`
        };
    user.emailHash = hash;
    await user.save();
}
exports.updateEmailHash = updateEmailHash;
exports.default = exports.User;
//# sourceMappingURL=user.model.js.map