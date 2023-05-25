import { getImgPublicId, CLOUD } from "../../services/cloudinary.js";
import { AdvancedImage } from '@cloudinary/react';
import { scale } from "@cloudinary/url-gen/actions/resize";




function ImagePreview({ url, index, choosenIndex, setChoosenIndex }) {

    const publicId = getImgPublicId(url)
    const previewImage = CLOUD.image(publicId);
    previewImage.resize(scale().height(200));


    function setImage() {
        setChoosenIndex(index)
    };


    let borderByChoice= (index === choosenIndex ? "border-cyan-500 scale-[1.05]" : "border-white")


    return (

        <div className={`border border-4 cursor-pointer ${borderByChoice}`} onClick={setImage}>
            <AdvancedImage cldImg={previewImage}/>
        </div>



    )
}


export default ImagePreview