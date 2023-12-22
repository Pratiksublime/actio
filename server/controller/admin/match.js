const matchModel = require('../../model/admin/match');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const { validationResult } = require('express-validator');
const log = require('../../helper/config.json').log.match;

const schedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.scheduleInvalid.id, log.scheduleInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.scheduleInvalid.id, errors: errors.array() });
    }
    try {
        let allow = true;
        const p_error = [];
        req.body.schedule.forEach((e, i) => {
            if (!e.isCustom) {
                if (typeof (e.competitor) == "undefined" || e.competitor == "" || isNaN(e.competitor)) { allow = false; p_error.push({ "param": "schedule[" + i + "].competitor", "msg": "Invalid  competitor" }); }
                if (typeof (e.opponent) == "undefined" || e.opponent == "" || isNaN(e.opponent) || e.competitor == e.opponent) { allow = false; p_error.push({ "param": "schedule[" + i + "].opponent", "msg": "Invalid  opponent" }); }
                if (isNaN(e.matchType)) { allow = false; p_error.push({ "param": "schedule[" + i + "].matchType", "msg": "Invalid  match Type" }); }
                if (typeof (e.venueAsset) == "undefined" || e.venueAsset == "" || isNaN(e.venueAsset)) { allow = false; p_error.push({ "param": "schedule[" + i + "].venueAsset", "msg": "Invalid  Venue Asset" }); }
            }
        });
        if (!allow) {
            await commonModel.activityLog(log.scheduleInvalid.id, p_error, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: p_error });
        }
        const schedule = await matchModel.schedule(req)
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.schedule.id;
        result.msg = log.schedule.msg;
        await commonModel.activityLog(log.schedule.id, log.schedule.value, req);
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.MS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MS500.id, msg: error.message });
    }
}

const getSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.getscheduleInvalid.id, log.getscheduleInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.getscheduleInvalid.id, errors: errors.array() });
    }
    try {
        const schedule = await matchModel.getSchedule(req);
        const result = {};
        result.query = schedule.query;
        result.status = process.env.STATUS_200;
        result.logID = log.getschedule.id;
        let matchdata = [];
        let data = [];
        for (let item of schedule.schedule) {
            if (!data.includes(item.match_date)) {
                let arr = [];
                let splitDate = item.match_date.split('-');
                data.push(item.match_date);
                arr.push(item)
                let obj = {
                    date: item.match_date,
                    ddate: new Date(splitDate[2], +(splitDate[1]) - 1, splitDate[0]),
                    match: arr
                }
                matchdata.push(obj);
            }
            else {
                let idx = matchdata.findIndex((i) => i.date == item.match_date);
                matchdata[idx].match.push(item)
            }
        }
        if (matchdata.length) {
            matchdata = matchdata.sort(function (a, b) {
                return new Date(a.ddate) - new Date(b.ddate);
            });
            for (let item of matchdata) {
                item.match = item.match.sort(function (a, b) {
                    return new Date('1970/01/01 ' + a.from) - new Date('1970/01/01 ' + b.from);
                });
            }
            // match
            // matchModel = matchdata.sort(function(a,b){
            //     return new Date(a.ddate) - new Date(b.ddate);
            // });
        }
        // schedule.schedule.forEach(e => {
        //     if(tdate != "" && tdate != e.match_date)
        //     {
        //         matchdata.push({"date":tdate,"ddate":ddate,"match":data});
        //         data = [];
        //         data.push(e);
        //     }else{
        //         data.push(e);
        //     }
        //     tdate = e.match_date;
        //     ddate = e.mdate;
        // });
        // if(schedule.schedule.length>0)
        // {
        //     matchdata.push({"date":tdate,"ddate":ddate,"match":data});
        // }
        result.schedule = matchdata;
        if (typeof (req.body.master) != "undefined" && req.body.master) {
            result.team = schedule.team;
            result.matchType = schedule.matchType;
            result.venue = schedule.venue;
            result.asset = schedule.asset;
        }
        await commonModel.activityLog(log.getschedule.id, log.getschedule.value, req);
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        console.log(err)
        await commonModel.activityLog(log.MS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MS500.id, msg: error.message });
    }
}

const scheduleDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.detailscheduleInvalid.id, log.detailscheduleInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.detailscheduleInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.detailschedule.id;
        const match = await matchModel.scheduleDetail(req);
        result.match = match;
        await commonModel.activityLog(log.detailschedule.id, log.detailschedule.value, req);
        res.status(result.status).send(result);

    } catch (err) {
        await commonModel.activityLog(log.MS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.MS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.MS500.id, msg: error.message });
    }
}

const insertMatchStatistics = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await matchModel.insertMatchStatistics(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Inserted!'
    });
}

const getMatchStatistics = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await matchModel.getMatchStatistics(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    });
}

module.exports = { getMatchStatistics, insertMatchStatistics, schedule, getSchedule, scheduleDetail };