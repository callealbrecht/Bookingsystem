const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    console.log(req.header.authorization);

    try {

        const decoded = jwt.verify(req.header('authorization'), "secret");
        console.log(decoded.email);
        req.authToken = decoded;
        next();

    } catch (error) {
        res.status(401).json({
            message: "Authentication failed"
        });
    }
};



// om vi lyckas verifiera jwt >> next()