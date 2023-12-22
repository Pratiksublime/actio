const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const venueModel = require('../../../model/v1/admin/venue');

const venue = async (req, res) => {
    // try {
    //     let menuid = req.get('menuID');
    //     const menuPermission = await commonModel.menuPermission(req.myID, menuid);
    //     if (!menuPermission) {
    //         await commonModel.activityLog(log.nopermission.id, log.nopermission.value, req);
    //         let result = {};
    //         result.msg = 'User Un-Authorized';
    //         result.status = process.env.STATUS_401;
    //         res.status(result.status).send(result);
    //         return false;
    //     }
    // } catch (err) {
    // }

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     await commonModel.activityLog(log.venueInvalid.id, log.venueInvalid.value, req);
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.venueInvalid.id, errors: errors.array() });
    // }
    try {

        console.log("2222222222222222222222222222222");
        const venueImage = [];
        let path = 'images/venue/';
        req.body.venueImage.forEach(e => {
            let uploadVenue = helper.uploadBase64(e, path);
            venueImage.push({ type: "venue", imagePath: uploadVenue.path });
        });
        req.body.venueImages = venueImage;
        path = 'images/asset/';
        let key = 0;
        req.body.playArea.forEach(asset => {
            let assetImage = [];
            asset.images.forEach(e => {
                let uploadAsset = helper.uploadBase64(e, path);
                assetImage.push({ type: "asset", index: key, imagePath: uploadAsset.path });
            });
            key++;
            asset.imagePath = assetImage;
        });
        //req.body.assetImages = assetImage; 
        const result = {};
        const venue = await venueModel.venue(req);
        if (!venue) {
            throw Error;
        }
        result.status = process.env.STATUS_200;
        result.logID = log.venue.id;
        if (typeof (req.body.venueID) != "undefined" && req.body.venueID != "") {
            result.msg = log.venue.update;
        } else {
            result.msg = log.venue.add;
        }
        await commonModel.activityLog(log.venue.id, log.venue.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const list = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await commonModel.activityLog(log.venueListInvalid.id, log.venueListInvalid.value, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.venueListInvalid.id, errors: errors.array() });
        }
        const result = {};
        const venue = await venueModel.list(req);
        result.status = process.env.STATUS_200;
        result.logID = log.venuelist.id;
        result.list = venue;
        await commonModel.activityLog(log.venuelist.id, log.venuelist.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const master = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await commonModel.activityLog(log.venuemasterInvalid.id, log.venuemasterInvalid.value, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.venuemasterInvalid.id, errors: errors.array() });
        }
        const result = {};
        const master = await venueModel.master(req);
        result.status = process.env.STATUS_200;
        result.logID = log.venuemaster.id;
        result.master = master;
        await commonModel.activityLog(log.venuemaster.id, log.venuemaster.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const venueStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.venueStatusInvalid.id, log.venueStatusInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.venueStatusInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        await venueModel.venueStatus(req);
        result.status = process.env.STATUS_200;
        result.logID = log.venueStatus.id;
        await commonModel.activityLog(log.venueStatus.id, log.venueStatus.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const deletedata = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await venueModel.deletedata(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

module.exports = { venue, list, master, venueStatus,deletedata }