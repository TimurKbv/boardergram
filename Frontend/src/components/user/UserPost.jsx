import { Link } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore";
import { useEffect, useState } from "react";
import YouTubeVideoPlayer from "../../services/YouTubeVideoPlayer";




function UserPost({ post }) {
    const setSearchPost = useSearchStore(state => state.setSearchPost);
    const [picture, setPicture] = useState(null);


    useEffect(() => {
        getPicture();

    }, []);

    function getPicture() {

        let image
        if (post.images.length === 0) {
            image = "https://res.cloudinary.com/djiwww2us/image/upload/v1684150635/Asset-Images/no-image-icon-6_yyldcv.png"
        } else {
            image = post.images[0]
        };


        if (image.substring(image.length - 4) === '.jpg' || image.substring(image.length - 4) === 'jpeg' || image.substring(image.length - 4) === 'webp' || image.substring(image.length - 4) === '.png') {

            setPicture(<img className="w-full h-28 md:h-48 object-cover text-white" src={image} alt={post.title} />)

        } else if (image.substring(image.length - 4) === '.mp4') {


            setPicture(<video className="w-full"><source src={image} type={'video/mp4'} /></video>)
        } else {

            const videoId = extractVideoId(image);
            let videoPicture = `https://i1.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
            setPicture(<img className="w-full h-28 md:h-48 object-cover text-white" src={videoPicture} alt={post.title} />)
        }
    }


    // --------------------____YOUTUBE
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

    return (
        <button onClick={() => setSearchPost(post)} className="h-fit cursor-pointer">
            <Link to={`/posts/${post.title}`} >

                {picture}

            </Link>

        </button>
    )
}


export default UserPost;