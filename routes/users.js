const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User")
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("Acount has been updated !!")            
        }catch(err) {
            return res.status(403).json(err)
        }
    }else {
        return res.status(403).json("you can update only your account")
    }
})
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id ) {
        try {
            await User.findByIdAndDelete({_id : req.params.id})
            return res.status(200).json("Acount has been deleted !!")            
        }catch(err) {
            return res.status(403).json(err)
        }
    }else {
        return res.status(403).json("you can delete only your account")
    }
})

router.get("/", async(req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(ruserId) : await User.findOne({username : username});
        const {password, updatedAt, ...other} = user._doc
        return res.status(200).json(other)
    }catch(err) {
        return res.status(403).json(err)
    }
})

router.put("/:id/follow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentuser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("user has been followed")
            }else {
                res.status(403).json("you are already following this user !!")
            }
        }catch(err) {
            return res.status(500).json(err);
        }
    }else {
        res.status(403).json("you cant follow yourself !!")
    }
})

router.put("/:id/unfollow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentuser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("user has been unfollowed")
            }else {
                res.status(403).json("you are already unfollowing this user !!")
            }
        }catch(err) {
            return res.status(500).json(err);
        }
    }else {
        res.status(403).json("you cant unfollow yourself !!")
    }
})
module.exports = router;