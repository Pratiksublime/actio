const registrationController = require('../controller/v1/registration');
const { body } = require('express-validator');
const { userAuth } = require('../middleware/auth');
const helper = require('../helper/helper');

module.exports = (app) => {
    const masterValidation = [
        body('countryID', 'Country ID must be number').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('stateID', 'State ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('sportsID', 'Sports ID must be number').optional({ checkFalsy: true }).isNumeric(),
    ];

    const playerValidation = [
        body('search', 'search key required').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('subscriberID', 'Subscriber ID must be number').optional({ checkFalsy: true }).isNumeric()
            .custom((value, { req, loc, path }) => {
                if (typeof (value) != "undefined" && value != '' && (typeof (req.body.eventID) == "undefined" || req.body.eventID == '')) {
                    return false;
                } else {
                    return true;
                }
            }).withMessage('Event ID Required'),
        body('eventID', 'Event ID must be number').optional({ checkFalsy: true }).isNumeric(),
    ];

    const joinValidation = [
        body('eventID', 'Event ID Required').isNumeric(),
        body('registerBy', 'Register By Required').isNumeric(),
        body('teamName', 'Team Name Required').isLength({ min: 1, max: 100 }).withMessage('Team Name must be 1 to 100 Characters'),
        body('ageGroup', 'Age Group Required').isNumeric(),
        body('coach_SubscribeId', 'Must be valid subscriber id'),
        body('coachName').isLength({ min: 1, max: 100 }).withMessage('Coach Name is not valid'),
        body('coachIsd').isLength({ min: 1, max: 10 }).withMessage('Coach ISD is not valid'),
        body('coachMobile').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Invalid Mobile Number'),
        body('coachEmail').isEmail().withMessage('Invalid Email'),
        body('cityID', 'City Required').isNumeric(),
        body('registrationID', 'Registration ID Required').optional({ checkFalsy: true }).isNumeric()
    ];

    const addplayerValidation = [
        body('registrationID', 'Registration ID must be number').isNumeric(),
        body('players', 'Players details Required').isArray(),
        body('players.*.id', 'ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('players.*.name', 'Player Name Required').isLength({ min: 1, max: 100 }).trim(),
        body('players.*.gender', 'Gender Required').isNumeric().isInt({ min: 1, max: 3 }),
        body('players.*.dob', 'DOB must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('players.*.isdCode', 'ISD Code be with in 1 to 10 Characters').isLength({ min: 1, max: 10 }),
        body('players.*.mobileNumber', 'Mobile must be number').isNumeric(),
        body('players.*.email', 'Invalid Email ID').isEmail(),
        // body('players.*.position','Position Required').isNumeric(),
    ];

    const listvalidation = [
        body('tournamentID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('sportsID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('eventID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('statusID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('master', 'Must be Boolean').optional({ checkFalsy: true }).isBoolean(),
        body('role', 'Must be Number').optional({ checkFalsy: true }).isNumeric(),
    ];

    const viewvalidation = [
        body('registrationID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('eventID', 'Must be number').optional({ checkFalsy: true }).isNumeric()
    ];

    const editvalidation = [
        body('registrationID', 'Registration ID Required').isNumeric(),
        body('playerID', 'Player ID Required').isNumeric(),
        body('isRemove', 'Must be Boolean').optional({ checkFalsy: true }).isBoolean(),
        body('subscriberID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('name', 'Name must be with in 1 to 100 Characters').optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }).trim(),
        body('gender', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('dob', 'DOB must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate),
        body('isdCode', 'ISD Code be with in 1 to 10 Characters').optional({ checkFalsy: true }).isLength({ min: 1, max: 10 }),
        body('mobileNumber', 'Mobile must be number').optional({ checkFalsy: true }).isNumeric(),
        body('email', 'Invalid Email ID').optional({ checkFalsy: true }).isEmail(),
        body('position', 'Position Required').optional({ checkFalsy: true }).isNumeric(),
    ];

    const submittvalidation = [
        body('registrationID', 'Registration ID Required').isNumeric(),
        body('addPlay').optional({ checkFalsy: true }).isBoolean(),
        body('players', 'Players details Required').optional({ checkFalsy: true }).isArray(),
        body('players.*.id', 'ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('players.*.name', 'Player Name Required').isLength({ min: 1, max: 100 }).trim(),
        body('players.*.gender', 'Gender Required').isNumeric().isInt({ min: 1, max: 3 }),
        body('players.*.dob', 'DOB must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('players.*.isdCode', 'ISD Code be with in 1 to 10 Characters').isLength({ min: 1, max: 10 }),
        body('players.*.mobileNumber', 'Mobile must be number').isNumeric(),
        body('players.*.email', 'Invalid Email ID').isEmail(),
        body('players.*.position', 'Position Required').isNumeric(),
        body('editPlay').optional({ checkFalsy: true }).isBoolean(),
        body('editPlayers', 'Players details Required').optional({ checkFalsy: true }).isArray(),
        body('editPlayers.*.pid', 'Registration ID Required').isNumeric(),
        body('editPlayers.*.id', 'ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('editPlayers.*.name', 'Player Name Required').optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }).trim(),
        body('editPlayers.*.gender', 'Gender Required').optional({ checkFalsy: true }).isNumeric().isInt({ min: 1, max: 3 }),
        body('editPlayers.*.dob', 'DOB must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate),
        body('editPlayers.*.isdCode', 'ISD Code be with in 1 to 10 Characters').optional({ checkFalsy: true }).isLength({ min: 1, max: 10 }),
        body('editPlayers.*.mobileNumber', 'Mobile must be number').optional({ checkFalsy: true }).isNumeric(),
        body('editPlayers.*.email', 'Invalid Email ID').optional({ checkFalsy: true }).isEmail(),
        body('editPlayers.*.position', 'Position Required').optional({ checkFalsy: true }).isNumeric(),
        body('removePlay').optional({ checkFalsy: true }).isBoolean(),
        body('removePlayers', 'Must be array').optional({ checkFalsy: true }).isArray(),
        body('registerBy', 'Register By Required').optional({ checkFalsy: true }).isNumeric(),
        body('teamName', 'Team Name Required').optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }).withMessage('Team Name must be 1 to 100 Characters'),
        body('ageGroup', 'Age Group Required').optional({ checkFalsy: true }).isNumeric(),
        body('isCoach', 'Must be Boolean').optional({ checkFalsy: true }).isBoolean(),
        body('coachName').custom((val, { req }) => {
            if (typeof (req.body.isCoach) == "undefined") { return true } else if (req.body.isCoach === true && (typeof (val) == "undefined" || val == '')) { return false; } else { return true; }
        }).withMessage('Coach Name Required'),
        body('coachIsd').custom((val, { req }) => {
            if (typeof (req.body.isCoach) == "undefined") { return true } else if (req.body.isCoach === true && (typeof (val) == "undefined" || val == '')) { return false; } else { return true; }
        }).withMessage('Coach ISD Code Required'),
        body('coachMobile').custom((val, { req }) => {
            if (typeof (req.body.isCoach) == "undefined") { return true } else if (req.body.isCoach === true && (typeof (val) == "undefined" || val == '')) { return false; } else { return true; }
        }).withMessage('Coach Mobile Number Required').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid Mobile Number'),
        body('coachEmail').custom((val, { req }) => {
            if (typeof (req.body.isCoach) == "undefined") { return true } else if (req.body.isCoach === true && (typeof (val) == "undefined" || val == '')) { return false; } else { return true; }
        }).withMessage('Coach Email Required').optional({ checkFalsy: true }).isEmail().withMessage('Invalid Email'),
        body('cityID', 'City Required').optional({ checkFalsy: true }).isNumeric(),
    ];

    const nonvalidation = [
        body('name', 'Player Name Required').isLength({ min: 1, max: 100 }).trim(),
        body('dob', 'DOB must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('isdCode', 'ISD Code be with in 1 to 10 Characters').isLength({ min: 1, max: 10 }),
        body('mobileNumber', 'Mobile must be number').isNumeric(),
    ];

    app.post('/v1/registration/master', userAuth, masterValidation, registrationController.master);
    app.post('/v1/registration/player', userAuth, playerValidation, registrationController.playerSearch);
    app.post('/v1/registration/join', userAuth, joinValidation, registrationController.join);
    app.post('/v1/registration/addplayers', userAuth, addplayerValidation, registrationController.addPlayers);
    app.post('/v1/registration/list', userAuth, listvalidation, registrationController.list);
    app.post('/v1/registration/view', userAuth, viewvalidation, registrationController.view);
    app.post('/v1/registration/editplayer', userAuth, editvalidation, registrationController.editPlayer);
    app.post('/v1/registration/submit', userAuth, submittvalidation, registrationController.submit);
    app.post('/v1/registration/nonsubscriber', userAuth, nonvalidation, registrationController.nonSubscriber);
};

