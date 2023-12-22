const { validationResult } = require('express-validator');
const commonModel = require('../../model/common');
const log = require('../../helper/config.json').log.notification;
const notifyModel = require('../../model/notification');

const list = async (req, res) => {
    try {
        const result = {};
        const notification = await notifyModel.getNotify(req);
        result.status = process.env.STATUS_200;
        result.logID = log.getnotify.id;
        result.notification = notification;
        await notifyModel.totalSeen(req);
        await commonModel.activityLog(log.getnotify.id, log.getnotify.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.FCM00.id, log.FCM500.msg);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.FCM00.msg;
        res.status(error.status).send({ status: error.status, logID: log.SP500.id, msg: error.message });
    }
}

const seen = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await commonModel.activityLog(log.seenInvalid.id, log.seenInvalid.value, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.seenInvalid.id, errors: errors.array() });
        }
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.seen.id;
        await notifyModel.seen(req);
        await commonModel.activityLog(log.seen.id, log.seen.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.FCM00.id, log.FCM500.msg);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.FCM00.msg;
        res.status(error.status).send({ status: error.status, logID: log.SP500.id, msg: error.message });
    }
}

module.exports = { list, seen }