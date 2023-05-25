import { create } from "zustand";


const useSearchStore = create((set, get) => ({
    // gesuchte user
    searchUser: null,
    setSearchUser: user => set({searchUser: user}),
    // gesuchte post
    searchPost: null,
    setSearchPost: post => set({searchPost: post})

}));


export default useSearchStore;