const { validationResult } = require('express-validator');
const roleModel = require('../../model/admin/role');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.role;

const init = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.Invalidinit.id, log.Invalidinit.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.Invalidinit.id, errors: errors.array() });
    }
    try {
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
        const role = await roleModel.init(req);
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.init.id;
        result.user = role.user;
        result.role = role.role;
        result.menu = role.menu;
        await commonModel.activityLog(log.init.id, log.init.value, req);
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.ROLE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.ROLE500.msg;
        res.status(error.status).send({ status: error.status, logID: log.ROLE500.id, msg: error.message });
    }
}

const submit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.invalidpermission.id, log.invalidpermission.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invalidpermission.id, errors: errors.array() });
    }
    try {
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
        await roleModel.submit(req);
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.permission.id;
        result.msg = log.permission.msg;
        await commonModel.activityLog(log.permission.id, log.permission.value, req);
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.ROLE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.ROLE500.msg;
        res.status(error.status).send({ status: error.status, logID: log.ROLE500.id, msg: error.message });
    }
}

module.exports = { init, submit }