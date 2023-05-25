import ImagePreview from "./imagePreview"
import { useState, useEffect } from "react";
import { VscClose } from 'react-icons/vsc';
import { AiOutlineCheckCircle } from 'react-icons/ai';




function ImageChooser({ files, isFor, setIsOpen, setURL }) {

    const [choosenIndex, setChoosenIndex] = useState(null);

    const cards = files.map((file, index) => {
        if (isFor === 'profile' || isFor === 'background') {
            if (file.substring(file.lastIndexOf('.'), file.length) !== '.mp4') {
                return <ImagePreview url={file} key={index} setChoosenIndex={setChoosenIndex} choosenIndex={choosenIndex} index={index} />
            }
        }
    });


    function cancel() {
        setIsOpen(false)
    };


    function setImage() {
        setURL(files[choosenIndex]);
        setIsOpen(false)
    }


    return (
        <div className="absolute bg-white w-full top-20 left-0 h-auto">

            <div className=" flex flex-wrap justify-evenly gap-4 p-4 pb-10">{cards}</div>

            <VscClose
                className="hover:text-red-500 absolute text-[30px] bottom-3 right-12 cursor-pointer text-gray-500"
                onClick={cancel} />

            <AiOutlineCheckCircle
                className="hover:text-green-500 absolute text-[30px] bottom-3 right-3 cursor-pointer text-gray-500"
                onClick={setImage} />


        </div>
    )
}


export default ImageChooser