const feedController = require('../../controller/v1/feed');
const { body, check } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const helper = require('../../helper/helper');

module.exports = (app) => {
    const feedValidation = [
        body('feedID', 'Must be number')
            .custom((value, { req, loc, path }) => {
                if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove == 'true' && (typeof (value) == "undefined" || value == "" || isNaN(value))) { return false; } else { return true; }
            }).withMessage('Feed ID Required'),
        body('title', 'Title Required')
            .custom((value, { req, loc, path }) => {
                if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove == 'true') { return true; } else if (typeof (value) == "undefined" || value == "") { return false; } else { return true; }
            }).withMessage('Title Required'),
        body('description').optional({ checkFalsy: true }),
        body('image')
            .custom((value, { req, loc, path }) => {
                if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove == 'true') {
                    return true;
                } else if (req.files) {
                    if (req.files.image) {
                        let t_file = req.files.image.mimetype;
                        t_file = t_file.split('/');
                        if (t_file[0] == 'image') {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }).withMessage('Expected Image Format Only'),
        body('isRemove', 'Must be Boolean').isBoolean()
    ];
    
    const listValidation = [
        body('search', 'Must be string').optional({ checkFalsy: true }),
        body('feedID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
    ];

    app.post('/v1/feed', userAuth, feedValidation, feedController.feed);
    app.post('/v1/feed/list', userAuth, listValidation, feedController.list);
}