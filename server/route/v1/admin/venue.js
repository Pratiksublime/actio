const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const venueController = require('../../../controller/v1/admin/venue');

module.exports = (app) => {
    const venueValidation = [
        body('title', 'Required Venue title').isLength({ min: 1, max: 255 }),
        body('address1', 'Required Address 1').isLength({ min: 1, max: 100 }),
        body('address2').optional({ checkFalsy: true }).isLength({ min: 1, max: 100 }),
        body('cityID', 'Required City').isNumeric(),
        body('stateID', 'Required State').isNumeric(),
        body('countryID', 'Required Country').isLength({ min: 1 }),
        body('latitude').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('longitude').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('zipcode', 'Required Zipcode').isNumeric(),
        body('description', 'Required Description').isLength({ min: 1 }),
        // body('spectatorSeat','Required Spectator Seat').isNumeric(),
        // body('twoWheeler','Required Two Wheeler Parking').isNumeric(),
        // body('fourWheeler','Required Four Wheeler Parking').isNumeric(),
        // body('freeLength','Invalid Free Length').optional({ checkFalsy:true }).isNumeric(),
        // body('freeWidth','Invalid Free Width').optional({ checkFalsy:true }).isNumeric(),
        // body('womensToilet','Required Womens Toilet').isNumeric(),
        // body('mensToilet','Required mens Toilet').isNumeric(),
        // body('playerRoom','Required Player Changing Room').isNumeric(),
        // body('water','Required Is Drinking Water Available').isBoolean(),
        // body('snacks','Required Is snacks Available').isBoolean(),
        // body('beverages','Required Is Beverages Available').isBoolean(),
        // body('status','Status Required ').isNumeric(),
        // body('venueType','Venue Type Required ').isNumeric(),
        // body('venueImage','Venue Images Required').optional({ checkFalsy:true })
        // .custom((value,{req, loc, path}) => {
        //     if ( typeof(value) == "undefined" || value == '') {
        //         return true;
        //     }else if(Array.isArray(value)){
        //         let otherStatus = true;
        //         value.forEach(e => {
        //             if(!e.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/))
        //             {
        //                 otherStatus = false;
        //             }
        //         });
        //         if(otherStatus) 
        //             return true;
        //         else 
        //             return false;
        //     }else{
        //         return false;
        //     }
        // }),
        // body('ImagesRemove','Player Area Images Remove ID').optional({ checkFalsy:true }).isArray(),
        // body('playArea','Play Area details Required').isArray(),
        // body('playArea.*.title','Play Area Title Required').isLength({min:1}),
        // body('playArea.*.surface','Play Area Surface Required').isNumeric(),
        // body('playArea.*.others').optional({ checkFalsy:true }),
        // body('playArea.*.description','Play Area Description Required').isLength({min:1}),
        // body('playArea.*.sportsid','Sports details Required').isNumeric(),
        // body('playArea.*.subsportsid','Sub Sports details Required').isArray(),
        // body('playArea.*.images','Asset Images Required').optional({ checkFalsy:true })
        // .custom((value,{req, loc, path}) => {
        //     if ( typeof(value) == "undefined" || value == '') {
        //         return true;
        //     }else if(Array.isArray(value)){
        //         let otherStatus = true;
        //         value.forEach(e => {
        //             if(!e.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/))
        //             {
        //                 otherStatus = false;
        //             }
        //         });
        //         if(otherStatus) 
        //             return true;
        //         else 
        //             return false;
        //     }else{
        //         return false;
        //     }
        // }),
        // body('contact','Contact details Required').isArray(),
        // body('contact.*.personName','Contact Person Name Required').isLength({min:1}),
        // body('contact.*.mobileNumber','Contact Mobile Number Required').isNumeric(),
        // body('contact.*.emailID','Contact Email ID Required').isLength({min:1}),
        // body('contact.*.webSite','Contact website Required').isLength({min:1}),
        // body('contact.*.socialMedia','Invalid Social Media Details').isArray(),
        // body('contact.*.socialMedia.*.socialMedia','Invalid Social Media Details').isLength({min:1}),
    ];

    // list
    const venuelistValidation = [
        body('venueID', 'Venue ID Required').optional({ checkFalsy: true }).isNumeric()
    ];

    const statusValidation = [
        body('venueID', 'Venue ID Required').isNumeric(),
        body('status', 'Status Required').isNumeric(),
    ];

    // Venue
    app.post('/v1/admin/venue', userAuth, venueValidation, venueController.venue);
    app.post('/v1/admin/venue/list', userAuth, venuelistValidation, venueController.list);
    app.post('/v1/admin/venue/master', userAuth, venueController.master);
    app.post('/v1/admin/venue/status', userAuth, statusValidation, venueController.venueStatus)
    app.post('/v1/admin/venue/delete', userAuth, venueController.deletedata)
}