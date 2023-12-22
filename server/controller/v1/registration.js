const helper = require('../../helper/helper');
const { validationResult } = require('express-validator');
const registrationModel = require('../../model/registration');
const commonModel = require('../../model/common');
const log = require('../../helper/config.json').log.registration;

const master = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.masterInvalid.id, log.masterInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }

    const result = {};
    try {
        await commonModel.activityLog(log.master.id, log.master.value, req);
        const master = await registrationModel.master(req);
        result.status = process.env.STATUS_200;
        result.master = master;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const playerSearch = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.playerInvalid.id, log.playerInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        await commonModel.activityLog(log.player.id, log.player.value, req);
        const player = await registrationModel.player(req);
        result.status = process.env.STATUS_200;
        result.search = player.search;
        result.player = player.player;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const join = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.joinInvalid.id, log.joinInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        let allow = true;
        //const allowRegistration = await registrationModel.allowRegistration(req);
        //if(typeof allowRegistration !== 'undefined' && allowRegistration.allow == '0')allow = false;
        if (typeof req.body.registrationID != 'undefined' && req.body.registrationID != '') allow = true;
        if (!allow) {
            await commonModel.activityLog(log.joinMax.id, log.joinMax.value, req);
            let result = {};
            result.msg = 'Reached Maximum Number of Team Registration';
            result.status = process.env.STATUS_TEMP_422;
            res.status(process.env.STATUS_422).send(result);
            return false;
        }
        if (req.body.uploadStatus == 1) {
            if (req.files && req.files.logo) {
                var file = req.files.logo;
                var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                var imageName = random + file.name;
                var path = 'images/registration/' + imageName;
                req.body.logo = path;
                file.mv(path, function (err) { });
            }
        }
        else if (req.body.uploadStatus == 0) {
            req.body.logo = '';
        }

        const register = await registrationModel.join(req);
        if (register.id) {
            await commonModel.activityLog(log.join.id, log.join.value, req);
            result.status = process.env.STATUS_200;
            result.msg = 'Submit Successfully';
            result.registrationID = register.id;
        } else {
            await commonModel.activityLog(log.joinFail.id, log.joinFail.value, req);
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'Submit Failed';
        }
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const addPlayers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.addInvalid.id, log.addInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        let allow = true;
        const p_error = [];
        const p_id = []; const p_com_key = []; const p_dob = []; const p_gender = [];
        let log_status = process.env.REG_LOG_21;
        const existsPlayer = await registrationModel.existsPlayer(req);
        const event = await registrationModel.event(req);
        existsPlayer.forEach(e => {
            if (e.subscriber_id) {
                p_id.push(e.subscriber_id);
            } else {
                log_status = process.env.REG_LOG_22;
            }
            p_com_key.push(e.full_name.trim().toLowerCase() + '-' + e.dob + '-' + e.isd_code + '-' + e.mobile_number + '-' + e.email);
            p_gender.push(e.gender_id.toString());
        });
        let p_age = '';
        req.body.players.forEach(async e => {
            if (e.id != '') {
                p_id.push(e.id);
            } else {
                log_status = process.env.REG_LOG_22;
            }
            p_com_key.push(e.name.trim().toLowerCase() + '-' + e.dob + '-' + e.isdCode + '-' + e.mobileNumber + '-' + e.email);
            p_gender.push(e.gender.toString());
            p_age = await helper.getAge(e.dob);
            if (event.min_age > p_age || p_age > event.max_age) {
                p_error.push({ "player": e.name.trim(), "age": p_age, "msg": "Players age must be between " + event.min_age + " and " + event.max_age }); allow = false;
            }
        });

        if (p_com_key.length < event.min_member_per_team || p_com_key.length > event.max_member_per_team) {
            p_error.push({ "nofplayer": p_com_key.length, "msg": "Total number of players needed for the event was " + event.min_member_per_team + " to " + event.max_member_per_team }); allow = false;
        }
        let u_id = await helper.hasDuplicates(p_id);
        let u_com_key = await helper.hasDuplicates(p_com_key);
        let u_gender = p_gender.filter((v, i, a) => a.indexOf(v) === i);
        if (event.player_type_id == 4 && u_gender.length < 2) {
            //p_error.push({"msg":"Must need Mixed Gender"});allow=false;
        } else if (event.player_type_id != 4 && (u_gender.length > 1 || event.player_type_id != u_gender[0])) {
            p_error.push({ "msg": "Mismatch in Gender" }); allow = false;
        }
        if (!u_id) { p_error.push({ "msg": "Players Have Duplicate ID" }); allow = false; }
        if (!u_com_key) { p_error.push({ "msg": "Players Have Duplicate Composite values" }); allow = false; }
        if (!allow) {
            await commonModel.activityLog(log.addInvalid.id, p_error, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: p_error });
        }
        req.body.logStatus = log_status;
        const addPlayers = await registrationModel.addPlayers(req);
        if (addPlayers) {
            await commonModel.activityLog(log.addPlayers.id, log.addPlayers.value, req);
            result.status = process.env.STATUS_200;
            result.msg = 'Submit Successfully';
        } else {
            await commonModel.activityLog(log.addFailed.id, log.addFailed.value, req);
            result.status = process.env.STATUS_422;
            result.msg = 'Submit Failed';
        }
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const list = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.listInvalid.id, log.listInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    try {
        let menuid = req.get('menuID');
        const menuPermission = await commonModel.menuPermission(req.myID, menuid);
        if (!menuPermission) {
            await commonModel.activityLog(log.listMenu.id, log.listMenu.value, req);
            let result = {};
            result.msg = 'User Un-Authorized';
            result.status = process.env.STATUS_401;
            res.status(result.status).send(result);
            return false;
        }
    } catch (err) {
    }
    const result = {};
    try {
        const list = await registrationModel.list(req);
        result.status = process.env.STATUS_200;
        if (typeof (req.body.master) != "undefined" && req.body.master !== null && req.body.master) {
            const master = await registrationModel.listmaster(req);
            result.master = master;
        }
        await commonModel.activityLog(log.list.id, log.list.value, req);
        result.list = list;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const view = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.viewInvalid.id, log.viewInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        await commonModel.activityLog(log.view.id, log.view.value, req);
        const view = await registrationModel.view(req);
        result.status = process.env.STATUS_200;
        result.view = view;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const editPlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.editInvalid.id, log.editInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        const p_error = []; let allow = true;
        const event = await registrationModel.event(req);
        if (typeof (req.body.dob) != "undefined" && req.body.dob != '') {
            let p_age = await helper.getAge(req.body.dob);
            if (event.min_age > p_age || p_age > event.max_age) {
                p_error.push({ "player": req.body.name.trim(), "age": p_age, "msg": "Players age must be between " + event.min_age + " and " + event.max_age }); allow = false;
            }
        }
        if (typeof (req.body.gender) != "undefined" && req.body.gender != '' && event.player_type_id != 4 && event.player_type_id != req.body.gender) {
            p_error.push({ "msg": "Mismatch in Gender" }); allow = false;
        }
        if (!allow) {
            await commonModel.activityLog(log.editInvalid.id, p_error, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: p_error });
        }
        await commonModel.activityLog(log.editPlayer.id, log.editPlayer.value, req);
        await registrationModel.editPlayer(req);
        result.status = process.env.STATUS_200;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const submit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.submitInvalid.id, log.submitInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }

    const result = {};
    try {
        let allow = true;
        const p_error = [];
        const p_id = []; const p_com_key = []; const p_dob = []; const p_gender = [];
        let log_status = process.env.REG_LOG_21;
        const existsPlayer = await registrationModel.existsPlayer(req);
        const event = await registrationModel.event(req);
        const e_player = []; let v_edit = false;
        if (typeof (req.body.editPlay) != "undefined" && req.body.editPlay !== null && req.body.editPlay) {
            v_edit = true;
            req.body.editPlayers.forEach(async e => {
                e_player[e.pid] = e;
            });
        }
        let e_subscriber_id = ""; let e_full_name = ""; let e_dob = ""; let e_isd_code = ""; let e_mobile_number = ""; let e_gender_id = "";
        existsPlayer.forEach(e => {
            e_subscriber_id = e.subscriber_id;
            e_full_name = e.full_name;
            e_dob = e.dob;
            e_isd_code = e.isd_code;
            e_mobile_number = e.mobile_number;
            e_gender_id = e.gender_id;
            e_email = e.email_id;
            if (v_edit && e_player[e.id] != "undefined" && e_player[e.id] != "" && e_player[e.id] != null) {
                if (typeof (e_player[e.id].id) != "undefined" && e_player[e.id].id != "") { e_subscriber_id = e_player[e.id].id; }
                if (typeof (e_player[e.id].name) != "undefined" && e_player[e.id].name != "") { e_full_name = e_player[e.id].name; }
                if (typeof (e_player[e.id].dob) != "undefined" && e_player[e.id].dob != "") { e_dob = e_player[e.id].dob; }
                if (typeof (e_player[e.id].isdCode) != "undefined" && e_player[e.id].isdCode != "") { e_isd_code = e_player[e.id].isdCode; }
                if (typeof (e_player[e.id].mobileNumber) != "undefined" && e_player[e.id].mobileNumber != "") { e_mobile_number = e_player[e.id].mobileNumber; }
                if (typeof (e_player[e.id].gender) != "undefined" && e_player[e.id].gender != "") { e_gender_id = e_player[e.id].gender; }
                if (typeof (e_player[e.id].email) != "undefined" && e_player[e.id].email != "") { e_email = e_player[e.id].email; }
            }

            if (typeof (req.body.removePlayers) != "undefined") {
                if (!req.body.removePlayers.includes(e.id)) {
                    if (e_subscriber_id) {
                        p_id.push(e_subscriber_id);
                    } else {
                        log_status = process.env.REG_LOG_22;
                    }
                    p_com_key.push(e_full_name.trim().toLowerCase() + '-' + e_dob + '-' + e_isd_code + '-' + e_mobile_number + '-' + e_email);
                    p_gender.push(e_gender_id.toString());
                }
            } else {
                if (e_subscriber_id) {
                    p_id.push(e_subscriber_id);
                } else {
                    log_status = process.env.REG_LOG_22;
                }
                p_com_key.push(e_full_name.trim().toLowerCase() + '-' + e_dob + '-' + e_isd_code + '-' + e_mobile_number + '-' + e_email);
                p_gender.push(e_gender_id.toString());
            }
        });

        if (typeof (req.body.addPlay) != "undefined" && req.body.addPlay !== null && req.body.addPlay) {
            let p_age = '';
            req.body.players.forEach(async e => {
                if (e.id != '') {
                    p_id.push(e.id);
                } else {
                    log_status = process.env.REG_LOG_22;
                }
                p_com_key.push(e.name.trim().toLowerCase() + '-' + e.dob + '-' + e.isdCode + '-' + e.mobileNumber + '-' + e.email);
                p_gender.push(e.gender.toString());
                p_age = await helper.getAge(e.dob);
                if (event.min_age > p_age || p_age > event.max_age) {
                    p_error.push({ "player": e.name.trim(), "age": p_age, "msg": "Players age must be between " + event.min_age + " and " + event.max_age }); allow = false;
                }
            });
        }

        if (p_com_key.length < event.min_member_per_team || p_com_key.length > event.max_member_per_team) {
            p_error.push({ "nofplayer": p_com_key.length, "msg": "Total number of players needed for the event was " + event.min_member_per_team + " to " + event.max_member_per_team }); allow = false;
        }
        let u_id = await helper.hasDuplicates(p_id);
        let u_com_key = await helper.hasDuplicates(p_com_key);
        let u_gender = p_gender.filter((v, i, a) => a.indexOf(v) === i);
        if (event.player_type_id == 4 && u_gender.length < 2) {
            // p_error.push({"msg":"Must need Mixed Gender"});allow=false;
        } else if (event.player_type_id != 4 && (u_gender.length > 1 || event.player_type_id != u_gender[0])) {
            p_error.push({ "msg": "Mismatch in Gender" }); allow = false;
        }
        if (!u_id) { p_error.push({ "msg": "Players Have Duplicate ID" }); allow = false; }
        if (!u_com_key) { p_error.push({ "msg": "Players Have Duplicate Composite values" }); allow = false; }
        if (!allow) {
            await commonModel.activityLog(log.submitInvalid.id, p_error, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: p_error });
        }
        if (typeof (req.body.logStatus) == "undefined") {
            req.body.logStatus = log_status;
        }
        const submit = await registrationModel.submit(req);
        await commonModel.activityLog(log.submit.id, log.submit.value, req);
        result.status = process.env.STATUS_200;
        result.msg = "Submitted Successfully";
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const nonSubscriber = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.submitInvalid.id, log.submitInvalid.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        const subscriber = await registrationModel.nonSubscriber(req);
        result.status = process.env.STATUS_200;
        result.subscriber = subscriber;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.RE500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.RE500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

module.exports = { master, playerSearch, join, addPlayers, list, view, editPlayer, submit, nonSubscriber }