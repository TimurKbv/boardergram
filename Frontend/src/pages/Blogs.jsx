import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import axios from "axios";
import Post from "../components/post/Post";
import { useInView } from 'react-intersection-observer';


function Blogs() {
    const token = useAuthStore(state => state.getToken());
    // speicherState für alle Posts
    const [blogs, setBlogs] = useState([]);
    // speicherState für filtered
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [filter, setFilter] = useState('');
    // LAZY LOADING....
    const { ref, inView } = useInView({
        /* Optional options */
        threshold: 1,
    });

    // wenn trigger-div inView === true dann fetche neue posts
    useEffect(() => {
        if (inView) fetchBlogs(blogs.length);
    }, [inView]);

    // wenn filter, dann erstelle neue array mit filteredBlogs
    useEffect(() => {
        if (filter) {
            let fBlogs = blogs.filter(blog => {
                return blog.category === filter
            });
            setFilteredBlogs(fBlogs);
        }

    }, [filter, blogs]);

    /* Array mit Objekten der Filtermöglichkeiten */
    let optionValues = [
        { label: 'All', value: '' },
        { label: 'Stories', value: 'story' },
        { label: 'Reviews', value: 'review' },
        { label: 'Market', value: 'market' }
    ];


    // Fetche blogs
    async function fetchBlogs(skip) {
        try {
            let response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/protected/blogs?` + 'skip=' + skip, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }  
            });

            setBlogs([...blogs, ...response.data.data]);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=" flex flex-col justify-center items-center w-full h-fit gap-14">

            <div className="self-end">

                <select onChange={e => setFilter(e.target.value)} className="p-1 rounded-md text-white bg-black hover:text-indigo-200 mt-6">

                    {optionValues.map((filter) => (
                        <option key={filter.value}  value={filter.value} className="rounded-md p-2">{filter.label}</option>
                    ))}
                </select>

            </div>
                        {/* Wenn kein post, dann h3 mit text */}
            {blogs.length > 0 
                ? 
                /* Wenn kein filter, dann zeige mir blogs */
                filter.length < 1 ? 
                blogs.map(blog => {
                    return <Post post={blog} key={blog._id} />
                })
                 : 
                 /* ansonsten filteredBlogs */
                 filteredBlogs.map(blog => {
                    return <Post post={blog} key={blog._id} />
                })
                :
                <h3 className="text-white">There aren't any {filter} posts</h3>
            }

            {/* TRIGGER DIV */}
            <div ref={ref} className="w-full h-10 text-3xl text-white font-bold text-center ">The end</div>
            
        </div>
    )
}


export default Blogs;