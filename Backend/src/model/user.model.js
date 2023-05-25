import mongoose from "mongoose";
import { uploadFile } from "../service/cloudinary.service.js";
import { ObjectId } from "mongodb";
// import { loginUser } from "../controller/user.controller";


// Subschema für User-Description
const descriptionSchema = new mongoose.Schema({
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
export const userSchema = new mongoose.Schema({
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
    bgImage: {type: String, default: "https://res.cloudinary.com/djiwww2us/image/upload/v1684312200/Asset-Images/piste_u9tckk.jpg"},
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    lastLogin: { type: Date, default: Date.now() },
    emailHash: { type: String },
    type: { type: String, default: 'User', enum: ['User'] },
    banned: { type: Boolean, default: false },
    video: { type: String, default: "" }
}, { timestamps: true });


// erstellt User-Model
export const User = mongoose.model("User", userSchema); getUser


export async function getUser(userId) {
    return await User.findById(userId)
}


// holt alle User (zu Entwicklungszwecken)
export async function getUsers(searchString, sortVal, sortDir) {

    const regex = new RegExp(searchString, 'i')

    // Gibt alle user zurück die den Such-String enthalten (case-insensitive)
    return await User.find({ username: { $regex: regex } }, { password: 0 })
        // und sortiert die Ergebnisse ebenso case-insensitive (collation) nach dem übergebenen Schlüssel (role,username,etc)
        .sort({ [sortVal]: sortDir }).collation({ locale: 'en', strength: 2 })
};


// erstellt neuen User (bei Registrierung)
export async function createUser(username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash) {

    // testet, ob Username bereits vorhanden
    let userExists = await User.findOne({ username });

    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        }
    };

    // testet, ob eMail bereits vorhanden
    let emailExists = await User.findOne({ email });

    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        }
    };

    // setzt neuen User zusammen
    let user = new User({
        username, password, fullname, email, birthday, city, description, role, image, favorites, emailHash
    });

    // speichert neuen User und gibt ihn zurück
    return await user.save()
};


export async function getUserById(id) {

    let user = await User.findById(id);

    if (!user) {
        throw {
            code: 404,
            message: `User does not exists`
        }
    };

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


    return updatedUser
}


// holt User mittel Username (nur bei Login!!)
export async function findByUsername(username) {

    let user = await User.findOne({ username: username });

    if (user) {
        // aktualisiert lastLogin bei jedem neuen Login
        user.lastLogin = Date.now();
        // speichert User
        await user.save();
    }

    // gibt user zurück
    return user;
};


// editiert eigenes User-Profil
export async function editOwnProfile(body, userId) {

    // holt Username und eMail aus body
    let { username, email } = body;

    // testet, ob Username bereits vorhanden
    let userExists = await User.findOne({ username });

    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists && userId != userExists._id) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        }
    };

    // testet, ob eMail bereits vorhanden
    let emailExists = await User.findOne({ email });

    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists && userId != emailExists._id) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        }
    };

    const currUser = await User.findById(userId);

    let imageURL = ""

    if ((body.image != currUser.image) && (body.image.length > 0)) {

        if (body.image.substring(0, 26) === 'https://res.cloudinary.com') {
            imageURL = body.image

        } else {

            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;

            imageURL = await uploadFile(body.image, imageName, userId)
        }
    };

    let bgImageURL = "";

    console.log(body.bgImage.substring(0, 26));

    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {

        if (body.bgImage.substring(0, 26) === 'https://res.cloudinary.com') {
            bgImageURL = body.bgImage
            
        } else {

            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;

            bgImageURL = await uploadFile(body.bgImage, imageName, userId)
        }
    };

    let userDescription
    if (!currUser.description) {
        userDescription = {
            prefStance: "n/a",
            favLocations: "n/a",
            style: "n/a",
            equipment: "n/a",
            text: "n/a"
        }
    } else {
        userDescription = { ...body.description }
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
        newUser.image = imageURL
    };

    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        newUser.bgImage = bgImageURL
    }

    // aktualisert User und gibt diesen zurück
    return await User.findOneAndUpdate({ _id: userId }, newUser, { new: true });

};


// editiert User-Profil durch Admin
export async function editProfile(body, userId) {

    // holt Username und eMail aus body
    let { username, email } = body;

    // testet, ob Username bereits vorhanden
    let userExists = await User.findOne({ username });

    // wenn Username bereits vorhanden, schmeiße Fehler
    if (userExists && userId != userExists._id) {
        throw {
            code: 409,
            message: `User with name ${username} already exists`
        }
    };

    // testet, ob eMail bereits vorhanden
    let emailExists = await User.findOne({ email });

    // wenn eMail bereit vorhanden, schmeiße Fehler
    if (emailExists && userId != emailExists._id) {
        throw {
            code: 409,
            message: `User with email ${email} already exists`
        }
    };

    const currUser = await User.findById(userId);

    let imageURL = "";

    if ((body.image != currUser.image) && (body.image.length > 0)) {

        if (body.image.substring(0, 26) === 'https://res.cloudinary.com') {
            imageURL = body.image

        } else {

            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;

            imageURL = await uploadFile(body.image, imageName, userId)
        }
    };

    let bgImageURL = "";

    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {

        if (body.bgImage.substring(0, 26) === 'https://res.cloudinary.com') {
            bgImageURL = body.bgImage
            
        } else {

            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const imageName = `${userId}_${dateString}`;

            bgImageURL = await uploadFile(body.bgImage, imageName, userId)
        }
    };

    let userDescription
    if (!currUser.description) {
        userDescription = {
            prefStance: "n/a",
            favLocations: "n/a",
            style: "n/a",
            equipment: "n/a",
            text: "n/a"
        }
    } else {
        userDescription = { ...body.description }
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
        newUser.image = imageURL
    }

    if ((body.bgImage != currUser.bgImage) && (body.bgImage.length > 0)) {
        newUser.bgImage = bgImageURL
    }

    // aktualisert User und gibt diesen zurück
    return await User.findOneAndUpdate({ _id: userId }, newUser, { new: true });

};


// Delete user
export async function deleteUser(userParamsId, userTokenId) {

    let userAdmin = await User.findById(userTokenId);

    if (userAdmin.role !== 'admin' && userParamsId !== userTokenId) {
        throw {
            code: 403,
            message: `User with id: ${userTokenId} is not allowed!`
        }
    };


    let user = await User.findById(userParamsId);

    if (!user) {
        throw {
            code: 404,
            message: `user with id: ${userParamsId} does not exists`
        }
    }

    return await User.findByIdAndDelete(userParamsId);
}

// Search Users
export async function findUsersByUsername(username) {

    return await User.find({ username: { $regex: username, $options: 'i' } }, { password: 0 });
}


export async function toggleFavorite(userId, postId) {
    // finde user
    let user = await User.findById(userId);


    if (user.favorites.includes(postId)) {
        // wenn post ist in favorites, dann fav finden und delete
        let favIndex = user.favorites.indexOf(postId);

        if (favIndex !== -1) {
            user.favorites.splice(favIndex, 1);
        }
    } else {
        // wenn post ist nicht in favs, dann add
        user.favorites.push(postId);
    }
    return user.save();
}


//------------------------------------EMAIL-VERIFIZIERUNG-------------------------------

// holt User mittels email-Hash
export async function getByEmailHash(hash) {
    return await User.findOne({ emailHash: hash });
};


// Setze User per ID auf Rolle "user"
export async function setVerified(id) {

    const user = await User.findById(id);

    // TODO pruefe existenz

    user.role = "user";

    user.emailHash = undefined;

    return await user.save();
};


// Ueberschreibe mailHash fuer User Eintrag, der mittels email Adresse gefunden wird
export async function updateEmailHash(email, hash) {

    const user = await User.findOne({ email: email });

    if (user === null) throw {
        code: 404,
        message: `This e-mail address is unknown`
    };

    user.emailHash = hash;

    await user.save();
}


export default User