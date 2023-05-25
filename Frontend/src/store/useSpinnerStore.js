import { create } from "zustand";
import axios from "axios";


const useSpinnerStore = create( set => ({

    type: null,

    message: '',

    showSpinner: false,
    setShowSpinner: (prop) => {
        set({ showSpinner: prop })
    },

    spinnerHandler: (message) => { 
        set({ message: message }); 
        set({ showSpinner: true }); 
    },
  
}));
  
export default useSpinnerStore;