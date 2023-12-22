const { body, check } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const kpiController = require('../../controller/v1/kpi');
const helper = require('../../helper/helper');
const { updateKPI } = require('../../model/kpi');

module.exports = (app) => {
    const validateEventID = [
        body('eventID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
    ];

    const validateKPIInsert = [
        body('tournamentID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid tournament id'),
        body('eventID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('coachID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('kpi')
            .isArray()
    ];

    const validateNonActioEventInsert = [
        body('country')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid Country id'),
        body('state')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid State id'),
        body('venue')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid Venue'),
        body('tournament_name')
            .isString({ min: 1 })
            .withMessage('Please Enter valid tournament name'),
        body('from_date').custom(helper.isValidDate)
            .withMessage('Please Enter valid from_date'),
        body('to_date').custom(helper.isValidDate)
            .withMessage('Please Enter valid to_date'),
        body('event').isArray(),
        body('event.*.name').isString(),
        body('event.*.sports').isNumeric(),
    ];

    const filterKPIValidation = [
        body('country').isNumeric().isLength({ min: 1 }).withMessage('Please Enter valid Country id'),
        body('state').isNumeric().isLength({ min: 1 }).withMessage('Please Enter valid State id'),
        body('year').optional({ checkFalsy: true }).isNumeric().isLength({ min: 4 }).isLength({ max: 4 }).withMessage('Please Enter valid Year'),
        body('tournamentID').optional({ checkFalsy: true }).isNumeric().isLength({ min: 1 }).withMessage('Please Enter valid tournament id'),
        body('eventID').optional({ checkFalsy: true }).isNumeric().isLength({ min: 1 }).withMessage('Please Enter valid event id')

    ];

    const registerNonActioKPI = [
        body('tournamentID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid tournament id'),
        body('eventID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('coachID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('kpi')
            .isArray()
    ];

    const performanceReviewValidation = [
        body('reviewer')
            .custom((value, { req, loc, path }) => {
                if (req.body.reviewer == '1' || req.body.reviewer == '2') {
                    return true;
                }
                else {
                    return false;
                }
            })
            .withMessage('Please Enter valid Reviewer id'),
    ];

    const performanceCoachReviewListValidation = [
        body('eventID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('event_kpi_type')
            .custom((value, { req, loc, path }) => {
                if (req.body.event_kpi_type == '1' || req.body.event_kpi_type == '2') {
                    return true;
                }
                else {
                    return false;
                }
            })
            .withMessage('Please Enter valid event_kpi_type id')

    ];

    const updateKPIvalidation = [
        body('kpi')
            .isArray()
            .withMessage('Please Enter valid kpi'),
        body('kpiID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('event_kpi_type')
            .custom((value, { req, loc, path }) => {
                if (req.body.event_kpi_type == '1' || req.body.event_kpi_type == '2') {
                    return true;
                }
                else {
                    return false;
                }
            })
            .withMessage('Please Enter valid event_kpi_type id')
    ];

    const getEventKPIForCoachvalidation = [
        body('eventID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('kpiID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('event_kpi_type')
            .custom((value, { req, loc, path }) => {
                if (req.body.event_kpi_type == '1' || req.body.event_kpi_type == '2') {
                    return true;
                }
                else {
                    return false;
                }
            })
            .withMessage('Please Enter valid event_kpi_type id')
    ];

    const coachReviewKPIValidation = [
        body('status')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid status'),
        body('remarks')
            .isString()
            .withMessage('Please Enter valid remarks'),
        body('kpiID')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid event id'),
        body('event_kpi_type')
            .custom((value, { req, loc, path }) => {
                if (req.body.event_kpi_type == '1' || req.body.event_kpi_type == '2') {
                    return true;
                }
                else {
                    return false;
                }
            })
    ];

    app.post('/v1/actioKPI', userAuth, validateEventID, kpiController.actioKPI);
    app.post('/v1/insertActioKPI', userAuth, validateKPIInsert, kpiController.insertActioKPI);
    app.post('/v1/nonActioKPIList', userAuth, kpiController.nonActioKPI1);
    app.post('/v1/registerNonActioEvents', userAuth, validateNonActioEventInsert, kpiController.registerNonActioEvents);
    app.post('/v1/nonActioKPIFilter', userAuth, filterKPIValidation, kpiController.nonActioFilterKPI);
    app.post('/v1/registerNonActioEventsKPI', userAuth, registerNonActioKPI, kpiController.registerNonActioEventsKPI);
    app.post('/v1/performanceReviewerList', userAuth, kpiController.performanceReviewerList);
    app.post('/v1/performanceReview', userAuth, performanceReviewValidation, kpiController.performanceReview);
    app.post('/v1/performanceCoachReviewList', userAuth, performanceCoachReviewListValidation, kpiController.performanceCoachReviewList);
    app.post('/v1/updateKPI', userAuth, updateKPIvalidation, kpiController.updateKPI);
    app.post('/v1/getEventKPIForCoach', userAuth, getEventKPIForCoachvalidation, kpiController.getEventKPIForCoach);
    app.post('/v1/coachReviewKPI', userAuth, coachReviewKPIValidation, kpiController.coachReviewKPI);
}