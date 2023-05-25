



function BaseVideoPlayer({ url }) {

    let mimeType;

    // wenn URL von cloudinary dann setze mimeType
    if (url.substring(url.lastIndexOf('.'), url.length) === '.mp4') {
        mimeType = 'video/mp4'

    // Ansonsten extrahiere mimeType aus bas64-String
    } else {
        mimeType = url.substring(url.indexOf(':') + 1, url.indexOf(";"))
    };

    return (
        <div className="w-full h-full">
            <video controls className="w-full h-full">
                <source src={url} type={mimeType} />
            </video>
        </div>

    )
}


export default BaseVideoPlayer

