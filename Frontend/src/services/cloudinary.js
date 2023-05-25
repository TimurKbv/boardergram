import { Cloudinary } from "@cloudinary/url-gen";


export const CLOUD = new Cloudinary({
    cloud: {
        cloudName: 'djiwww2us'
    }
});

export function getImgPublicId(url) {

    let publicId

    if (!url || url.length < 1) {

        // Setzt Default Image aus Asset-Ordner (Cloudinary)
        publicId = "Asset-Images/anonym_bllrvm"

    } else {

        // Sucht nach dem zweitletzten "/" und speichert dessen Index
        const secondLastSlashIndex = url.lastIndexOf('/', url.lastIndexOf('/') - 1);

        // Extrahiert den Teilstring zwischen dem zweitletzten "/" und dem letzten "."
        publicId = url.substring(secondLastSlashIndex + 1, url.lastIndexOf('.'));
    }

    // Gibt den extrahierten Dateinamen zurück
    return publicId;
};