const eventController = require('../../../controller/v1/admin/event');
const { body, check } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const helper = require('../../../helper/helper');

module.exports = (app) => {
    // Create Event 
    const submitvalidation = [
        body('tournamentID', 'Tournament ID must be number').isNumeric(),
        body('eventTypeID', 'Event Type Required').isNumeric(),
        body('eventName', 'Event Name must be with in 1 to 100 characters').trim().isLength({ min: 1, max: 100 }),
        body('sportsID', 'Sports ID must be number').isNumeric(),
        // body('categoryID','Category ID must be number').isNumeric(),
        // body('description','Description Required').isLength({min:1}),
        body('noofTeam', 'No of Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('minPerTeam', 'Minimum Member Per Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('maxPerTeam', 'Maximum Member Per Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('amount', 'Amount Required').optional({ checkFalsy: true }).isNumeric(),
        // body('birdDiscount','Brid Discount Required').optional({ checkFalsy:true }).isNumeric().isDecimal({decimal_digits:2}).withMessage('Bird Discount Must Be Decimal').custom((value,{req, loc, path}) => {
        //     if (typeof(value) != "undefined" && typeof(req.body.amount) != "undefined" && req.body.amount != '' && value != '') {
        //         if(parseFloat(value)>parseFloat(req.body.amount)){
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     }else{
        //         return true;
        //     }
        // }).withMessage('Discount Can\'t Be Greater than Fee'),
        // body('eventStartDate', 'Event Start Date must be in DD-MM-YYYY format').optional({ checkFalsy:true }).custom(helper.isValidDate).custom((value,{req, loc, path}) => {
        //     if (typeof(value) != "undefined" && typeof(req.body.registerEndDate) != "undefined" && req.body.registerEndDate != '') {
        //     let strfromdate = req.body.registerEndDate.split('-');
        //     let newfromDate = strfromdate[2]+'-'+strfromdate[1]+'-'+strfromdate[0];
        //     let strtodate = value.split('-');
        //     let  newtoDate = strtodate[2]+'-'+strtodate[1]+'-'+strtodate[0];
        //         let fromDate=new Date(newfromDate);
        //         let toDate=new Date(newtoDate);
        //         if(fromDate>toDate){
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     }else{
        //         return true;
        //     }
        // }).withMessage('Invalid Event Start Date')
        // .custom(async(value,{req, loc, path}) => {
        //     if(req.body.tournamentID) {
        //         let tournament = await db.query(`SELECT tournament_start_date,tournament_end_date FROM tournament WHERE id = ${req.body.tournamentID}`);
        //         if(tournament.rowCount) {
        //             tournament = tournament.rows;
        //             let tournamentStartDate = tournament[0].tournament_start_date.setHours(0,0,0,0);
        //             let tournamentEndDate = tournament[0].tournament_end_date.setHours(0,0,0,0);
        //             let toDate = value.split('-');
        //             toDate = toDate[2]+'-'+toDate[1]+'-'+toDate[0];
        //             toDate = new Date(toDate).setHours(0,0,0,0);
        //             if(toDate < tournamentStartDate || toDate > tournamentEndDate) {
        //                 return await Promise.reject(false);
        //             }
        //         } 
        //         else {
        //             return await Promise.reject(false);
        //         } 
        //     }
        //     await Promise.resolve(true);    
        // }).withMessage('Invalid Event Start Date'),
        // body('eventEndDate', 'Event End Date must be in DD-MM-YYYY format').optional({ checkFalsy:true }).custom(helper.isValidDate).custom((value,{req, loc, path}) => {
        //     if (typeof(value) != "undefined" && typeof(req.body.eventStartDate) != "undefined" && req.body.eventStartDate != '') {
        //     let strfromdate = req.body.eventStartDate.split('-');
        //     let newfromDate = strfromdate[2]+'-'+strfromdate[1]+'-'+strfromdate[0];
        //     let strtodate = value.split('-');
        //     let newtoDate = strtodate[2]+'-'+strtodate[1]+'-'+strtodate[0];
        //         let fromDate=new Date(newfromDate);
        //         let toDate=new Date(newtoDate);
        //         let temptoday = new Date().toISOString().slice(0, 10);
        //         let today = new Date(temptoday);
        //         if(fromDate>toDate){
        //             console.log(1)
        //             return false;
        //         }else if(toDate < today){
        //             console.log(2)
        //             return false;
        //         }else{
        //             console.log(3)
        //             return true;
        //         }
        //     }else{
        //         return true;
        //     }
        // }).withMessage('Invalid Event End Date')
        // .custom(async(value,{req, loc, path}) => {
        //     if(req.body.tournamentID) {
        //         let tournament = await db.query(`SELECT tournament_start_date,tournament_end_date FROM tournament WHERE id = ${req.body.tournamentID}`);
        //         if(tournament.rowCount) {
        //             tournament = tournament.rows;
        //             let tournamentStartDate = tournament[0].tournament_start_date.setHours(0,0,0,0);
        //             let tournamentEndDate = tournament[0].tournament_end_date.setHours(0,0,0,0);
        //             let toDate = value.split('-');
        //             toDate = toDate[2]+'-'+toDate[1]+'-'+toDate[0];
        //             toDate = new Date(toDate).setHours(0,0,0,0);
        //             console.log(tournamentStartDate,tournamentEndDate,toDate)
        //             if(toDate < tournamentStartDate || toDate > tournamentEndDate) {
        //                 return await Promise.reject(false);
        //             }
        //         } 
        //         else {
        //             return await Promise.reject(false);
        //         } 
        //     }
        //     await Promise.resolve(true)    
        // }).withMessage('Invalid Event End Date'),
        // body('earlyBirdEndDate').optional({ checkFalsy:true }).custom(helper.isValidDate),
        // body('fromSlot', 'Event From Slot Required').isLength({min:1}).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        // body('toSlot', 'Event To Slot Required').isLength({min:1}).custom(helper.validateTime).withMessage('Invalid Time/Format').custom((value,{req, loc, path}) => {
        //     if (typeof(value) != "undefined" && typeof(req.body.fromSlot) != "undefined" && req.body.fromSlot != '') 
        //     {
        //         if(Date.parse('01/01/2020 '+value+'') < Date.parse('01/01/2020 '+req.body.fromSlot))
        //         {
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     }else{
        //         return true;
        //     }
        // }).withMessage('Invalid To Time Slot'),
        // body('playerType', 'Player Type Required').isNumeric(),
        body('minAgegroup', 'Minimum Age Group Required').isNumeric(),
        body('maxAgegroup', 'Maximum Age Group Required').isNumeric(),
        body('registerStartDate', 'Register Open Date must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('registerEndDate', 'Register End Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate).custom((value, { req, loc, path }) => {
            if (typeof (value) != "undefined" && typeof (req.body.registerStartDate) != "undefined" && req.body.registerStartDate != '') {
                let strfromdate = req.body.registerStartDate.split('-');
                let newfromDate = strfromdate[2] + '-' + strfromdate[1] + '-' + strfromdate[0];
                let strtodate = value.split('-');
                let newtoDate = strtodate[2] + '-' + strtodate[1] + '-' + strtodate[0];
                let fromDate = new Date(newfromDate);
                let toDate = new Date(newtoDate);
                if (fromDate > toDate) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).withMessage('Invalid Registration End Date'),
        body('venueID', 'Venue Required').isNumeric(),
        // // body('status', 'Status Required').isNumeric(),
        // body('controller','Manager Contact Required').isArray(),
        // body('manager','Manager Contact Required').isArray(),
        // body('manager.*.id','Manager ID Required').isNumeric(),
        // body('manager.*.additionalEmail','Invalid Email').optional({ checkFalsy:true }).isEmail(),
        // body('manager.*.additionalContact','Invalid Contact').optional({ checkFalsy:true }).isNumeric(),
        // body('banner','Banner Required')
        // .custom((value,{req, loc, path}) => {
        //     if (typeof(value) == "undefined") {
        //         return false;
        //     }else if(!value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)){
        //         return false;
        //     }else{
        //         return true;
        //     }
        // }),
        // body('otherImage','Images Required').optional({ checkFalsy:true })
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

    ]

    // list Event 
    const listvalidation = [
        body('eventID', 'Event ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('status', 'Status must be number').optional({ checkFalsy: true }).isNumeric(),
        body('search', '').optional(),
        body('cityID', 'City ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('range', 'Range must be number').optional({ checkFalsy: true }).isNumeric(),
        body('priceFrom', 'Invalid From Price').optional({ checkFalsy: true }).isNumeric(),
        body('priceTo', 'Invalid To Price')
            .custom((value, { req, loc, path }) => {
                if (req.body.priceFrom == '') {
                    return true;
                } else if (req.body.priceFrom != '' && value == '') {
                    return false;
                } else {
                    return true;
                }
            }).withMessage('To Price Range Required'),
        body('tournamentID', 'Tournament ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('sportsID', 'Sports ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('categoryID', 'Sports ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('nearMe', 'Near Me Required').isBoolean(),
        body('latitude')
            .custom((value, { req, loc, path }) => {
                if (req.body.range == '' && !req.body.nearMe) {
                    return true;
                } else if ((req.body.range != '' || req.body.nearMe) && value == '') {
                    return false;
                } else {
                    return true;
                }
            }).withMessage('Latitude Required'),
        body('longitude')
            .custom((value, { req, loc, path }) => {
                if (req.body.range == '' && !req.body.nearMe) {
                    return true;
                } else if ((req.body.range != '' || req.body.nearMe) && value == '') {
                    return false;
                } else {
                    return true;
                }
            }).withMessage('Longitude Required'),
    ];

    const editValidation = [
        body('eventID', 'Event ID must be number').isNumeric(),
        body('managerRemove', 'Manager ID Required Remove').optional({ checkFalsy: true }).isArray(),
        body('manager.*.id', 'Manager ID Required').optional({ checkFalsy: true }).isNumeric(),
        body('manager.*.additionalEmail', 'Invalid Email').optional({ checkFalsy: true }).isEmail(),
        body('manager.*.additionalContact', 'Invalid Contact').optional({ checkFalsy: true }).isNumeric(),
        body('otherImageRemove', 'Image ID Required Remove').optional({ checkFalsy: true }).isArray(),
        body('banner', 'Banner Required')
            .custom((value, { req, loc, path }) => {
                if ((typeof (value) == "undefined" || value == '')) {
                    return true;
                } else if (!value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)) {
                    return false;
                } else {
                    return true;
                }
            }),
        body('otherImage', 'Images Required').optional({ checkFalsy: true })
            .custom((value, { req, loc, path }) => {
                if (typeof (value) == "undefined" || value == '') {
                    return true;
                } else if (Array.isArray(value)) {
                    let otherStatus = true;
                    value.forEach(e => {
                        if (!e.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)) {
                            otherStatus = false;
                        }
                    });

                    if (otherStatus)
                        return true;
                    else
                        return false;
                } else {
                    return false;
                }
            }),
        body('tournamentID', 'Tournament ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('eventTypeID', 'Event Type Required').optional({ checkFalsy: true }).isNumeric(),
        body('eventName', 'Event Name must be with in 1 to 100 characters').optional({ checkFalsy: true }).trim().isLength({ min: 1, max: 100 }),
        body('sportsID', 'Sports ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('categoryID', 'Category ID must be number').optional({ checkFalsy: true }).isNumeric(),
        body('description', 'Description Required').optional({ checkFalsy: true }).isLength({ min: 1 }),
        body('noofTeam', 'No of Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('minPerTeam', 'Minimum Member Per Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('maxPerTeam', 'Maximum Member Per Team must be number').optional({ checkFalsy: true }).isNumeric(),
        body('amount', 'Amount Required').optional({ checkFalsy: true }).isDecimal({ decimal_digits: 2 }).withMessage('Amount Must Be Decimal'),
        // body('birdDiscount','Brid Discount Required').optional({ checkFalsy:true }).isDecimal({decimal_digits:2}).withMessage('Brid Discount Must Be Decimal').custom((value,{req, loc, path}) => {
        //     if (typeof(value) != "undefined" && typeof(req.body.amount) != "undefined" && req.body.amount != '' && value != '') {
        //         if(value>req.body.amount){
        //             return false;
        //         }else{
        //             return true;
        //         }
        //     }else{
        //         return true;
        //     }
        // }).withMessage('Discount Can\'t Be Greater than Fee'),
        body('eventStartDate', 'Event Start Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate).custom((value, { req, loc, path }) => {
            if (typeof (value) != "undefined" && typeof (req.body.registerEndDate) != "undefined" && req.body.registerEndDate != '' && value != '') {
                let strfromdate = req.body.registerEndDate.split('-');
                let newfromDate = strfromdate[2] + '-' + strfromdate[1] + '-' + strfromdate[0];
                let strtodate = value.split('-');
                let newtoDate = strtodate[2] + '-' + strtodate[1] + '-' + strtodate[0];
                let fromDate = new Date(newfromDate);
                let toDate = new Date(newtoDate);
                if (fromDate > toDate) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).withMessage('Invalid Event Start Date'),
        body('eventEndDate', 'Event End Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate).custom((value, { req, loc, path }) => {
            if (typeof (value) != "undefined" && typeof (req.body.eventStartDate) != "undefined" && req.body.eventStartDate != '' && value != '') {
                let strfromdate = req.body.eventStartDate.split('-');
                let newfromDate = strfromdate[2] + '-' + strfromdate[1] + '-' + strfromdate[0];
                let strtodate = value.split('-');
                let newtoDate = strtodate[2] + '-' + strtodate[1] + '-' + strtodate[0];
                let fromDate = new Date(newfromDate);
                let toDate = new Date(newtoDate);
                let temptoday = new Date().toISOString().slice(0, 10);
                let today = new Date(temptoday);
                if (fromDate > toDate) {
                    return false;
                } else if (toDate < today) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).withMessage('Invalid Event End Date'),
        body('fromSlot', 'Event From Slot Required').optional({ checkFalsy: true }).isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format'),
        body('toSlot', 'Event To Slot Required').optional({ checkFalsy: true }).isLength({ min: 1 }).custom(helper.validateTime).withMessage('Invalid Time/Format').custom((value, { req, loc, path }) => {
            if (typeof (value) != "undefined" && typeof (req.body.fromSlot) != "undefined" && req.body.fromSlot != '') {
                if (Date.parse('01/01/2020 ' + value + '') < Date.parse('01/01/2020 ' + req.body.fromSlot)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).withMessage('Invalid To Time Slot'),
        body('playerType', 'Player Type Required').optional({ checkFalsy: true }).isNumeric(),
        body('minAgegroup', 'Minimum Age Group Required').optional({ checkFalsy: true }).isNumeric(),
        body('maxAgegroup', 'Maximum Age Group Required').optional({ checkFalsy: true }).isNumeric(),
        body('registerStartDate', 'Register Open Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate),
        body('registerEndDate', 'Register End Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate).custom((value, { req, loc, path }) => {
            if (typeof (value) != "undefined" && typeof (req.body.registerStartDate) != "undefined" && req.body.registerStartDate != '' && value != '') {
                let strfromdate = req.body.registerStartDate.split('-');
                let newfromDate = strfromdate[2] + '-' + strfromdate[1] + '-' + strfromdate[0];
                let strtodate = value.split('-');
                let newtoDate = strtodate[2] + '-' + strtodate[1] + '-' + strtodate[0];
                let fromDate = new Date(newfromDate);
                let toDate = new Date(newtoDate);
                if (fromDate > toDate) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).withMessage('Invalid Registration End Date'),
        body('venueID', 'Venue Required').optional({ checkFalsy: true }).isNumeric(),
        body('status', 'Status Required').optional({ checkFalsy: true }).isNumeric(),
        body('role', 'Role Required').optional({ checkFalsy: true }).isNumeric(),
    ];

    // View non actio Event
    const nonactioEventViewValidation = [
        body('eventID').isNumeric()
    ];

    // Edit non actio Event
    const nonactioEventUpdateValidation = [
        body('country')
            .isNumeric()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid Country id'),
        body('state')
            .isNumeric()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid State id'),
        body('venue')
            .isString()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid Venue'),
        body('tournament_name')
            .isString({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid tournament name'),
        body('from_date').custom(helper.isValidDate)
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid from_date'),
        body('to_date').custom(helper.isValidDate)
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid to_date'),
        body('event_name').isString().optional({ checkFalsy: true }),
        body('event_sports').isNumeric().optional({ checkFalsy: true }),
        body('eventID').isNumeric(),
        body('tournamentID').isNumeric()
    ];

    const eventControlleAddValidation = [
        body('actual_start_date')
            .custom(helper.isValidDate)
            .withMessage('Please Enter valid Start date'),
        body('actual_start_time')
            .custom(helper.validateTime)
            .withMessage('Please Enter valid Start time'),
        body('playground')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid Playground'),
        body('team_one')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid Team One score'),
        body('team_two')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Please Enter valid Team two score'),
        body('event_id').isNumeric(),
        body('match_schedule_id').isNumeric(),
        body('remarks')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Please Enter remarks'),
    ];

    const eventControlleEditValidation = [
        body('actual_start_date')
            .optional({ checkFalsy: true })
            .custom(helper.isValidDate)
            .withMessage('Please Enter valid Start date'),
        body('actual_start_time')
            .optional({ checkFalsy: true })
            .isString()
            .withMessage('Please Enter valid Start time'),
        body('actual_start_time')
            .optional({ checkFalsy: true })
            .isString()
            .withMessage('Please Enter valid Start time'),
        body('playground')
            .isString()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid Playground'),
        body('team_one')
            .isString()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid Team One score'),
        body('team_two')
            .isString()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter valid Team two score'),
        body('remarks')
            .isString()
            .isLength({ min: 1 })
            .optional({ checkFalsy: true })
            .withMessage('Please Enter remarks'),
        body('event_id').isNumeric(),
        body('match_schedule_id').isNumeric(),
    ];

    const eventControlleSearchValidation = [
        body('event_id').isNumeric(),
        body('match_schedule_id').isNumeric(),
    ];

    const eventControllerDetailValidation = [
        body('event_id').isNumeric().isLength({ min: 1 }),
        body('match_id').isNumeric().isLength({ min: 1 }).optional({ checkFalsy: true }),
    ];

    let addPlayerStatisticsValidation = [
        body('event_id').isNumeric().isLength({ min: 1 }),
        body('match_id').isNumeric().isLength({ min: 1 }),
        body('team_id').isNumeric().isLength({ min: 1 }),
        body('headers').isArray(),
        body('statistics').isArray(),
        body('headers.*').isLength({ min: 1 }),
        body('statistics.*').isLength({ min: 1 })
    ];

    let getPlayerStatisticsValidation = [
        body('team_id'),
        body('match_id').isNumeric().isLength({ min: 1 })
    ];

    let getSpecificPlayerStatisticsValidation = [
        body('team_id').isNumeric().isLength({ min: 1 }),
        body('subscriber_id').isNumeric().isLength({ min: 1 })
    ];

    app.post('/v1/admin/event/master', userAuth, eventController.master);
    app.post('/v1/admin/event/add', userAuth, eventController.create);
    app.post('/v1/admin/event/list', userAuth, listvalidation, eventController.list);
    app.post('/v1/admin/event/edit', userAuth, editValidation, eventController.edit);
    app.post('/v1/admin/nonActioEvent/list', userAuth, eventController.nonActiolist);
    app.post('/v1/admin/nonActioEvent/view', userAuth, nonactioEventViewValidation, eventController.nonActioView);
    app.post('/v1/admin/nonActioEvent/edit', userAuth, nonactioEventUpdateValidation, eventController.nonActioEdit);
    app.post('/v1/admin/eventController/list', userAuth, eventController.eventControllerList);
    app.post('/v1/admin/eventController/add', userAuth, eventController.eventControllerAdd);
    app.post('/v1/admin/eventController/edit', userAuth, eventController.eventControllerEdit);
    app.post('/v1/admin/eventController/getDetails', userAuth, eventControlleSearchValidation, eventController.getEventControllerDetail);
    app.post('/v1/admin/getEventDetails', userAuth, eventControllerDetailValidation, eventController.getEventDetails);
    app.post('/v1/admin/submitEventPlayerStatistics', userAuth, addPlayerStatisticsValidation, eventController.createplayerStatistics);
    app.post('/v1/admin/playerStatistics/get', userAuth, getPlayerStatisticsValidation, eventController.getplayerStatistics);
    app.post('/v1/admin/playerStatistics/getSpecificPlayerStatistics', userAuth, getSpecificPlayerStatisticsValidation, eventController.getSpecificPlayerStatistics);
    //app.post('/v1/admin/playerStatistics/getStatisticsDe',userAuth,eventController.getplayerStatistics);
    app.post('/v1/admin/event/upload', userAuth, eventController.eventUpload);

    app.post('/v1/admin/event/delete',userAuth, eventController.deletedata);
    app.post('/v1/admin/event/editevent',userAuth, eventController.editevent); 

    app.post('/v1/admin/event/eventRegistrationlist', eventController.eventRegistrationlist); 

    
};