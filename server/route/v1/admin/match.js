const matchController = require('../../../controller/v1/admin/match');
const { body, check } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const helper = require('../../../helper/helper');

module.exports = (app) => {
    const scheduleValidation = [
        body('eventID', 'Event ID Required').isNumeric(),
        body('schedule', 'Schedule details Required').isArray().notEmpty(),
        body('schedule.*.isCustom', 'Must be Boolean').isBoolean(),
        body('schedule.*.orderBy', 'Must be Number').isNumeric(),
        body('schedule.*.date', 'date must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('schedule.*.fromTime', 'Required From time').isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        body('schedule.*.toTime', 'Required To time').isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        body('schedule.*.matchType', 'Required Match type').isLength({ min: 1 }),
        body('schedule.*.description').optional({ checkFalsy: true }),
        body('schedule.*.name').optional({ checkFalsy: true }),
        body('schedule.*.competitor').optional({ checkFalsy: true }),
        body('schedule.*.opponent').optional({ checkFalsy: true }),
        body('schedule.*.scheduleID').optional({ checkFalsy: true }),
        body('schedule.*.venueAsset').optional({ checkFalsy: true })
    ];

    const getScheduleValidation = [
        body('eventID', 'Event ID Required').isNumeric(),
        body('venueID', 'Venue ID Required').optional({ checkFalsy: true }).isNumeric(),
        body('master', 'Must be Boolean').optional({ checkFalsy: true }).isBoolean()
    ];

    const viewScheduleValidation = [
        body('scheduleID', 'Schedule ID Required').isNumeric(),
    ];

    const insertMatchValidation = [
        body('match_id', 'Match ID Required').isNumeric(),
        body('competitor_id', 'Competitor ID Required').isNumeric(),
        body('opponent_id', 'Opponent ID Required').isNumeric(),
        body('match_statistics', 'Match Statistics Required').isArray(),

    ];
    
    const getMatchValidation = [
        body('match_id', 'Match ID Required').isNumeric(),
    ];

    app.post('/v1/match/schedule', userAuth, scheduleValidation, matchController.schedule);
    app.post('/v1/match/get', userAuth, getScheduleValidation, matchController.getSchedule);
    app.post('/v1/match/detail', userAuth, viewScheduleValidation, matchController.scheduleDetail);
    app.post('/v1/match/insertStatistics', userAuth, insertMatchValidation, matchController.insertMatchStatistics);
    app.post('/v1/match/getStatistics', userAuth, getMatchValidation, matchController.getMatchStatistics);
}