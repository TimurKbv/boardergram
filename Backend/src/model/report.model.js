import mongoose from "mongoose";
import User from "./user.model.js";
import Comment from "./comment.model.js";
import Post from "./post.model.js";
import { userSchema } from "./user.model.js";
import { commentsSchema } from "./comment.model.js";
import { postSchema } from "./post.model.js";



// Report-Schema
const reportSchema = new mongoose.Schema({
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reasonText: { type: String, required: true },
    doc: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'docModel' },
    docModel: { type: String, required: true, enum: ['User', 'Post', 'Comment'] },
    closed: { type: Boolean, required: true, default: false }
}, { timestamps: true });


// erstellt Report-Model
const Report = mongoose.model("Report", reportSchema);


// erstellt neuen Report
export async function addReport(reportedBy, reasonText, doc, docModel) {


    let report = new Report({
        reportedBy, reasonText, doc, docModel
    })

    // speichert neuen Report und gibt ihn zurück
    return await report.save()
};


// holt alle Reports (für Admin)
export async function getReports(searchString, state, sortVal, sortDir) {

    const regex = new RegExp(searchString, 'i')

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
            populate: { path: 'author', select: '-password', strictPopulate: false }})

    const filteredReports = reports.filter(report => report.reportedBy.username.includes(searchString.toLowerCase()) && report.closed === isTrue);

    const sortedReports = filteredReports.sort((a, b) => {

        if (sortVal === "username") {

            if (sortDir === "1") {
                const valueA = a.reportedBy[sortVal].toLowerCase();
                const valueB = b.reportedBy[sortVal].toLowerCase();

                if (valueA < valueB) {
                    return -1;
                } else if (valueA > valueB) {
                    return 1;
                } else {
                    return 0;
                }

            } else {
                const valueA = a.reportedBy[sortVal].toLowerCase();
                const valueB = b.reportedBy[sortVal].toLowerCase();

                if (valueA > valueB) {
                    return -1;
                } else if (valueA < valueB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        } else {

            if (sortDir === "1") {
                const valueA = a[sortVal];
                const valueB = b[sortVal];

                if (valueA < valueB) {
                    return -1;
                } else if (valueA > valueB) {
                    return 1;
                } else {
                    return 0;
                }

            } else {
                const valueA = a[sortVal];
                const valueB = b[sortVal];

                if (valueA > valueB) {
                    return -1;
                } else if (valueA < valueB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    })

    return sortedReports

};


// Delete Report
export async function deleteReport(reportId, userId) {

    let user = await User.findById(userId);

    if (user.role !== "admin") {
        throw {
            code: 403,
            message: `user with id: ${userId} is not allowed`
        }
    }

    let report = await Report.findByIdAndDelete(reportId);

    if (!report) {
        throw {
            code: 404,
            message: `Report with id: ${reportId} not found`
        }
    }
    return report;
};


export async function getUserReports(authorId) {

    return await Report.find({ reportedBy: authorId })
};


export async function closeReportById(reportId) {

    const report = Report.findById(reportId);

    if (!report) {
        throw {
            code: 404,
            message: `Report with id: ${reportId} not found`
        }
    }

    return await Report.updateOne({ _id: reportId }, { $set: { closed: true } })
};


export default Report