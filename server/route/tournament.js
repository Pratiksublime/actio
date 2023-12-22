const tournamentController = require('../controller/v1/tournament');
const { body, check } = require('express-validator');
const auth = require('../middleware/auth');
const tournament = require('../model/v1/tournament');

module.exports = (app) => {
    const tournamentValidation = [
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

    const searchTournamentValidation = [
        body('tournamentID').isNumeric().withMessage('Invalid Tournament ID')
    ];

    const organizerTournamentValidation = [
        body('tournamentID').isNumeric().withMessage('Invalid Tournament ID')
    ];

    const locationTournamentValidation = [
        body('tournamentID').isNumeric().withMessage('Invalid Tournament ID')
    ];

    const eventCategoryValidation = [
        body('tournamentID').isNumeric().withMessage('Invalid Tournament ID'),
        body('search').optional({ checkFalsy: true }).isString()
    ];

    const tournamentUpdateValidation = [
        body('list', 'Must be boolean').optional({ checkFalsy: true }).isBoolean(),
        body('tournamentID').isNumeric().withMessage('Invalid Tournament ID'),
        // body('tournament_name','Tournament Name Required').isLength({min:1,max:100}).optional({ checkFalsy:true }),
        body('status', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_description').optional({ checkFalsy: true }).isString(),
        body('tournament_venue').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_type').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_country').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_city').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_state').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_fee_type').optional({ checkFalsy: true }).isNumeric(),
        body('tournament_fee').optional({ checkFalsy: true }).custom((value, { req, loc, path }) => {
            if (req.body.tournament_fee === null) {
                return true
            }
            else if (typeof req.body.tournament_fee === 'object'
                && (!isNaN(req.body.tournament_fee.early_bird_entry_fees))
                && (!isNaN(req.body.tournament_fee.entry_fees))) {
                return true
            }
            else {
                return false
            }
        }).withMessage('Tournament fee is invalid'),
        body('tournament_affliations').optional({ checkFalsy: true }).isArray(),
        body('tournament_sponsers').optional({ checkFalsy: true }).isArray(),
        body('tournament_organizer').optional({ checkFalsy: true }).isArray(),
        body('tournament_director').optional({ checkFalsy: true }).isArray(),
        body('tournament_start_date').optional({ checkFalsy: true }),
        body('tournament_end_date').optional({ checkFalsy: true }),
        body('tournament_start_time').optional({ checkFalsy: true }),
        body('tournament_end_time').optional({ checkFalsy: true }),
        body('tournament_registration_open_date').optional({ checkFalsy: true }),
        body('tournament_registration_end_date').optional({ checkFalsy: true }),
        body('removeImages').optional({ checkFalsy: true }).isArray(),
        body('removeDirector').optional({ checkFalsy: true }).isArray(),
        body('removeOrganizer').optional({ checkFalsy: true }).isArray(),
        body('removeAffliate').optional({ checkFalsy: true }).isArray(),
        body('removeSponser').optional({ checkFalsy: true }).isArray(),
        body('tournament_logo').optional({ checkFalsy: true }).isArray(),
        body('tournament_banner').optional({ checkFalsy: true }).isArray()
    ];

    const eventValidation = [
        body('eventID').isNumeric().withMessage('Invalid Tournament ID')
    ];

    // app.post('/v1/tournament/search/prize',auth.userAuth,tournamentController.prize);
    app.post('/v1/tournament/search/organizer', auth.userAuth, organizerTournamentValidation, tournamentController.organizer);
    app.post('/v1/tournament/search', auth.userAuth, searchTournamentValidation, tournamentController.search);
    app.post('/v1/tournament/list', auth.userAuth, tournamentValidation, tournamentController.list);
    app.post('/v1/tournament/search/location', auth.userAuth, locationTournamentValidation, tournamentController.location);
    app.post('/v1/tournament/search/affliation', auth.userAuth, tournamentController.affliation);
    app.post('/v1/tournament/search/eventcategory', auth.userAuth, eventCategoryValidation, tournamentController.eventCategory);
    app.post('/v1/tournament/updateTournament', auth.userAuth, tournamentUpdateValidation, tournamentController.updateTournament);
    app.post('/v1/tournament/search/event', auth.userAuth, eventValidation, tournamentController.event);
    // app.post('/v1/tournament/search/event/matches',auth.userAuth,tournamentController.eventMatches);
    app.post('/v1/tournament/delete',auth.userAuth,tournamentController.deletedata);
}