const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
//const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const masterModel = require('../../../model/v1/admin/master');
const roleModel = require('../../../model/v1/admin/role');

const tournament = async (req, res) => {
    /*try {
        if (!req.get('requestFrom')) {
            let menuid = req.get('menuID');
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
    }*/

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.tournamentInvalid.id, log.tournamentInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.tournamentInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        console.log('jjjjjjjjjjjj99999');
        const tournament = await masterModel.tournament(req);
        result.status = process.env.STATUS_200;
        result.logID = log.tournament.id;
        if (tournament.update) {
            result.msg = log.tournament.update;
        } else if (tournament.add) {
            result.msg = log.tournament.add;
        }
        if ('finalData' in tournament) {
            result.details = tournament.finalData
        }
        result.list = tournament.list;
        await commonModel.activityLog(log.tournament.id, log.tournament.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MAS500.id, msg: error.message });
    }
}

const tournamentTypes = async (req, res) => {
    let result = await masterModel.tournamentTypes();
    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        fields: result
    });
}

const filterVenue = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.tournamentInvalid.id, log.tournamentInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.tournamentInvalid.id, errors: errors.array() });
    }
    let result = await masterModel.filterVenue(req);
    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        venues: result
    });
}

const searchSubscriber = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.tournamentInvalid.id, log.tournamentInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.tournamentInvalid.id, errors: errors.array() });
    }
    let result = await masterModel.searchSubscriber(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    });
}

const tournamentCreate = async (req, res) => {
    /*const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.tournamentInvalid.id, log.tournamentInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.tournamentInvalid.id, errors: errors.array() });
    }*/
    
    let result = await masterModel.tournamentCreate(req);
    if (req.body.tournament_organizer.length > 0) {
        req.body.tournament_organizer.forEach(async (element) => {
            var params = {
                id: req.myID,
                subscriberID: element.id,
                roleID: 3,
                menuID: [3, 4, 5, 7, 12, 13, 14],
                validityDate: req.body.tournament_end_date
            }
            await roleModel.submitRole(params);
        });
    }
    // return res.send(result)
    res.status(process.env.STATUS_200).send({
        status: (!result) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        message: (result) ? log.tournament.add : 'Something failed !'
    });
}

const details = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.tournamentInvalid.id, log.tournamentInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.tournamentInvalid.id, errors: errors.array() });
    }
    let result = await masterModel.details(req);
    res.status(process.env.STATUS_200).send({
        status: (!result || Object.keys(result).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        result: result
    });
}
const currency = async (req, res) => {
    try {
        const result = {};
        const matchInfo = await masterModel.currency(req);
        result.status = process.env.STATUS_200;
        result.message = "successfully......"
        result.data = matchInfo;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

module.exports = { details, tournament, tournamentTypes, filterVenue, searchSubscriber, tournamentCreate,currency }