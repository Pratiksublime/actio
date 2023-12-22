const friendsModel = require('../../model/friends');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const { validationResult } = require('express-validator');
const log = require('../../helper/config.json').log.friends;
const Notifylog = require('../../helper/config.json').log.notification;
const notificationmodel = require('../../model/notification');
const profileModel = require('../../model/profile');

const find = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.findInvalid.id, log.findInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.findInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        const find = await friendsModel.find(req);
        result.status = process.env.STATUS_200;
        result.logID = log.find.id;
        result.find = find;
        await commonModel.activityLog(log.find.id, log.find.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.FR500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.FR500.msg;
        res.status(error.status).send({ status: error.status, logID: log.FR500.id, msg: error.message });
    }
}

const action = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.actionInvalid.id, log.actionInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.actionInvalid.id, errors: errors.array() });
    }
    try {
        const action = await friendsModel.action(req);
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.action.id;
        let notification = {};
        notification.from = req.myID;
        notification.to = req.body.friendID;
        notification.message = {};
        if (action) {
            switch (req.body.actionID) {
                case "1":
                case 1:
                    result.msg = log.action.add;
                    notification.message.msg = Notifylog.msg.friend_request;
                    notification.message.screen = Notifylog.type.friend_request;
                    notification.message.icon = Notifylog.icon.friend_request;
                    notification.message.type = 'friend_request';
                    await notificationmodel.create(notification, req);
                    break;
                case "2":
                case 2:
                    result.msg = log.action.approve;
                    notification.message.msg = Notifylog.msg.accept_request;
                    notification.message.screen = Notifylog.type.accept_request;
                    notification.message.icon = Notifylog.icon.accept_request;
                    notification.message.type = 'accept_request';
                    await notificationmodel.create(notification, req);
                    break;
                case "4":
                case 4:
                    result.msg = log.action.reject;
                    break;
                case "5":
                case 5:
                    result.msg = log.action.unfriend;
                    break;
                default:
                    break;
            }

        } else {
            result.msg = log.action.failed;
        }
        await commonModel.activityLog(log.action.id, log.action.msg, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.FR500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.FR500.msg;
        res.status(error.status).send({ status: error.status, logID: log.FR500.id, msg: error.message });
    }
}

const list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.listInvalid.id, log.listInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.listInvalid.id, errors: errors.array() });
    }
    try {
        const list = await friendsModel.list(req.body.friendID, req);
        const event = await profileModel.eventAssociated(req.body.friendID);
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.list.id;
        result.profile = list.profile;
        result.list = list.list;
        result.event_associated = event;
        await commonModel.activityLog(log.list.id, log.list.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.FR500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.FR500.msg;
        res.status(error.status).send({ status: error.status, logID: log.FR500.id, msg: error.message });
    }
}

module.exports = { find, action, list }