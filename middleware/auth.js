const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next ){
    //Get the token from header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token){
        res.status(401).json('No Token, authorization denied')
    }
    // verify is there is a token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    }catch{
        res.status(401).json({msg: 'Token is not valid'})
    }



    
}