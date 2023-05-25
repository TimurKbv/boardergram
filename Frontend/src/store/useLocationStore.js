import { create } from "zustand";



const useLocationStore = create(set => ({
    prevLocationId: null,
    locationPage: null,
    setPrevlocation: (locationpage, locationId) => set({prevLocation: locationId, locationPage: locationpage})
}));

export default useLocationStore;