import React, {useRef, useState, useEffect} from 'react';
import YouTube from 'react-youtube';

function YouTubeVideoPlayer({ url }) {

    const containerRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    function extractVideoId(link) {
        let videoId = '';

        // Überprüfen, ob der Link das Format 'https://www.youtube.com/watch?v=...' hat
        if (link.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(link.split('?')[1]);
            videoId = urlParams.get('v');
        }

        // Überprüfen, ob der Link das Format 'https://youtu.be/...' hat
        if (link.includes('youtu.be/')) {
            videoId = link.split('/').pop();
        }

        return videoId;
    };


    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerWidth * 9 / 16; // Verhältnis 16:9
        setWidth(containerWidth);
        setHeight(containerHeight)
      }, []);


    const playerWidth = window.screen.width / 2.2;
    const playerHeight = playerWidth / 16 * 9;

    const videoId = extractVideoId(url);


    const options = {
        width: playerWidth,
        height: playerHeight,
        playerVars: {
            autoplay: 0,
        },
    };

    const videoUrl = `https://www.youtube.com/embed/${videoId}`;

    return (

        <div className='w-full h-full' ref={containerRef}>
            <iframe
                className='w-full h-full'
                src={videoUrl}
                title="YouTube Video"
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>

        // <YouTube className='w-full' videoId={videoId} opts={options} />

    );
}

export default YouTubeVideoPlayer;
