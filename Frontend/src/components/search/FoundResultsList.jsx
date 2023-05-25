import FoundPostLi from "./FoundPostLi";
import FoundUserLi from "./FoundUserLi";


function FoundResultsList({results, category}) {


    return (
        <ul className=" flex w-full xl:w-3/4 flex-col gap-3 items-center ">
            {               /* prüfe ob category user oder post  */
            results.map(result => {
                    return category === 'user'? <FoundUserLi key={result._id} user={result} /> : <FoundPostLi key={result._id} post={result} />;
                })
            }
        </ul>
    )
}


export default FoundResultsList;