const feedModel = require('../model/feed');
const commonModel = require('../model/common');
const helper = require('../helper/helper');
const { validationResult } = require('express-validator');
const log = require('../helper/config.json').log.feed;

const feed = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.feedInvalid.id, log.feedInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.feedInvalid.id, errors: errors.array() });
    }
    try {
        req.body.isRemove = (req.body.isRemove == 'true');
        if (req.files && req.files.image != null && typeof req.files.image == 'object') {
            var file = req.files.image;
            var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var imageName = random + file.name;
            var path = 'images/feed/' + imageName;
            req.body.imageName = path;
            file.mv(path, function (err) { });
        }
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.feed.id;
        const feed = await feedModel.feed(req);
        if (feed) {
            if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove) {
                result.msg = log.feed.delete;
            } else if (typeof (req.body.feedID) != "undefined" && req.body.feedID != "") {
                result.msg = log.feed.update;
            } else {
                result.msg = log.feed.add;
            }
        } else {
            result.msg = log.feed.failed;
        }
        await commonModel.activityLog(log.feed.id, result.msg, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.NF500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.NF500.msg;
        res.status(error.status).send({ status: error.status, logID: log.NF500.id, msg: error.message });
    }
}

const list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.feedlistInvalid.id, log.feedlistInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.feedlistInvalid.id, errors: errors.array() });
    }
    try {
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.feedlist.id;
        const list = await feedModel.list(req);
        result.master = list.feedmaster;
        result.list = list.list;
        await commonModel.activityLog(log.feedlist.id, result.msg, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.NF500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.NF500.msg;
        res.status(error.status).send({ status: error.status, logID: log.NF500.id, msg: error.message });
    }
}

module.exports = { feed, list }