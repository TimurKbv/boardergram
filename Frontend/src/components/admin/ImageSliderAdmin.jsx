import React, { useEffect, useState, useRef } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import BaseVideoPlayer from '../../services/BaseVideoPlayer';
import YouTubeVideoPlayer from '../../services/YouTubeVideoPlayer';
import { VscClose, VscSettings } from 'react-icons/vsc';


function ImageSliderAdmin({ slides, setCurrSlide, isEdit, deleteFile }) {
    const [current, setCurrent] = useState(0);


    // Next picture
    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
        // Slider Anzeige umschalten
        setCurrSlide(prev => current === slides.length - 1 ? 1 : prev + 1);
    };
    // Prev picture
    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
        // Slider Anzeige umschalten
        setCurrSlide(prev => current === 0 ? slides.length : prev - 1);
    };

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    function isVideo(url) {

        console.log(url.substring(url.indexOf(':'), url.indexOf("/")));
        let index = url.lastIndexOf('.');

        if (url.substring(index + 1, url.length) === 'mp4' || (url.substring(url.indexOf(':'), url.indexOf("/")) === ':video')) {
            return true
        } else {
            return false
        }
    };


    function isYouTubeVideoLink(url) {
        // Regulärer Ausdruck für YouTube-Video-Links
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

        return youtubeRegex.test(url);
    }


    function getSlideElement(url) {

        if ((url.substring(url.lastIndexOf('.'), url.length) === '.mp4') || (url.substring(url.indexOf(':'), url.indexOf("/")) === ':video')) {
            return <BaseVideoPlayer url={url} />

        } else if (isYouTubeVideoLink(url)) {
            return <YouTubeVideoPlayer url={url} />

        } else {
            return (
                <img src={url} alt='travel image' className='w-full h-full object-contain rounded-md md:scale-100 hover:opacity-70' />
            )
        }
    }


    return (

        <section className='container w-full flex items-center h-[50vh] md:h-[60vh]'>

            {/* NAVH LINKS BUTTON */}
            {slides.length > 1 &&

                <button
                    className='h-full opacity-40 hover:opacity-100  w-1/6 flex justify-center items-center '
                    onClick={prevSlide}
                >
                    {<GrPrevious

                        size={50}
                    />}
                </button>
            }

            {/* CONTENT */}
            {slides.map((slide, index) => {
                return (
                    <div
                        className={index === current ? 'flex items-center justify-center  transition duration-100 w-full h-full' : 'transition duration-100 ease-in'}
                        key={index}
                    >
                        {index === current &&

                            <div className='w-full relative'>
                                {getSlideElement(slide)}
                                {isEdit ?
                                    <VscClose
                                        onClick={() => deleteFile(current)}
                                        size={24}
                                        className="hover:text-red-500 absolute top-3 right-3 cursor-pointer text-gray-500"
                                    />
                                    : null}
                            </div>

                        }


                    </div>
                );
            })}

            {/* NACH RECHTS BUTTON */}
            {slides.length > 1 &&

                <button
                    className='h-full opacity-30 hover:opacity-100 w-1/6 flex justify-center items-center '
                    onClick={nextSlide}>

                    <GrNext
                        size={50}
                    />

                </button>

            }
        </section>
    );
};

export default ImageSliderAdmin;