"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// export async function updateCollection(req, res) {
//     const model = req.query.model;
//     const key = req.query.key;
//     const value = req.query.value;
//     try {
//         const currModel = mongoose.model(model);
//         const updatedCollection = await currModel.updateMany({}, { $set: { [key]: [value] } }, { multi: true });
//         await updatedCollection.save();
//         res.send({
//             success: true,
//             data: updatedCollection
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(error.code).send(error.message);
//     }
// }
async function updateCollection(req, res) {
    const model = req.query.model;
    const key = req.query.key;
    const value = req.query.value;
    try {
        const currModel = mongoose_1.default.model(model);
        const updatedCollection = await currModel.updateMany({}, { $setOnInsert: { [key]: value } }, { upsert: true });
        res.send({
            success: true,
            data: updatedCollection
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
exports.updateCollection = updateCollection;
//# sourceMappingURL=update.collection.js.map