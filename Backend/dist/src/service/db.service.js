"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/*
    Alternativ kann die Verbindung auch einmalig ueber mongoose.connect aufgebaut werden,
    so dass sie als 'default' Connection in mongoose gehalten wird.
    So kann sich immer nur mit einer Datenbank gleichzeitig verbunden werden, erspart uns jedoch evtl.
    etwas Komplexitaet, weil wir uns dann fast gar nicht um die Verbindung kuemmern muessen ausser sie einmal aufzubauen.
*/
/*
    Diese Funktion wuerde man einmalig in der index.js aufrufen und ab dann,
    immer ueber mongoose die Models anmelden etc.
*/
async function connectToDb(callback) {
    try {
        // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
            maxPoolSize: 10
        });
        // Falls callback direkt nach Verbindung ausgefuehrt werden soll
        // Bspw. ein Seeding von intialen DB Eintraegen
        if (callback) {
            // fuehre callback aus
            callback();
        }
        console.log('Connection to DB established');
    }
    catch (error) {
        console.error(error);
    }
}
exports.connectToDb = connectToDb;
//# sourceMappingURL=db.service.js.map