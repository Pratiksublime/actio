const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    let decodedToken = '';
    try {
        const token = req.get('Authorization').split(' ')[1];
        

        if (req.get('requestFrom') == 'client') {
            decodedToken = jwt.verify(token, process.env.SECRET2);
        }
        else {
            decodedToken = jwt.verify(token, process.env.SECRET);
        }
    } catch (err) {
        let error;
        if (err.name == 'TokenExpiredError') {
            error = new Error('Token expired, please request for new token !');
        }
        else {
            error = new Error('Not Authorized');
        }
        error.statusCode = process.env.STATUS_400;
        throw error;
    }

    if (!decodedToken) {
        const error = new Error('Not Authorized');
        error.statusCode = process.env.STATUS_400;
        throw error;
    }

    req.myID = decodedToken.id;

    next();
}

module.exports = { userAuth };