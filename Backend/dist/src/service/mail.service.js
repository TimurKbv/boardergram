"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
// Funktion zum initialen Einrichten des Mail Clients
function initSgMail() {
    // Setze den API Key von SendGrid fuer den MailClient
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
}
exports.initSgMail = initSgMail;
// Service Funktion zum Erstellen und Versenden der Verifikationsmail
async function sendVerificationMail(recipient, mailHash) {
    // Erstelle Mail mit Link zur Verifikationsroute
    const msg = {
        to: recipient,
        from: 'boardergram@fn.de',
        subject: 'E-Mail verification for Auth-API',
        html: `Please verify your e-mail by following <a href="http://localhost:5173/verify?t=${mailHash}" target="_blank" >THIS</a> link.`,
    };
    // Sende Mail ab
    try {
        return await mail_1.default.send(msg);
    }
    catch (error) {
        throw error;
    }
}
exports.sendVerificationMail = sendVerificationMail;
//# sourceMappingURL=mail.service.js.map