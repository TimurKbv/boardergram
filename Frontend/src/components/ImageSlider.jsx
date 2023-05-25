import React, { useEffect, useState, useRef, TouchEvent } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import BaseVideoPlayer from '../services/BaseVideoPlayer';
import YouTubeVideoPlayer from '../services/YouTubeVideoPlayer';
// import useSwipe from '../hooks/useSwipe';


function ImageSlider({ slides, setCurrSlide }) {
    const [current, setCurrent] = useState(0);

    // Swipe
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50 
    
    const onTouchStart = (e) => {
        console.log('start');
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }
    
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
    
    const onTouchEnd = () => {
        console.log('end');
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        //   if (isLeftSwipe || isRightSwipe) console.log('swipe', isLeftSwipe ? 'left' : 'right')
        if (!isLeftSwipe) {
            prevSlide();
        } else {
            nextSlide();
        }
        // if (isRightSwipe) {
        //     nextSlide();
        // }
      
    }


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
                <img src={url} alt='travel image' className='w-full h-full object-contain' />
            )
        }
    }


    return (

        <section className='container w-full flex items-center h-[50vh] sm:h[50] md:h-[60vh]'>

            {/* NAVH LINKS BUTTON */}


                <button
                    className={`h-full opacity-40 hover:opacity-100  w-1/6 flex justify-center items-center`}
                    onClick={prevSlide}
                >
                    {<GrPrevious

                        size={50}
                    />}
                </button>


            {/* CONTENT */}
            {slides.map((slide, index) => {
                return (
                    <div
                        onTouchStart={onTouchStart} 
                        onTouchMove={onTouchMove} 
                        onTouchEnd={onTouchEnd}   

                        className={index === current ? 'cursor-pointer flex items-center justify-center  transition duration-100 w-full h-full' : 'transition duration-100 ease-in'}
                        key={index}
                    >
                        {index === current &&
                            (getSlideElement(slide))
                        }
                    </div>
                );
            })}

            {/* NACH RECHTS BUTTON */}


                <button
                    className='h-full opacity-30 hover:opacity-100 w-1/6 flex justify-center items-center '
                    onClick={nextSlide}>

                    <GrNext
                        size={50}
                    />

                </button>


        </section>
    );
};

export default ImageSlider;
