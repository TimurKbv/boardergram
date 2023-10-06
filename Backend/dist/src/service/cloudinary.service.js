"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const url_gen_1 = require("@cloudinary/url-gen");
// Funktion zur Initialisierung von Cloudinary und Übergabe der Keys
function cloudinaryInit() {
    cloudinary_1.default.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
    });
    console.log("cloudinary initialized");
}
exports.cloudinaryInit = cloudinaryInit;
;
const CLOUD = new url_gen_1.Cloudinary({
    cloud: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
    }
});
async function uploadFile(file, name, folder) {
    const index = file.indexOf("/");
    const dataType = file.substring(5, index);
    if (index === -1 || (dataType !== 'video' && dataType !== 'image')) {
        throw {
            code: 415,
            message: `Unsupported Media Type at file upload`
        };
    }
    ;
    let result;
    if (dataType === 'video') {
        result = await cloudinary_1.default.v2.uploader.upload(file, {
            resource_type: dataType,
            public_id: name,
            folder: folder,
            e_transformation: {
                format: 'mp4'
            }
        });
    }
    else {
        result = await cloudinary_1.default.v2.uploader.upload(file, {
            resource_type: dataType,
            public_id: name,
            folder: folder
        });
    }
    if (!result) {
        throw {
            code: 503,
            message: `Cannot reach Cloudinary`
        };
    }
    ;
    return result.secure_url;
}
exports.uploadFile = uploadFile;
;
// API-Aufruf zum Abrufen aller Dateien im Ordner
async function getAllFiles(folder) {
    const result = await cloudinary_1.default.v2.api
        .resources({
        type: 'upload',
        prefix: folder,
        max_results: 500
    });
    // .then(result => console.log(result));
    return result;
}
exports.getAllFiles = getAllFiles;
//# sourceMappingURL=cloudinary.service.js.map