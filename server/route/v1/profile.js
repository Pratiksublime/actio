const profileController = require('../../controller/v1/profile');
const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const helper = require('../../helper/helper');

module.exports = (app) => {
    const masterValidation = [
        body('countryID', 'Country ID must be number').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('stateID', 'State ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('instituteID', 'Institute ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('classID', 'Class ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('streamID', 'Stream ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('stateCity', 'must be boolean').optional({ checkFalsy: true }).isBoolean()
    ];

    const dpValidation = [
        body('displayPicture')
            .custom((value, { req, loc, path }) => {
                if (req.files) {
                    if (req.files.displayPicture) {
                        let t_file = req.files.displayPicture.mimetype;
                        t_file = t_file.split('/');
                        if (t_file[0] == 'image') {
                            return true;
                        }
                    }
                }
            }).withMessage('Display Picture Required and Expected Image Format Only'),
    ];

    const profileValidation = [
        body('isStudent', 'Must be Boolean').isBoolean(),
        body('instituteID')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Institute ID'),
        body('fromYear')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Academic From Year'),
        body('toYear')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Academic To Year'),
        body('classID')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Class ID'),
        body('streamID')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Stream ID'),
        body('divisionID')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required division ID'),
        body('cityID')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required City ID'),
        body('pincode')
            .custom((value, { req, loc, path }) => {
                if (req.body.isStudent && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isStudent && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Pincode'),
        body('sportsPlay', 'Required Sports you play')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value.length == 0)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Sports you play'),
        body('sportsPlay.*.sportsID', 'Sports ID Required').isNumeric(),
        body('sportsPlay.*.since', 'Required playing since').isNumeric(),
        body('sportsPlay.*.hours', 'Required playing weekly hours').isNumeric(),
        body('isCoach', 'Must be Boolean').isBoolean(),
        body('coaching', 'Required Sports you coach')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value.length == 0)) {
                    return false;
                } else { return true; }
            }).withMessage('Required Sports you coach'),
        body('coaching.*.sportsID', 'ID must be number')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isCoach && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('Sports ID Required'),
        body('coaching.*.cityID', 'ID must be number')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else if (req.body.isCoach && isNaN(value)) {
                    return false;
                } else { return true; }
            }).withMessage('City ID Required'),
        body('coaching.*.locality', 'Required Locality')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else { return true; }
            }).withMessage('Required Locality'),
        body('coaching.*.about', 'Required - About Coaching')
            .custom((value, { req, loc, path }) => {
                if (req.body.isCoach && (typeof (value) == "undefined" || value == '')) {
                    return false;
                } else { return true; }
            }).withMessage('Required - About Coaching'),
        body('isSponsor', 'Must be Boolean').isBoolean(),
        body('aboutSponsorship')
            .custom((value, { req, loc, path }) => {
                if (req.body.isSponsor && value == '') { return false; }
                else { return true; }
            }).withMessage('Required - About Sponsorship'),
        body('isOrganizer', 'Must be Boolean').isBoolean(),
        body('aboutOrganize')
            .custom((value, { req, loc, path }) => {
                if (req.body.isOrganizer && value == '') { return false; }
                else { return true; }
            }).withMessage('Required - About Organizing Events')
    ];

    app.post('/v1/profile/master', userAuth, masterValidation, profileController.master);
    app.post('/v1/profile/image', userAuth, dpValidation, profileController.displayPicture);
    app.post('/v1/profile', userAuth, profileValidation, profileController.profile);
    app.post('/v1/profile/get', userAuth, profileController.getprofile);
    app.post('/v1/profile/myprofile', userAuth, profileController.getmyprofile);
    app.post('/v1/profile/changeEmailorPhone', userAuth, profileController.changeEmailorPhone);
};