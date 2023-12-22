const profileModel = require('../../model/profile');
const friendsModel = require('../../model/friends');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const { validationResult } = require('express-validator');
const log = require('../../helper/config.json').log.profile;

const master = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.masterInvalid.id, log.masterInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.masterInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        const master = await profileModel.master(req);
        result.status = process.env.STATUS_200;
        result.logID = log.master.id;
        result.master = master;
        await commonModel.activityLog(log.master.id, log.master.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SP500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SP500.msg;
        res.status(error.status).send({ status: error.status, logID: log.SP500.id, msg: error.message });
    }
}

const displayPicture = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.invaliduploadprofile.id, log.invaliduploadprofile.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invaliduploadprofile.id, errors: errors.array() });
    }
    try {
        const result = {};
        req.body.displayPictureName = '';
        if (req.files.displayPicture != null && typeof req.files.displayPicture == 'object') {
            var file = req.files.displayPicture;
            var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var imageName = random + file.name;
            var path = 'images/profile/' + imageName;
            req.body.displayPictureName = path;
            file.mv(path, function (err) { });
        }
        if (req.body.displayPictureName != "") {
            const uploadProfile = await profileModel.uploadProfile(req);
            if (uploadProfile) {
                result.status = process.env.STATUS_200;
                await commonModel.activityLog(log.uploadprofile.id, log.uploadprofile.value, req);
                result.msg = log.uploadprofile.msg;
                result.logID = log.uploadprofile.id;
                result.profile_image = req.body.displayPictureName;
            } else {
                await commonModel.activityLog(log.uploadprofileFailed.id, log.uploadprofileFailed.value, req);
                result.status = process.env.STATUS_TEMP_422;
                result.msg = log.uploadprofileFailed.msg;
                result.logID = log.uploadprofileFailed.id;
            }
        } else {
            await commonModel.activityLog(log.uploadprofileFailed.id, log.uploadprofileFailed.value, req);
            result.status = process.env.STATUS_TEMP_422;
            result.msg = log.uploadprofileFailed.msg;
            result.logID = log.uploadprofileFailed.id;
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SP500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SP500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const profile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.invalidprofile.id, log.invalidprofile.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invalidprofile.id, errors: errors.array() });
    }
    try {
        const result = {};
        const profile = await profileModel.profile(req);
        if (profile) {
            result.status = process.env.STATUS_200;
            result.logID = log.profile.id;
            result.msg = log.profile.msg;
            await commonModel.activityLog(log.profile.id, log.profile.value, req);
        } else {
            result.status = process.env.STATUS_TEMP_422;
            result.logID = log.profilefailed.id;
            result.msg = log.profilefailed.msg;
            await commonModel.activityLog(log.profilefailed.id, log.profilefailed.value, req);
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SP500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SP500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const getprofile = async (req, res) => {
    try {
        const result = {};
        //const profile = await profileModel.getprofile(req.myID);
        const profile = await profileModel.getprofile(req);
        await commonModel.activityLog(log.getprofile.id, log.getprofile.value, req);
        result.status = process.env.STATUS_200;
        result.logID = log.getprofile.id;
        result.profile = profile;
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SP500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SP500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const getmyprofile = async (req, res) => {
    try {
        const result = {};
        const profile = await friendsModel.list(req.myID, req);
        const event = await profileModel.eventAssociated(req.myID);
        delete profile.profile.friends_status;
        await commonModel.activityLog(log.getmyprofile.id, log.getmyprofile.value, req);
        result.status = process.env.STATUS_200;
        result.logID = log.getmyprofile.id;
        result.profile = profile;
        result.event_associated = event;
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SP500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SP500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const changeEmailorPhone = async (req, res) => {
    const result = await profileModel.changeEmailorPhone(req, res);
    if (result == 'resSent') {
        return;
    }
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send(result)
}

module.exports = { displayPicture, master, profile, getprofile, getmyprofile, changeEmailorPhone }