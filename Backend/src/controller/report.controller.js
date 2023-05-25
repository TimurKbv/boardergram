import * as ReportModel from "../model/report.model.js"




// erstellt neuen Report
export async function createReport(req, res) {

    let reportedBy = req.tokenPayload._id
    // extrahiert fields aus dem body (destructuring)
    let { reasonText, doc, docModel } = req.body;

    try {
        // übergibt fields, erstellt neuen Report und gibt ihn zurück
        let newReport = await ReportModel.addReport(reportedBy, reasonText, doc, docModel);

        res.send({
            success: true,
            data: newReport
        })

    } catch (error) {
        console.log(error);
        
    }
};


// holt alle Reports
export async function getReports(req, res) {

    const searchString = req.query.search;
    const state = req.query.state;
    const sortVal = req.query.sort;
    const sortDir = req.query.dir;

    try {
        // holt alle Reports
        let reports = await ReportModel.getReports(searchString, state, sortVal, sortDir);

        res.send({
            success: true,
            reports: reports
        })

    } catch (error) {
        console.log(error);
    }
}


// Delete Report
export async function deleteReportById(req, res) {
    
    let reportId = req.params.id;
    let userId = req.tokenPayload._id

    try {
        let deletedReport = await ReportModel.deleteReport(reportId, userId);
        console.log(deletedReport);
        res.send({
            success: true,
            data: deletedReport
        });
    } catch (error) {
        console.log(error);
        res.status(error.code).send(error.message);
    }
};


// Holt Anzahl der Reports eines Users
export async function getReportAmountOfUser(req, res) {

    // hole ID
    let authorId = req.params.id;

    try {
        // deleted post speichern und zum frontend senden
        let userReports = await ReportModel.getUserReports(authorId);
        const reportAmount = userReports.length

        res.send({
            success: true,
            reportAmount: reportAmount
        })
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
};


// Holt Anzahl der Reports eines Users
export async function closeReport(req, res) {

    // hole ID
    const reportId = req.params.id;

    try {
        // deleted post speichern und zum frontend senden
        const report = await ReportModel.closeReportById(reportId);

        res.send({
            success: true,
            data: report
        })
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
};