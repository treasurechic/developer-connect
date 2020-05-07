const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const config = require('config')
const bcrypt = require('bcryptjs')
const UserModel = require('../../models/Users')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

//@route    GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth,
async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error')
    }
  
});

  
//@route    Post api/auth
// @desc    Authenticate User and get token
// @access  Public
router.post('/',[
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is required').exists()
],
async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array() })
     }

     const { email, password} = req.body

     try{
         //check if user already exist
        let user = await UserModel.findOne({ email:email });
        if (!user){
          return  res.status(400).json({errors: [{ msg:'Invalid credentials' }]});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
          return  res.status(400).json({errors: [{ msg:'Invalid credentials' }]});
        }

        //return jsonwebtoken
        const payload = {
            user : {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) =>{
                if(err) throw err;
                res.json({token});
            } )
     }catch(err) {
        console.error(err);
        res.status(500).send('server error')
     }
})

module.exports = router;