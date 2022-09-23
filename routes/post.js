const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

router.post("/", async(req, res) => {
    const newpost = await new Post(req.body)
    try {
        const savedpost = await newpost.save()
        return res.status(200).json(savedpost)
    }catch(err) {
        return res.status(403).json(err)
    }
})

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            return res.status(200).json("post is updated")
        }else {
        res.status(403).json("you can update only your post !!")
        }
    }catch(err) {
        return res.status(500).send(err)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("post is deleted")
        }else {
        res.status(403).json("you can delete only your post !!")
        }
    }catch(err) {
        return res.status(500).send(err)
    }
})

router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes:req.body.userId}})
            return res.status(200).json("post has been liked")
        }else {
            await Post.updateOne({$pull: {likes:req.body.userId}})
            return res.status(200).json("post has been disliked")
        }
    }catch(err) {
        return res.status(500).json(err)
    }
})

router.get("/:id", async(req, res) => {
    try {
        const curpost = await Post.findById(req.params.id)
        res.status(200).json(curpost)
    }catch(err) {
        return res.status(500).json(err)
    }
})

router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId : friendId});
            })
        );
        res.json(userPost.concat(...friendPosts))
    }catch(err) {
        return res.status(500).json(err)
    }
})

module.exports = router