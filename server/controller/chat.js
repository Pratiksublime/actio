const { validationResult } = require('express-validator');
const helper = require('../helper/helper');
const commonModel = require('../model/common');
const subscriberModel = require('../model/subscriber');
const chatModel = require('../model/chat');
const log = require('../helper/config.json').log.chat;

const history = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.historyInvalid.id, log.historyInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.historyInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        const history = await chatModel.history(req);
        result.status = process.env.STATUS_200;
        result.logID = log.history.id;
        result.history = history;
        await commonModel.activityLog(log.history.id, log.history.value, req);
        res.status(result.status).send(result);

    } catch (err) {
        await commonModel.activityLog(log.CHAT500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.CHAT500.msg;
        res.status(error.status).send({ status: error.status, logID: log.CHAT500.id, msg: error.message });
    }
}

const friends = async (req, res) => {
    try {
        const result = {};
        const friends = await chatModel.friends(req.myID, req);
        result.status = process.env.STATUS_200;
        result.logID = log.friends.id;
        result.friends = friends;
        await commonModel.activityLog(log.friends.id, log.friends.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.CHAT500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.CHAT500.msg;
        res.status(error.status).send({ status: error.status, logID: log.CHAT500.id, msg: error.message });
    }
}

const conversation = async (req, res) => {
    try {
        const result = {};
        const conversation = await chatModel.conversation(req);
        result.status = process.env.STATUS_200;
        result.logID = log.conversation.id;
        result.conversation = conversation;
        await commonModel.activityLog(log.conversation.id, log.conversation.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.CHAT500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.CHAT500.msg;
        res.status(error.status).send({ status: error.status, logID: log.CHAT500.id, msg: error.message });
    }
}

const upload = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.uploadInvalid.id, log.uploadInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.uploadInvalid.id, errors: errors.array() });
    }
    try {
        var file = req.files.image;
        var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        var imageName = random + file.name;
        var path = 'images/chat/' + imageName;
        file.mv(path, function (err) { });
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.upload.id;
        result.path = path;
        await commonModel.activityLog(log.upload.id, log.upload.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.CHAT500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.CHAT500.msg;
        res.status(error.status).send({ status: error.status, logID: log.CHAT500.id, msg: error.message });
    }
}

const notification = async (req, res) => {
    try {
        let data = {};
        data.message = req;
        const token = await commonModel.getfcmTokenbyID(req.toID);
        const user = await subscriberModel.getUserbyID(req.fromID);
        let fcmToken = [];
        if (token.status) {
            token.fcmToken.forEach(v => {
                fcmToken.push(v.device_token);
            });
        }
        data.message.name = user.user.full_name;
        data.message.screen = 'chat';
        data.fcmToken = fcmToken;
        if (fcmToken.length > 0) {
            helper.androidFCM(data);
        }
        return true;
    } catch (err) {
        return false;
    }
}

const shareMessage = async (req, res) => {
    try {
        let toID = [];
        req.toID.forEach(to => { toID.push(to.id); });
        const user = await chatModel.shareMessage(toID);
        const from = await subscriberModel.getUserbyID(req.fromID);
        let date = helper.getdateTime();
        let message = {};
        message.msg = req.msg;
        message.fromID = req.fromID;
        message.type = req.type;
        message.refID = req.refID;
        message.status = "1";
        message.date = date;
        message.imgURL = '';
        let data = {};
        data.message = req;
        data.message.name = from.user.full_name;
        user.forEach(e => {
            data.message.toID = e.subscriber_id.toString();
            data.message.screen = 'chat';
            data.fcmToken = e.token;
            if (data.fcmToken.length > 0) {
                helper.androidFCM(data);
            }
        });
    } catch (err) {
        return false;
    }
}

module.exports = { history, friends, conversation, upload, notification, shareMessage }