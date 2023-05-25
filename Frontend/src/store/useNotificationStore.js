import { create } from "zustand";
import axios from "axios";


const useNotificationStore = create( set => ({

    type: null,

    message: '',

    showNotification: false,
    setShowNotification: (prop) => {
        set({ showNotification: prop })
    },

    notificationHandler: (type, message) => {
        set({ type: type }); 
        set({ message: message }); 
        set({ showNotification: true }); 
    },
  
}));
  
export default useNotificationStore;