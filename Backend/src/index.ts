import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './service/db.service.js';
import PublicRouter from './routes/public.route.js';
import ProtectedRouter from './routes/protected.route.js';
import AdminRouter from './routes/admin.route.js';
import * as MailService from './service/mail.service.js';
import { cloudinaryInit } from './service/cloudinary.service.js';



// Lade Umgebungsvariablen (engl. enviroment variables) aus der .env Datei
dotenv.config();

MailService.initSgMail();

// Initialisiere express
const app = express();

// Middleware fuer das body-Parsing
//!! Erweitere maximale file-size für Bild-Upload (wg Cloudinary)
app.use(express.json({ limit: "50mb" }));

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
    origin: process.env.ORIGIN_FE,
    // credentials: true
}));



// --------------------- ROUTES -------------------------


app.use('/public', PublicRouter);

app.use('/protected', ProtectedRouter);

app.use('/admin', AdminRouter);

// ---------------------INITIALISIERUNG--------------------------


const start = async () => {
    try {

        // Initialisiert Cloud-Dienst für File-Upload (Cloudinary)
        cloudinaryInit();

        // Einmalig Verbindung ueber default Connection aufbauen
        // es kann noch ein Callback mitgeliefert werden
        await connectToDb();

        // Starte Server auf dem in der Config hinterlegten Port
        app.listen(process.env.API_PORT, () => console.log(`Server is listening on http://localhost:${process.env.API_PORT}`));

    } catch (error) {
        console.log(error);
    }
};

start();