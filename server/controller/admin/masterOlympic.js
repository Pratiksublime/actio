const { validationResult } = require('express-validator');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const masterModelOlympic = require('../../model/admin/masterOlympic');
const roleModel = require('../../model/admin/role');

const olympic = async (req, res) => {
    try {
        if (!req.get('requestFrom')) {
            let menuid = req.get('menuID');

            console.log("menuID: ");
            console.log(menuID);
            
            const menuPermission = await commonModel.menuPermission(req.myID, menuid);
            if (!menuPermission) {
                await commonModel.activityLog(log.nopermission.id, log.nopermission.value, req);
                let result = {};
                result.msg = 'User Un-Authorized';
                result.status = process.env.STATUS_401;
                res.status(result.status).send(result);
                return false;
            }
        }
    } catch (err) {
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.olympicInvalid.id, log.olympicInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.olympicInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        const olympic = await masterModelOlympic.olympic(req);
        result.status = process.env.STATUS_200;
        result.logID = log.olympic.id;
        if (olympic.update) {
            result.msg = log.olympic.update;
        } else if (olympic.add) {
            result.msg = log.olympic.add;
        }
        if ('finalData' in olympic) {
            result.details = olympic.finalData
        }
        result.list = olympic.list;
        await commonModel.activityLog(log.olympic.id, log.olympic.value, req);
        res.status(result.status).send(result);
    } catch (err) {

        console.log("err: ");
        console.log(err);
        
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const olympic_list = async (req, res) => {
    
    try {
        const result = {};
        const olympic = await masterModelOlympic.olympic_list(req);
        const details = await masterModelOlympic.olympic_details(req);
        result.status = process.env.STATUS_200;
        result.list = olympic.list;
        result.info = details.info;
        await commonModel.activityLog(log.olympic.id, log.olympic.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err :");
        console.log(err);
        
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const olympic_sport_list = async (req, res) => {
    
    try {
        const result = {};
        const olympic = await masterModelOlympic.olympic_sport_list(req);
        result.status = process.env.STATUS_200;
        result.list = olympic.list;
        result.details = olympic.details;
        await commonModel.activityLog(log.olympic.id, log.olympic.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const olympicTypes = async (req, res) => {
    let result = await masterModelOlympic.olympicTypes();
    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        fields: result
    });
}

const filterVenue = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.olympicInvalid.id, log.olympicInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.olympicInvalid.id, errors: errors.array() });
    }
    let result = await masterModelOlympic.filterVenue(req);
    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        venues: result
    });
}

const searchSubscriber = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.olympicInvalid.id, log.olympicInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.olympicInvalid.id, errors: errors.array() });
    }
    let result = await masterModelOlympic.searchSubscriber(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    });
}

const olympicCreate = async (req, res) => {
    /*const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.olympicInvalid.id, log.olympicInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.olympicInvalid.id, errors: errors.array() });
    }*/

    console.log("olympicCreate: ");

    let result = await masterModelOlympic.olympicCreate(req);

    console.log("olympicCreate req.body.olympic_organizers: +++++++++++++++++++++++++++");
    console.log(req.body.olympic_organizers);


    /*if (req.body.olympic_organizers && typeof req.body.olympic_organizers !=="undefined" typeof req.body.olympic_organizers !== undefined && req.body.olympic_organizers.length > 0) {
        req.body.olympic_organizers.forEach(async (element) => {
            var params = {
                id: req.body.myID,
                subscriberID: element.id,
                roleID: 3,
                menuID: [3, 4, 5, 7, 12, 13, 14],
                validityDate: req.body.olympic_end_date
            }
            await roleModel.submitRole(params);
        });
    }*/

    // return res.send(result)
    res.status(process.env.STATUS_200).send({
        status: (!result) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        message: (result) ? log.olympic.add : 'Something failed !'
    });
}

const details = async (req, res) => {
    console.log("details controller: ");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.olympicInvalid.id, log.olympicInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.olympicInvalid.id, errors: errors.array() });
    }
    let result = await masterModelOlympic.details(req);

    console.log("result: ");
    console.log(typeof result);
    console.log(result);

    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        result: result
    });
}


module.exports = { details, olympic, olympic_list, olympic_sport_list, olympicTypes, filterVenue, searchSubscriber, olympicCreate }