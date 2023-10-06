"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostModel = __importStar(require("../model/post.model.js"));
const cloudinary_service_js_1 = require("../service/cloudinary.service.js");
// fetcht alle Posts (zu Entwicklungszwecken)
async function getAllPosts(req, res) {
    try {
        let posts = await PostModel.getAllPosts();
        res.send({
            success: true,
            data: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getAllPosts = getAllPosts;
;
async function getSortedPosts(req, res) {
    const searchString = req.query.search;
    const state = req.query.state;
    const sortVal = req.query.sort;
    const sortDir = req.query.dir;
    try {
        let posts = await PostModel.getAllSortedPosts(searchString, state, sortVal, sortDir);
        res.send({
            success: true,
            posts: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getSortedPosts = getSortedPosts;
;
// fetcht einen Posts by ID
async function getPostById(req, res) {
    const postId = req.params.id;
    try {
        let post = await PostModel.getPost(postId);
        res.send({
            success: true,
            data: post
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getPostById = getPostById;
;
// erstellt neuen Post
async function addNewPost(req, res) {
    let userId = req.tokenPayload._id;
    let role = req.tokenPayload.role;
    let body = req.body;
    try {
        if (body.category === 'article' && role === 'user') {
            throw {
                code: 403,
                message: `You can not create an article`
            };
        }
        const cloudinaryUrls = await Promise.all(body.files.map(async (file) => {
            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const fileName = `${file.fileName.substring(0, file.fileName.lastIndexOf('.'))}_${dateString}`;
            return await cloudinary_service_js_1.uploadFile(file.baseStr, fileName, userId);
        }));
        const newPost = {
            author: userId,
            category: body.category,
            title: body.title,
            text: body.text,
            images: [...body.urls, ...cloudinaryUrls]
        };
        let post = await PostModel.createPost(newPost);
        res.send({
            success: true,
            data: post
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.addNewPost = addNewPost;
;
// holt alle sichtbaren Articles
async function getAllArticles(req, res) {
    let skip = req.params.skip;
    try {
        // holt alle sichtbaren Articles und gibt sie zurück
        let articles = await PostModel.getArticles(skip);
        // sende ergebniss zur Frontend
        res.send({
            success: true,
            data: articles
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
exports.getAllArticles = getAllArticles;
;
// holt alle Blogs (ohne Articles!!)
async function getPostsWOArticles(req, res) {
    // hole Filter (Story, Review, Market) von queries
    // let category = req.query.category;
    let skip = req.query.skip;
    try {
        // hole posts ohne articles
        let posts = await PostModel.excludeArticles(skip);
        res.send({
            success: true,
            data: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getPostsWOArticles = getPostsWOArticles;
;
// holt alle sichtbaren Posts aus den User-Favorites
async function getUserFavorites(req, res) {
    // hole userId vom tokenPayload
    let userId = req.tokenPayload._id;
    let skip = req.params.skip;
    try {
        // holt alle sichtbaren Posts
        let favs = await PostModel.getFavorites(userId, skip);
        res.send({
            success: true,
            data: favs
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getUserFavorites = getUserFavorites;
;
// Delete Post
async function deletePostById(req, res) {
    // hole ID's
    let userId = req.tokenPayload._id;
    let postId = req.params.id;
    try {
        // deleted post speichern und zum frontend senden
        let deletedPost = await PostModel.deletePost(userId, postId);
        res.send({
            success: true,
            data: deletedPost
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
exports.deletePostById = deletePostById;
;
// Holt Anzahl der Posts eines Users
async function getPostAmountOfUser(req, res) {
    // hole ID
    let authorId = req.params.id;
    try {
        // deleted post speichern und zum frontend senden
        let userPosts = await PostModel.getUserPosts(authorId);
        const postAmount = userPosts.length;
        res.send({
            success: true,
            postAmount: postAmount
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
exports.getPostAmountOfUser = getPostAmountOfUser;
;
async function getSearchNewsByTitle(req, res) {
    let title = req.params.title;
    try {
        let posts = await PostModel.getNewsByTitle(title);
        res.send({
            success: true,
            posts: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getSearchNewsByTitle = getSearchNewsByTitle;
async function getSearchBlogsByTitle(req, res) {
    let title = req.params.title;
    try {
        let posts = await PostModel.getBlogsByTitle(title);
        res.send({
            success: true,
            posts: posts
        });
    }
    catch (error) {
        console.log(error);
    }
}
exports.getSearchBlogsByTitle = getSearchBlogsByTitle;
async function hidePost(req, res) {
    const postId = req.params.id;
    const visible = req.body.visible;
    try {
        let post = await PostModel.hidePostById(postId, visible);
        console.log(post.visible);
        res.send({
            success: true,
            data: post
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
exports.hidePost = hidePost;
async function updatePost(req, res) {
    const userId = req.tokenPayload._id;
    const postId = req.params.id;
    const body = req.body;
    try {
        let post = await PostModel.updatePostById(userId, postId, body);
        res.send({
            success: true,
            data: post
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
exports.updatePost = updatePost;
//# sourceMappingURL=post.controller.js.map