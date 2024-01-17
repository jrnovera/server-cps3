//Setting up JWT and Secret
const jwt = require("jsonwebtoken");

const secret = "gadgetStoreniMangJr";


//Creating Access Token
//The 'createAccessToken' function takes 'user' object as input, extracts relevant info (id, email isAdmin) and creates JWT token.
module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, secret, {});
}

//JWT Verification Middleware
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);
    let token = req.headers.authorization;
    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
 	
        token = token.slice(7, token.length);

        jwt.verify(token, secret, function(err, decodedToken){
            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {
            	console.log("result from verify method:")
                console.log(decodedToken);

                req.user = decodedToken;
                next();	
            }
        })
    }
};

//Admin Verification Middleware
module.exports.verifyAdmin = (req, res, next) => {
	if(req.user.isAdmin){
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

//isLoggedIn middleware
module.exports.isLoggedIn = (req, res, next) =>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}



