"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportModel = __importStar(require("../model/report.model.js"));
// erstellt neuen Report
async function createReport(req, res) {
    let reportedBy = req.tokenPayload._id;
    // extrahiert fields aus dem body (destructuring)
    let { reasonText, doc, docModel } = req.body;
    try {
        // übergibt fields, erstellt neuen Report und gibt ihn zurück
        let newReport = await ReportModel.addReport(reportedBy, reasonText, doc, docModel);
        res.send({
            success: true,
            data: newReport
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.createReport = createReport;
;
// holt alle Reports
async function getReports(req, res) {
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
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getReports = getReports;
// Delete Report
async function deleteReportById(req, res) {
    let reportId = req.params.id;
    let userId = req.tokenPayload._id;
    try {
        let deletedReport = await ReportModel.deleteReport(reportId, userId);
        console.log(deletedReport);
        res.send({
            success: true,
            data: deletedReport
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send(error.message);
    }
}
exports.deleteReportById = deleteReportById;
;
// Holt Anzahl der Reports eines Users
async function getReportAmountOfUser(req, res) {
    // hole ID
    let authorId = req.params.id;
    try {
        // deleted post speichern und zum frontend senden
        let userReports = await ReportModel.getUserReports(authorId);
        const reportAmount = userReports.length;
        res.send({
            success: true,
            reportAmount: reportAmount
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}
exports.getReportAmountOfUser = getReportAmountOfUser;
;
// Holt Anzahl der Reports eines Users
async function closeReport(req, res) {
    // hole ID
    const reportId = req.params.id;
    try {
        // deleted post speichern und zum frontend senden
        const report = await ReportModel.closeReportById(reportId);
        res.send({
            success: true,
            data: report
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}
exports.closeReport = closeReport;
;
//# sourceMappingURL=report.controller.js.map