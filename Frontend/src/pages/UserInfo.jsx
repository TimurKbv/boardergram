import { Link } from "react-router-dom";
import useReportStore from "../store/useReportStore";
import useSearchStore from "../store/useSearchStore";
import useLocationStore from "../store/useLocationStore";
import UserPostsContainer from "../components/user/UserPostsContainer";





function UserInfo() {
    const searchUser = useSearchStore(state => state.searchUser);
    const sendReport = useReportStore(state => state.sendReport);

    console.log(searchUser);

    return (
        <>
            {searchUser &&

                <div className="container w-full mx-auto items-center flex flex-col gap-16 min-h-full justify-center text-white ">

                    <div className="flex flex-col gap-14 pb-7  bg-gray-900 w-full lg:max-w-3xl rounded-lg mx-auto text-white shadow-gray-800  shadow-lg">
                        <div>
                            <div className="relative h-40">
                                <img className="absolute h-full w-full object-cover" src={searchUser.bgImage} alt="" />

                            </div>
                            <div className="relative shadow mx-auto h-24 w-24 -my-12 border-white rounded-full overflow-hidden border-4">
                                <img className="object-cover w-full h-full" src={searchUser.image} alt="" />

                            </div>
                        </div>
                        {/* USer description */}
                        <div className=" bg-gray-900 px-5 py-10 rounded-3xl flex flex-col justify-around container gap-5 md:flex-row">
                            <div className="flex flex-col ">
                                <h5 className="font-bold text-lg  text-gray-500 text-center mb-5 uppercase">Rider info</h5>

                                <p className="text-gray-500 text-center">username</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.username}
                                </span>

                                <p className="text-gray-500 text-center">full name</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.fullname}
                                </span>

                                <p className="text-gray-500 text-center">email</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.email}
                                </span>

                                <p className="text-gray-500 text-center">from</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.city}
                                </span>

                                <p className="text-gray-500 text-center">date of birth</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.birthday}
                                </span>


                            </div>

                            <div className="flex flex-col ">
                                <h5 className="font-bold text-lg text-gray-500 text-center mb-5 uppercase">Rider Description</h5>

                                <p className="text-gray-500 text-center">Stance</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.description?.prefStance}
                                </span>

                                <p className="text-gray-500 text-center">Fav locations</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.description?.favLocations}
                                </span>

                                <p className="text-gray-500 text-center">Riding style</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.description?.style}
                                </span>

                                <p className="text-gray-500 text-center">Equipment</p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.description?.equipment}
                                </span>

                                <p className="text-gray-500 text-center">About me </p>
                                <span className="text-lg text-center font-semibold mb-4">
                                    {searchUser.description?.text}
                                </span>
                            </div>

                        </div>


                    </div>
                    <UserPostsContainer userId={searchUser._id} />
                    <button
                        className='bg-red-500 w-fit px-3 py-1 text-white rounded-md hover:bg-indigo-500 hover:text-black transition-colors duration-150'
                        onClick={() => sendReport(searchUser.type, searchUser._id)}
                    >Report User</button>
                </div>
            }
        </>

    )
}


export default UserInfo;