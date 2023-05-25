import * as PostModel from "../model/post.model.js";
import { uploadFile } from "../service/cloudinary.service.js";


// fetcht alle Posts (zu Entwicklungszwecken)
export async function getAllPosts(req, res) {

    try {
        let posts = await PostModel.getAllPosts();

        res.send({
            success: true,
            data: posts
        })

    } catch (error) {
        console.log(error);
    }
};


export async function getSortedPosts(req, res) {

    const searchString = req.query.search;
    const state = req.query.state;
    const sortVal = req.query.sort;
    const sortDir = req.query.dir;

    try {
        let posts = await PostModel.getAllSortedPosts(searchString, state, sortVal, sortDir);

        res.send({
            success: true,
            posts: posts
        })

    } catch (error) {
        console.log(error);
    }
};


// fetcht einen Posts by ID
export async function getPostById(req, res) {

    const postId = req.params.id

    try {
        let post = await PostModel.getPost(postId);

        res.send({
            success: true,
            data: post
        })

    } catch (error) {
        console.log(error);
    }
};


// erstellt neuen Post
export async function addNewPost(req, res) {

    let userId = req.tokenPayload._id;
    let role = req.tokenPayload.role;
    let body = req.body

    try {

        if (body.category === 'article' && role === 'user') {
            throw {
                code: 403,
                message: `You can not create an article`
            }
        }

        const cloudinaryUrls = await Promise.all(body.files.map(async (file) => {

            const dateString = new Date()[Symbol.toPrimitive]('number').toString();
            const fileName = `${file.fileName.substring(0, file.fileName.lastIndexOf('.'))}_${dateString}`;

            return await uploadFile(file.baseStr, fileName, userId);
        }));

        const newPost = {
            author: userId,
            category: body.category,
            title: body.title,
            text: body.text,
            images: [...body.urls, ...cloudinaryUrls]
        }

        let post = await PostModel.createPost(newPost)

        res.send({
            success: true,
            data: post
        })

    } catch (error) {
        console.log(error);
    }
};



// holt alle sichtbaren Articles
export async function getAllArticles(req, res) {

    let skip = req.params.skip;
    try {
        // holt alle sichtbaren Articles und gibt sie zurück
        let articles = await PostModel.getArticles(skip);

        // sende ergebniss zur Frontend
        res.send({
            success: true,
            data: articles
        })

    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
};


// holt alle Blogs (ohne Articles!!)
export async function getPostsWOArticles(req, res) {

    // hole Filter (Story, Review, Market) von queries
    // let category = req.query.category;
    let skip = req.query.skip;

    try {
        // hole posts ohne articles
        let posts = await PostModel.excludeArticles( skip);

        res.send({
            success: true,
            data: posts
        })

    } catch (error) {
        console.log(error);
    }
};




// holt alle sichtbaren Posts aus den User-Favorites
export async function getUserFavorites(req, res) {

    // hole userId vom tokenPayload
    let userId = req.tokenPayload._id;
    let skip = req.params.skip;

    try {
        // holt alle sichtbaren Posts
        let favs = await PostModel.getFavorites(userId, skip);

        res.send({
            success: true,
            data: favs
        })

    } catch (error) {
        console.log(error);
    }
};


// Delete Post
export async function deletePostById(req, res) {

    // hole ID's
    let userId = req.tokenPayload._id;
    let postId = req.params.id;
    try {

        // deleted post speichern und zum frontend senden
        let deletedPost = await PostModel.deletePost(userId, postId);

        res.send({
            success: true,
            data: deletedPost
        })
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
};


// Holt Anzahl der Posts eines Users
export async function getPostAmountOfUser(req, res) {

    // hole ID
    let authorId = req.params.id;

    try {
        // deleted post speichern und zum frontend senden
        let userPosts = await PostModel.getUserPosts(authorId);
        const postAmount = userPosts.length

        res.send({
            success: true,
            postAmount: postAmount
        })
    } catch (error) {
        console.log(error);
        res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
};


export async function getSearchNewsByTitle(req, res) {
    let title = req.params.title;

    try {
        let posts = await PostModel.getNewsByTitle(title);

        res.send({
            success: true,
            posts: posts
        })
    } catch (error) {
        console.log(error);
    }
}

export async function getSearchBlogsByTitle(req, res) {
    let title = req.params.title;

    try {
        let posts = await PostModel.getBlogsByTitle(title);

        res.send({
            success: true,
            posts: posts
        })
    } catch (error) {
        console.log(error);
    }
}


export async function hidePost(req, res) {

    const postId = req.params.id;
    const visible = req.body.visible;

    try {
        let post = await PostModel.hidePostById(postId, visible);

        console.log(post.visible);

        res.send({
            success: true,
            data: post
        })
    } catch (error) {
        console.log(error); res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
}


export async function updatePost(req, res) {

    const userId = req.tokenPayload._id;
    const postId = req.params.id
    const body = req.body;

    try {
        let post = await PostModel.updatePostById(userId, postId, body);

        res.send({
            success: true,
            data: post
        })
    } catch (error) {
        console.log(error); res.status(error.code).send({
            success: false,
            message: error.message
        })
    }
}