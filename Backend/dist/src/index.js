"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_service_js_1 = require("./service/db.service.js");
const public_route_js_1 = __importDefault(require("./routes/public.route.js"));
const protected_route_js_1 = __importDefault(require("./routes/protected.route.js"));
const admin_route_js_1 = __importDefault(require("./routes/admin.route.js"));
const MailService = __importStar(require("./service/mail.service.js"));
const cloudinary_service_js_1 = require("./service/cloudinary.service.js");
// Lade Umgebungsvariablen (engl. enviroment variables) aus der .env Datei
dotenv_1.default.config();
MailService.initSgMail();
// Initialisiere express
const app = express_1.default();
// Middleware fuer das body-Parsing
//!! Erweitere maximale file-size für Bild-Upload (wg Cloudinary)
app.use(express_1.default.json({ limit: "50mb" }));
// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors_1.default({
    origin: process.env.ORIGIN_FE,
}));
// --------------------- ROUTES -------------------------
app.use('/public', public_route_js_1.default);
app.use('/protected', protected_route_js_1.default);
app.use('/admin', admin_route_js_1.default);
// ---------------------INITIALISIERUNG--------------------------
const start = async () => {
    try {
        // Initialisiert Cloud-Dienst für File-Upload (Cloudinary)
        cloudinary_service_js_1.cloudinaryInit();
        // Einmalig Verbindung ueber default Connection aufbauen
        // es kann noch ein Callback mitgeliefert werden
        await db_service_js_1.connectToDb();
        // Starte Server auf dem in der Config hinterlegten Port
        app.listen(process.env.API_PORT, () => console.log(`Server is listening on http://localhost:${process.env.API_PORT}`));
    }
    catch (error) {
        console.log(error);
    }
};
start();
//# sourceMappingURL=index.js.map