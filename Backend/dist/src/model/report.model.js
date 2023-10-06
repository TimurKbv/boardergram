"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_js_1 = __importDefault(require("./user.model.js"));
// Report-Schema
const reportSchema = new mongoose_1.default.Schema({
    reportedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    reasonText: { type: String, required: true },
    doc: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, refPath: 'docModel' },
    docModel: { type: String, required: true, enum: ['User', 'Post', 'Comment'] },
    closed: { type: Boolean, required: true, default: false }
}, { timestamps: true });
// erstellt Report-Model
const Report = mongoose_1.default.model("Report", reportSchema);
// erstellt neuen Report
async function addReport(reportedBy, reasonText, doc, docModel) {
    let report = new Report({
        reportedBy, reasonText, doc, docModel
    });
    // speichert neuen Report und gibt ihn zurück
    return await report.save();
}
exports.addReport = addReport;
;
// holt alle Reports (für Admin)
async function getReports(searchString, state, sortVal, sortDir) {
    const regex = new RegExp(searchString, 'i');
    // Mache aus dem String einen Boolean
    const isTrue = (state === 'true');
    // return await Report.find()
    //   .populate('reportedBy', ['_id', 'username', 'image'])
    //   .populate({ path: 'doc', select: '-password' })
    //   .populate({ path: 'doc.author', select: '-password' })
    //   .sort({ [sortVal]: sortDir })
    //   .collation({ locale: 'en', strength: 2 });
    let reports = await Report.find()
        .populate('reportedBy', ['_id', 'username', 'image'])
        .populate({ path: 'doc', select: '-password',
        populate: { path: 'author', select: '-password', strictPopulate: false } });
    const filteredReports = reports.filter(report => report.reportedBy.username.includes(searchString.toLowerCase()) && report.closed === isTrue);
    const sortedReports = filteredReports.sort((a, b) => {
        if (sortVal === "username") {
            if (sortDir === "1") {
                const valueA = a.reportedBy[sortVal].toLowerCase();
                const valueB = b.reportedBy[sortVal].toLowerCase();
                if (valueA < valueB) {
                    return -1;
                }
                else if (valueA > valueB) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                const valueA = a.reportedBy[sortVal].toLowerCase();
                const valueB = b.reportedBy[sortVal].toLowerCase();
                if (valueA > valueB) {
                    return -1;
                }
                else if (valueA < valueB) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
        else {
            if (sortDir === "1") {
                const valueA = a[sortVal];
                const valueB = b[sortVal];
                if (valueA < valueB) {
                    return -1;
                }
                else if (valueA > valueB) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else {
                const valueA = a[sortVal];
                const valueB = b[sortVal];
                if (valueA > valueB) {
                    return -1;
                }
                else if (valueA < valueB) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
    });
    return sortedReports;
}
exports.getReports = getReports;
;
// Delete Report
async function deleteReport(reportId, userId) {
    let user = await user_model_js_1.default.findById(userId);
    if (user.role !== "admin") {
        throw {
            code: 403,
            message: `user with id: ${userId} is not allowed`
        };
    }
    let report = await Report.findByIdAndDelete(reportId);
    if (!report) {
        throw {
            code: 404,
            message: `Report with id: ${reportId} not found`
        };
    }
    return report;
}
exports.deleteReport = deleteReport;
;
async function getUserReports(authorId) {
    return await Report.find({ reportedBy: authorId });
}
exports.getUserReports = getUserReports;
;
async function closeReportById(reportId) {
    const report = Report.findById(reportId);
    if (!report) {
        throw {
            code: 404,
            message: `Report with id: ${reportId} not found`
        };
    }
    return await Report.updateOne({ _id: reportId }, { $set: { closed: true } });
}
exports.closeReportById = closeReportById;
;
exports.default = Report;
//# sourceMappingURL=report.model.js.map