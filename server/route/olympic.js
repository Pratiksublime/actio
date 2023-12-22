const olympicController = require('../controller/v1/olympic');
const { body, check } = require('express-validator');
const auth = require('../middleware/auth');
const olympic = require('../model/olympic');

module.exports = (app) => {
    const olympicValidation = [
        body('latitude').isNumeric().withMessage('Invalid Latitude'),
        body('longitude').isNumeric().withMessage('Invalid Longitude'),
        body('search').isString().withMessage('Invalid Search field value').optional({ checkFalsy: true }),
        body('radius').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid radius'),
        body('city').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid ciity'),
        body('type').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid Type'),
        body('category').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid category'),
        body('sport').optional({ checkFalsy: true }).isNumeric().withMessage('Invalid Sport'),
        body('price_range_start').optional({ checkFalsy: true }).isNumeric().custom((value, { req, loc, path }) => {
            if (!req.body.price_range_end) {
                return false;
            }
            if (req.body.price_range_end < req.body.price_range_start) {
                return false;
            }
            return true;
        }).withMessage('Invalid Range'),
        body('price_range_end').optional({ checkFalsy: true }).isNumeric().custom((value, { req, loc, path }) => {
            if (!req.body.price_range_start) {
                return false;
            }
            return true;
        }).withMessage('Invalid Range'),
    ];

    const searcholympicValidation = [
        body('olympicID').isNumeric().withMessage('Invalid olympic ID')
    ];

    const organizerolympicValidation = [
        body('olympicID').isNumeric().withMessage('Invalid olympic ID')
    ];

    const locationolympicValidation = [
        body('olympicID').isNumeric().withMessage('Invalid olympic ID')
    ];

    const eventCategoryValidation = [
        body('olympicID').isNumeric().withMessage('Invalid olympic ID'),
        body('search').optional({ checkFalsy: true }).isString()
    ];

    const olympicUpdateValidation = [
        body('list', 'Must be boolean').optional({ checkFalsy: true }).isBoolean(),
        body('olympicID').isNumeric().withMessage('Invalid olympic ID'),
        // body('olympic_name','olympic Name Required').isLength({min:1,max:100}).optional({ checkFalsy:true }),
        body('status', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_description').optional({ checkFalsy: true }).isString(),
        body('olympic_venue').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_type').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_country').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_city').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_state').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_fee_type').optional({ checkFalsy: true }).isNumeric(),
        body('olympic_fee').optional({ checkFalsy: true }).custom((value, { req, loc, path }) => {
            if (req.body.olympic_fee === null) {
                return true
            }
            else if (typeof req.body.olympic_fee === 'object'
                && (!isNaN(req.body.olympic_fee.early_bird_entry_fees))
                && (!isNaN(req.body.olympic_fee.entry_fees))) {
                return true
            }
            else {
                return false
            }
        }).withMessage('olympic fee is invalid'),
        body('olympic_affliations').optional({ checkFalsy: true }).isArray(),
        body('olympic_sponsers').optional({ checkFalsy: true }).isArray(),
        body('olympic_organizer').optional({ checkFalsy: true }).isArray(),
        body('olympic_director').optional({ checkFalsy: true }).isArray(),
        body('olympic_start_date').optional({ checkFalsy: true }),
        body('olympic_end_date').optional({ checkFalsy: true }),
        body('olympic_start_time').optional({ checkFalsy: true }),
        body('olympic_end_time').optional({ checkFalsy: true }),
        body('olympic_registration_open_date').optional({ checkFalsy: true }),
        body('olympic_registration_end_date').optional({ checkFalsy: true }),
        body('removeImages').optional({ checkFalsy: true }).isArray(),
        body('removeDirector').optional({ checkFalsy: true }).isArray(),
        body('removeOrganizer').optional({ checkFalsy: true }).isArray(),
        body('removeAffliate').optional({ checkFalsy: true }).isArray(),
        body('removeSponser').optional({ checkFalsy: true }).isArray(),
        body('olympic_logo').optional({ checkFalsy: true }).isArray(),
        body('olympic_banner').optional({ checkFalsy: true }).isArray()
    ];

    const eventValidation = [
        body('eventID').isNumeric().withMessage('Invalid olympic ID')
    ];

    // app.post('/v1/olympic/search/prize',auth.userAuth,olympicController.prize);
    app.post('/v1/olympic/search/organizer', auth.userAuth, organizerolympicValidation, olympicController.organizer);
    app.post('/v1/olympic/search', auth.userAuth, searcholympicValidation, olympicController.search);
    app.post('/v1/olympic/list', auth.userAuth, olympicValidation, olympicController.list);
    app.post('/v1/olympic/search/location', auth.userAuth, locationolympicValidation, olympicController.location);
    app.post('/v1/olympic/search/affliation', auth.userAuth, olympicController.affliation);
    app.post('/v1/olympic/search/eventcategory', auth.userAuth, eventCategoryValidation, olympicController.eventCategory);
    //app.post('/v1/olympic/updateolympic', auth.userAuth, olympicUpdateValidation, olympicController.updateolympic);
    app.post('/v1/olympic/updateOlympic', auth.userAuth, olympicController.updateolympic);
    app.post('/v1/olympic/search/event', auth.userAuth, eventValidation, olympicController.event);
    // app.post('/v1/olympic/search/event/matches',auth.userAuth,olympicController.eventMatches);
    // app.post('/v1/olympic/search/event/reviews',auth.userAuth,olympicController.eventReviews);
    app.post('/v1/olympic/delete',auth.userAuth,olympicController.deletedata);

    //app.get('/v1/olympic/list_new', olympicController.list_new);
}