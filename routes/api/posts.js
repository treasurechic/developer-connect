const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth')
const Usermodel = require('../../models/Users')
const Profilemodel = require('../../models/profile')
const Postmodel = require('../../models/Post')

//@route    POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
 async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty){
         return res.status(400).json({errors: errors.array()})
     }
    try{
        const user = await Usermodel.findById(req.user.id).select('-password');
        const newPost = new Postmodel( {
            text: req.body.text,
            name:user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save()

        res.json(post)

    }catch(err){
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
}

)

//@route    GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', [auth], 
async (req,res) =>{
    try{
        const posts = await Postmodel.find().sort({ date: -1});
        res.json(posts)
    }catch(err){
        console.error(err)
        res.status(500).jspn({msg: 'server error'})
    }
})

//@route    GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', [auth], 
async (req,res) =>{
    try{
        const post = await Postmodel.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'post not found'})
        }
        res.json(post)
    }catch(err){
        console.error(err)
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).json({msg: 'server error'})
    }
})

//@route    DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', [auth], 
async (req,res) =>{
    try{
        const post = await Postmodel.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'post not found'})
        }

        // check user
        if(post.user.toString() !== req.user.id){
            return res.status(404).json({msg: 'User not authorized'})
        }
        await post.remove();
        res.json({msg:'post removed'})
    }catch(err){
        console.error(err)
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'post not found'})
        }
        res.status(500).json({msg: 'server error'})
    }
})

//@route    DELETE api/posts/like/:id
// @desc    like a post
// @access  Private
router.put('/like/:id', auth,
async (req, res) =>{
    try{
        const post = await Postmodel.findById(req.params.id) 

        //check if post has been liked already by a user
        if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'});
        }
        post.likes.unshift({user: req.user.id});
        await post.save();

        res.json(post.likes);

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
})

//@route    DELETE api/posts/unlike/:id
// @desc    unlike a post
// @access  Private
router.put('/unlike/:id', auth,
async (req, res) =>{
    try{
        const post = await Postmodel.findById(req.params.id) 

        //check if post has been liked already by a user
        if(post.likes.filter(like => like.user.toString() == req.user.id).length === 0){
            return res.status(400).json({msg: 'Post has not yet been liked'});
        }
        //get remove index
        const removeIndex = post.likes.map(like =>{
            like.user.toString().indexOf(req.user.id)
        })
        post.likes.splice(removeIndex, 1)
        await post.save();

        res.json(post.likes);

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }
})

//@route    POST api/posts/comments/:id
// @desc    comment on a post
// @access  Private
router.post('/comments/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
 async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty){
         return res.status(400).json({errors: errors.array()})
     }
    try{
        const user = await Usermodel.findById(req.user.id).select('-password');
        const post = await Postmodel.findById(req.params.id)

        const newComment =  {
            text: req.body.text,
            name:user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment)

        await post.save()

        res.json(post.comments)

    }catch(err){
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
}

)

//@route    DELETE api/posts/comments/:id/:comment_id
// @desc    delete comment
// @access  Private

router.delete('/comments/:id/:comment_id', auth,
async (req,res) => {
    try {
        const post = await Postmodel.findById(req.params.id)

        //pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //make sure the comment exist
        if(!comment){
            return res.status(404).json({msg: 'Comment does not exist'})
        }

        // check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'})
        }
        //Get remove index
        const removeIndex = post.comments.map(comment =>{ comment.user.toString() }).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})

module.exports = router;