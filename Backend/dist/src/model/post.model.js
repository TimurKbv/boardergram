"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_js_1 = __importDefault(require("./user.model.js"));
// Post-Schema
exports.postSchema = new mongoose_1.default.Schema({
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['article', 'story', 'review', 'market'], required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    images: [{ type: String }],
    visible: { type: Boolean, default: true },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment' }],
    type: { type: String, default: 'Post', enum: ['Post'] },
}, { timestamps: true });
// erstellt Post-Model
exports.Post = mongoose_1.default.model("Post", exports.postSchema);
// holt alle sichtbaren Posts und pouliert Comments (zu Entwicklungszwecken)
async function getAllPosts() {
    return await exports.Post.find({ visible: true }).populate({ path: "comments" });
}
exports.getAllPosts = getAllPosts;
;
async function getPost(postId) {
    return await exports.Post.findById(postId);
}
exports.getPost = getPost;
;
// erstellt neuen Post jeder Kategorie
async function createPost(newPost) {
    const { author, category, title, text, images } = newPost;
    // setzt neuen Post zusammmen
    let post = new exports.Post({
        author: author,
        category: category,
        title: title,
        text: text,
        images: images,
        comments: []
    });
    // speichert und übergibt neuen Post
    return await post.save();
}
exports.createPost = createPost;
;
// fügt Comment zu einem Post hinzu
async function addCommentToPost(postId, commentId) {
    // holt Post mittels postId
    let post = await exports.Post.findById(postId);
    // pusht neuen Comment in comment-field des Posts
    post.comments.push(commentId);
    // speichert und übergibt aktualisierten Post
    return await post.save();
}
exports.addCommentToPost = addCommentToPost;
;
// holt alle sichtbaren Articles
async function getArticles(skip) {
    // limit & skip
    return await exports.Post.find({ $and: [{ category: "article" }, { visible: true }] }).limit(5).skip(skip).sort('-createdAt').populate([
        // populate nach field 'author'
        {
            path: 'author',
            select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
        },
        // populate nach field 'comments' mit deep population von 'authors'
        {
            path: 'comments',
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
            }
        }
    ]);
}
exports.getArticles = getArticles;
;
// holt alle sichtbaren Blogs (Stories, Reviews, Markets) und populiert sichtbare Comments
// nimmt optional eine Category in den Filter auf
async function excludeArticles(skip) {
    // console.log(category);
    // optionaler Filter für Category
    // let categoryFilter = category ? {category : category} : {};
    return await exports.Post.find({ $and: [{ category: { $ne: "article" } }, /* categoryFilter, */ { visible: true }] })
        .limit(5)
        .sort('-createdAt')
        .skip(skip)
        .populate([
        {
            path: "comments",
            match: {
                visible: true
            },
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage'],
            }
        },
        {
            path: 'author',
            select: ["fullname", "username", "email", "birthday", "city", "image", "bgImage", "description", "_id", 'type']
        }
    ]);
}
exports.excludeArticles = excludeArticles;
;
// holt alle sichtbaren Favorites des Users
async function getFavorites(userId, skip) {
    // holt User mittels userId
    let user = await user_model_js_1.default.findById(userId);
    // holt Ids der User-Favorites
    let favsIds = user.favorites;
    // holt alle sichtbaren Posts mittels Ids aus User-Favorites
    return await exports.Post.find({ $and: [{ '_id': { $in: favsIds } }, { visible: true }] }).limit(5).skip(skip).sort('-createdAt').populate([
        {
            path: "comments",
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
            },
            match: {
                visible: true
            }
        },
        {
            path: "author",
            select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
        }
    ]);
}
exports.getFavorites = getFavorites;
;
// Delete Post By ID
async function deletePost(userId, postId) {
    // hole post und user
    let post = await exports.Post.findById(postId);
    let user = await user_model_js_1.default.findById(userId);
    // prüfe ob der author vom post mit userId übereinstimmt, oder userId gehört zum admin
    if (post.author.toString() !== userId && user.role !== 'admin') {
        throw {
            code: 403,
            message: `User with id: ${userId} is not allowed!`
        };
    }
    // lösche und sende zurück gelöschte post
    return await exports.Post.findByIdAndDelete(postId);
}
exports.deletePost = deletePost;
;
async function getUserPosts(authorId) {
    return await exports.Post.find({ author: authorId }).populate([
        {
            path: "comments",
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
            },
            match: {
                visible: true
            }
        },
        {
            path: "author",
            select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
        }
    ]);
}
exports.getUserPosts = getUserPosts;
// holt alle gesuchte Articles/News
async function getNewsByTitle(title) {
    let results = await exports.Post.find({ $and: [{ category: "article" }, { visible: true }, { title: { $regex: title, $options: 'i' } }] }).populate([
        // populate nach field 'author'
        {
            path: 'author',
            select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
        },
        // populate nach field 'comments' mit deep population von 'authors'
        {
            path: 'comments',
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
            }
        }
    ]);
    console.log(results);
    return results;
}
exports.getNewsByTitle = getNewsByTitle;
;
// Holt gesuchte Blogs
async function getBlogsByTitle(title) {
    return await exports.Post.find({ $and: [{ category: { $ne: "article" } }, { visible: true }, { title: { $regex: title, $options: 'i' } }] }).populate([
        {
            path: "comments",
            match: {
                visible: true
            },
            populate: {
                path: 'author',
                select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage'],
            }
        },
        {
            path: 'author',
            select: ["fullname", "username", "email", "birthday", "city", "image", "description", "_id", 'type', 'bgImage']
        }
    ]);
}
exports.getBlogsByTitle = getBlogsByTitle;
;
async function hidePostById(postId, visible) {
    // hole post 
    let post = await exports.Post.findById(postId);
    if (!post) {
        throw {
            code: 404,
            message: `Post with id: ${postId} not found`
        };
    }
    return await exports.Post.updateOne({ _id: postId }, { $set: { visible: visible } });
}
exports.hidePostById = hidePostById;
;
async function updatePostById(userId, postId, updatedPost) {
    const { title, category, text, images } = updatedPost;
    // hole post und user
    let post = await exports.Post.findById(postId);
    let user = await user_model_js_1.default.findById(userId);
    // prüfe ob der author vom post mit userId übereinstimmt, oder userId gehört zum admin
    if (post.author.toString() !== userId && user.role !== 'admin') {
        throw {
            code: 403,
            message: `User with id: ${userId} is not allowed!`
        };
    }
    const newPost = {
        author: post.author,
        category: category,
        title: title,
        text: text,
        images: images,
        comments: post.comments,
        visible: post.visible
    };
    // lösche und sende zurück gelöschte post
    return await exports.Post.findByIdAndUpdate({ _id: postId }, newPost, { new: true });
}
exports.updatePostById = updatePostById;
;
async function getAllSortedPosts(searchString, state, sortVal, sortDir) {
    const regex = new RegExp(searchString, 'i');
    const isTrue = (state === 'true');
    // Gibt alle user zurück die den Such-String enthalten (case-insensitive)
    let posts = await exports.Post.find().populate({ path: 'author', select: '-password' });
    const filteredPosts = posts.filter(post => post.author.username.includes(searchString.toLowerCase()) && post.visible === isTrue);
    const sortedPosts = filteredPosts.sort((a, b) => {
        if (sortVal === "username") {
            if (sortDir === "1") {
                const valueA = a.author[sortVal].toLowerCase();
                const valueB = b.author[sortVal].toLowerCase();
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
                const valueA = a.author[sortVal].toLowerCase();
                const valueB = b.author[sortVal].toLowerCase();
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
    return sortedPosts;
}
exports.getAllSortedPosts = getAllSortedPosts;
;
exports.default = exports.Post;
//# sourceMappingURL=post.model.js.map