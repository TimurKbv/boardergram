import { create } from "zustand";


const useReportStore = create(set => ({
    showReport: false,
    reportType: null,
    reportId: null,
    sendReport: (type, id) => {
        set({showReport: true, reportType: type, reportId: id})
    },
    closeReport: () => {
        set({showReport: false, reportType: null, reportId: null})
    }
}));



export default useReportStore;