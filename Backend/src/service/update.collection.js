import Report from "../model/report.model.js";
import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";



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


export async function updateCollection(req, res) {

    const model = req.query.model;
    const key = req.query.key;
    const value = req.query.value;
  
    try {
        const currModel = mongoose.model(model);
        const updatedCollection = await currModel.updateMany({}, { $setOnInsert: { [key]: value } }, { upsert: true });
        res.send({
            success: true,
            data: updatedCollection
        });
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        });
    }
}