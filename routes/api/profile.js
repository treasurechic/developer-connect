const express = require("express");
const router = express.Router();
const request = require ('request');
const config = require('config');
const auth = require("../../middleware/auth");
const ProfileModel = require("../../models/profile");
const UserModel = require("../../models/Users");
const { check, validationResult } = require("express-validator");

//@route    GET api/profile/me
// @desc    Get curent user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user " });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

//@route    POST api/profile/
// @desc    Create or update a user profile
// @access  Private

router.post(
  "/",
  [auth, [
    check("status", "Status is required").not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]],
  async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({errors: errors.array()})
      }
      const {
          company,
          website,
          location,
          bio,
          status,
          githubusername,
          skills,
          youtube,
          facebook,
          twitter,
          instagram,
          linkedin
      } = req.body;

      //build f=profile objects
      const profileFields = {};
      profileFields.user = req.user.id
      if(company){ profileFields.company = company }
      if(website){ profileFields.website = website }
      if(location){ profileFields.location = location }
      if(bio){ profileFields.bio = bio }
      if(status){ profileFields.status = status }
      if(githubusername){ profileFields.githubusername = githubusername }
      if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim())
     }

     //build social objects
     profileFields.social = {}
     if(youtube){ profileFields.social.youtube = youtube }
     if(twitter){ profileFields.social.twitter = twitter }
     if(facebook){ profileFields.social.facebook = facebook }
     if(linkedin){ profileFields.social.linkedin = linkedin }
     if(instagram){ profileFields.social.instagram = instagram }

     try{
        let profile = await ProfileModel.findOne({user: req.user.id})
        if(profile){
            profile = await ProfileModel.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
            return res.json(profile)
        };
        // create
        profile = new ProfileModel(profileFields);

        await profile.save();
        res.json(profile)

     }catch(err){
         console.error(err.message)
         res.status(400).json('server error')
     }
  }
);

//@route    GET api/profile/
// @desc    Get all profile
// @access  Public
router.get('/', async (req, res) => {
    try{
        const profiles = await ProfileModel.find().populate('user', ['name','avatar']);
        res.json(profiles)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    } 
})

//@route    GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await ProfileModel.findOne({user: req.params.user_id}).populate('user', ['name','avatar']);
        if(!profile){
          return  res.status(400).json({msg:'Profile not found'})
        }
        res.json(profile)
            
    }catch(err){
        console.error(err.message);

        if(err.kind == 'ObjectId'){
          return  res.status(400).json({msg:'Profile not found'})
        }

        res.status(500).send('Server Error')
    }
})

//@route    DELETE api/profile/
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try{
    //@todo - come back and remove user posts

    //remove profile
      await ProfileModel.findOneAndRemove({user: req.user.id})

      await UserModel.findOneAndRemove({_id: req.user.id})

      res.json({msg: 'User deleted'})
  }catch(err){
      console.error(err.message);
      res.status(500).send('Server Error')
  } 
})

//@route    PUT api/profile/experience
// @desc    Add profile expreience
// @access  Private
router.put('/experience',[ auth,[
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]],
 async (req, res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExperience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try{
    const profile = await ProfileModel.findOne({user: req.user.id});
    profile.experience.unshift(newExperience);
    await profile.save()
    res.json(profile)
  }catch (err){
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@route    DELETE api/profile/experience/:exp_id
// @desc    Delete profile expreience
// @access  Private
router.delete('/experience/:exp_id', auth, 
async(req, res) =>{
  try{
    const profile = await ProfileModel.findOne({user: req.user.id})

    //get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); 
    profile.experience.splice(removeIndex, 1)

    await profile.save();
    res.json(profile);

  }catch(err){
    console.error(err.message)
    res.status(500).json({msg:'server error'})
  }
})

//@route    PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education',[ auth,[
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study date is required').not().isEmpty()
]],
 async (req, res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEducation = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try{
    const profile = await ProfileModel.findOne({user: req.user.id});
    profile.education.unshift(newEducation);
    await profile.save()
    res.json(profile)
  }catch (err){
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@route    DELETE api/profile/education/:exp_id
// @desc    Delete profile expreience
// @access  Private
router.delete('/education/:edu_id', auth, 
async(req, res) =>{
  try{
    const profile = await ProfileModel.findOne({user: req.user.id})

    //get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id); 
    profile.education.splice(removeIndex, 1)

    await profile.save();
    res.json(profile);

  }catch(err){
    console.error(err.message)
    res.status(500).json({msg:'server error'})
  }
})


//@route    GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username',(req, res) =>{
  try{
    const options ={
      uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
      method:'GET',
      headers:{'user-agent': 'node.js'}
    };
    request(options, (error, response, body) =>{
      if(error) console.error(error)
      
      if(response.statusCode !== 200){
        return res.status(400).json({msg: 'No Github profile found'})
      }
      res.json(JSON.parse(body))
    })
  }catch(err){
    console.error(err.message)
    res.status(500).send({msg:'server error'})
  }
})
module.exports = router;