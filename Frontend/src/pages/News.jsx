import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Post from "../components/post/Post";
import { useInView } from 'react-intersection-observer';


function News() {
  // State
  const [articles, setArticles] = useState([]);
  // LAZY LOADING....
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 1,
  });

// wenn trigger-div inView === true dann fetche neue posts
  useEffect(() => {

    if (inView) fetchNews();

  }, [inView]);

  // Fetch function
  async function fetchNews() {
    try {
      let resp = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/articles/` + articles?.length);
      // speichere articles in state


      if (articles.length > 0) {
        setArticles([...articles, ...resp.data.data]);
      } else {
        setArticles(resp.data.data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
      /* Render News */
      <div className="flex flex-col justify-center items-center w-full h-fit gap-14">

        {articles?.map((article, i) => {
          return <Post key={article._id} post={article} />
        })}

        {/* TRIGGER DIV */}
        <div ref={ref} className="w-full h-10 text-3xl text-white font-bold text-center ">The end</div>
  
      </div>
  );
};


export default News;