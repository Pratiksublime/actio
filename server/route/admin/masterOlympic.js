const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const helper = require('../../helper/helper');
const masterController = require('../../controller/admin/master');

module.exports = (app) => {
    // Master tournament 
    const tournamentValidation = [
        body('list', 'Must be boolean').isBoolean(),
        body('tournamentID', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('name', 'Tournament Name Required').optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }),
        body('status', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('description').optional({ checkFalsy: true }),
        body('tournamentDetail').optional({ checkFalsy: true }).isNumeric()
    ];

    // Create new tournament 
    const tournamentCreateValidation = [
        body('tournament_name', 'Tournament Name Required').isLength({ min: 1, max: 100 }),
        body('status', 'Must be number').isNumeric(),
        body('tournament_description').isString(),
        body('tournament_venue').isNumeric(),
        //body('tournament_venue_name').isNumeric(),
        body('tournament_type').isNumeric(),
        body('tournament_country').isNumeric(),
        body('tournament_city').isNumeric(),
        body('tournament_state').isNumeric(),
        body('tournament_fee_type').isNumeric().custom((value, { req, loc, path }) => {
            if (req.body.tournament_fee_type == '1'
                || req.body.tournament_fee_type == '2'
                || req.body.tournament_fee_type == '3') {
                return true
            }
            else {
                return false;
            }
        }),
        // body('tournament_fee').custom((value,{req,loc,path}) =>{
        //     console.log(req.body.tournament_fee_type)
        //     if(req.body.tournament_fee_type == '1' ||
        //       req.body.tournament_fee_type == '3') {
        //         if(typeof req.body.tournament_fee === 'object' 
        //         && (!isNaN(req.body.tournament_fee.early_bird_entry_fees))
        //         && (!isNaN(req.body.tournament_fee.entry_fees)
        //         && (req.body.tournament_fee.early_bird_entry_fees != null)
        //         && (req.body.tournament_fee.entry_fees != null)
        //         )) {
        //             return true;
        //         }
        //     }
        //     if(req.body.tournament_fee_type == '2')
        //     {
        //         return true
        //     }
        //     else {
        //         return false
        //     } 
        // }).withMessage('Tournament fee is invalid'),
        body('tournament_organizer').isArray(),
        body('tournament_director').isArray(),
        body('tournament_start_date').custom(helper.isValidDate),
        body('tournament_end_date').custom(helper.isValidDate),
        body('tournament_start_time').isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        body('tournament_end_time').isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        body('tournament_registration_open_date').custom(helper.isValidDate),
        body('tournament_registration_end_date').custom(helper.isValidDate),
        body('tournament_early_bird_end_date').custom(helper.isValidDate).optional({ checkFalsy: true }),
        body('tournament_affliations').isArray(),
        body('tournament_sponsers').isArray(),
        body('tournament_logo').isArray(),
        body('tournament_banner').isArray(),
        body('tournament_organizer.*.id', 'Tournament organizer id is invalid').isNumeric(),
        // body('tournament_director.*.id','Tournament director id is invalid').isNumeric(),      
    ];

    const venueValidation = [
        body('country_id').isNumeric(),
        body('city_id').isNumeric(),
        body('state_id').isNumeric()
    ];
    
    const searchSubscriberValidation = [
        body('search_string').isLength({ min: 1 }).isString(),
        body('limit')
            .isNumeric()
            .isLength({ max: 5 })
            .optional({ checkFalsy: true })
    ];

    app.post('/v1/admin/master/tournament', userAuth, tournamentValidation, masterController.tournament);
    app.post('/v1/admin/master/tournamentDetails', userAuth, masterController.details);
    app.post('/v1/admin/master/tournamentCreate', userAuth, tournamentCreateValidation, masterController.tournamentCreate);
    app.post('/v1/admin/master/tournamentVenueFilter', userAuth, venueValidation, masterController.filterVenue);
    app.post('/v1/admin/master/tournamentSearchSubscriber', userAuth, searchSubscriberValidation, masterController.searchSubscriber);
}