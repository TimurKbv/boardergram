import * as Styles from "../../services/styles.js";
import { useEffect, useState } from "react";



function FindUsersForm({setSearch, search, setCategory, category}) {

    const [isActive, setIsActive] = useState({
        user: '',
        news: '',
        blogs: ''
    });

    useEffect(() => {
        for (const key in isActive) {
            if (category === key ) {
                setIsActive(prev => ({
                    ...prev,
                    [key]: Styles.activeNav
                }));
            } else {
                setIsActive(prev => ({
                    ...prev,
                    [key]: ''
                }));
            }
        }
    }, [category]);



    function searchCategoryHandler(category) {
        setSearch('');
        setCategory(category);
    }
    

    return (
        <div className="w-full flex flex-col items-center justify-center gap-8 mt-28">
                {/* Search category Buttons */}
            <div className="text-gray-400 flex gap-10 ">
                <button onClick={() => searchCategoryHandler('user')} className={`${isActive.user}`}>Users</button>
                <button onClick={() => searchCategoryHandler('news')} className={`${isActive.news}`}>News</button>
                <button onClick={() => searchCategoryHandler('blogs')} className={`${isActive.blogs}`}>Blogs</button>
            </div>
            {/* Form mit input */}
            <form className="w-full flex justify-center mt-10">

                <fieldset className="flex justify-center items-center border-b-2 border-cyan-800" >
                <input 
                    className={`${Styles.input2} w-2/5 text-center bg-transparent`}
                    type="text" 
                    id="find-user" 
                    placeholder={category === "user" ? 'username' : 'title'} 
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                />
                </fieldset>

            </form>
        </div>
    )
}


export default FindUsersForm;