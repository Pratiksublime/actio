const commonModel = require('../../model/common');
const log = require('../../helper/config.json').log.dashboard;
const dashboardModel = require('../../model/dashboard');

const count = async (req, res) => {
    try {
        const result = {};
        const count = await dashboardModel.count(req);
        result.status = process.env.STATUS_200;
        result.logID = log.count.id;
        result.chat = count.chat;
        result.notifi = count.notifi;
        result.modules = count.modules;
        await commonModel.activityLog(log.count.id, log.count.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.DAS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.DAS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.DAS500.id, msg: error.message });
    }
}

const listModule = async (req, res) => {
    const list = await dashboardModel.listModule();
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        list: list
    });
}

module.exports = { count, listModule };