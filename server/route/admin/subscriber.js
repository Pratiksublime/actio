
const subscriberController = require('../../controller/admin/subscriber');
const { body } = require('express-validator');
const auth = require('../../middleware/auth');


module.exports = (app) => {
    //push
    const pushValidation = [
        body().isArray(),
        body('*.fullName', 'Name must be with in 5 to 100 Characters').isLength({ min: 5, max: 100 }),
        body('*.isdCode', 'ISD Code be with in 1 to 10 Characters').isLength({ min: 1, max: 10 }),
        body('*.mobileNumber', 'Mobile must be number and 10 digits').isNumeric().isLength({ min: 10, max: 10 }),
    ]

    const bulkValidation = [
        body().isArray(),
        body('*.fullName', 'Name must be with in 5 to 100 Characters').isLength({ min: 5, max: 100 }),
        body('*.isdCode', 'ISD Code be with in 1 to 10 Characters').isLength({ min: 1, max: 10 }),
        body('*.mobileNumber', 'Mobile must be number and 10 digits').isNumeric().isLength({ min: 10, max: 10 }),
        body('*.emailID', 'Invalid Email ID').isEmail(),
        body('*.dob', 'DOB must be in DD/MM/YYYY format').custom(isValidDate),
        body('*.idType', 'ID type must be number and with in 10 digits').isNumeric().isLength({ min: 1, max: 10 }),
        body('*.idNumber', 'ID Number required and with in 1 to 50 Characters').isLength({ min: 1, max: 50 }),
        body('*.userName', 'User name must ber with in 5 to 100 Characters').isLength({ min: 5, max: 100 }),
        body('*.password', 'Password must be with in 5 to 50 Characters').isLength({ min: 5, max: 50 }),
    ]

    function isValidDate(value) {
        try {
            let strdate = value.split('/');
            let newDate = strdate[2] + '-' + strdate[1] + '-' + strdate[0];
            if (!newDate.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

            const date = new Date(newDate);
            if (!date.getTime()) return false;
            if (date.toISOString().slice(0, 10) === newDate) return value;
        } catch (err) {
            return false;
        }
    }

    //Bulk Upload Verified Data auth.userAuth
    app.post('/v1/admin/subscriber/push', auth.userAuth, pushValidation, subscriberController.push);
    app.post('/v1/admin/subscriber/bulk', auth.userAuth, bulkValidation, subscriberController.bulk);
    app.post('/v1/admin/subscriber/updateProfile', auth.userAuth, subscriberController.updateProfile);
    app.post('/v1/admin/subscriber/updateSportsProfile', auth.userAuth, subscriberController.updateSportsProfile);
    app.post('/v1/admin/subscriber/getSportsProfile', auth.userAuth, subscriberController.getSportsProfile);
    app.post('/v1/admin/subscriber/updateProfessionProfile', auth.userAuth, subscriberController.updateProfessionProfile);
    app.post('/v1/admin/subscriber/getProfessionProfile', auth.userAuth, subscriberController.getProfessionProfile);
    app.post('/v1/admin/subscriber/updateProfileViewPublic', auth.userAuth, subscriberController.updateProfileViewPublic);
    app.post('/v1/admin/subscriber/updateMyTeams', auth.userAuth, subscriberController.updateMyTeams);
    app.post('/v1/admin/subscriber/getMyTeams', auth.userAuth, subscriberController.getMyTeams);
    app.post('/v1/admin/subscriber/getViewPublic', auth.userAuth, subscriberController.getViewPublic);
    app.post('/v1/admin/subscriber/updateHighlightedVideos', auth.userAuth, subscriberController.updateHighlightedVideos);
    app.post('/v1/admin/subscriber/updateHighlightedgallery', auth.userAuth, subscriberController.updateHighlightedgallery);
    app.post('/v1/admin/subscriber/getHighlightedgallery', auth.userAuth, subscriberController.getHighlightedgallery);
    app.post('/v1/admin/subscriber/getHighlightedVideos', auth.userAuth, subscriberController.getHighlightedVideos);
    app.post('/v1/admin/subscriber/updateMySponsor', auth.userAuth, subscriberController.updateMySponsor);
    app.post('/v1/admin/subscriber/getMySponsor', auth.userAuth, subscriberController.getMySponsor);
    app.post('/v1/admin/subscriber/updateEducationProfile', auth.userAuth, subscriberController.updateEducationProfile);
    app.post('/v1/admin/subscriber/getEducationProfile', auth.userAuth, subscriberController.getEducationProfile);
    app.post('/v1/admin/subscriber/updateProfileTraffic', auth.userAuth, subscriberController.updateProfileTraffic);
    app.post('/v1/admin/subscriber/getProfileTraffic', auth.userAuth, subscriberController.getProfileTraffic);
    app.post('/v1/admin/subscriber/updateCompanyProfile', auth.userAuth, subscriberController.updateCompanyProfile);
    app.post('/v1/admin/subscriber/getCompanyProfile', auth.userAuth, subscriberController.getCompanyProfile);
    app.post('/v1/admin/subscriber/updateMySports', auth.userAuth, subscriberController.updateMySports);
    app.post('/v1/admin/subscriber/getMySports', auth.userAuth,subscriberController.getMySports);
    app.post('/v1/admin/subscriber/MySportslist', auth.userAuth,subscriberController.MySportslist);
    app.post('/v1/admin/subscriber/tournamentlist', auth.userAuth,subscriberController.Mytournamentlist); 
    app.post('/v1/admin/subscriber/eventlist_byid', auth.userAuth,subscriberController.Myeventlist_byid);

    app.post('/v1/admin/subscriber/subscriberdelete',subscriberController.deletesubscriberdata);


    
    
    // app.post('/v1/admin/subscriber/get',auth.userAuth,subscriberController.getCompanyProfile);
    // getProfileTraffic 
};