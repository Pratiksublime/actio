const { validationResult } = require('express-validator');
const eventModel = require('../../../model/v1/admin/event');
const commonModel = require('../../../model/v1/common');
//const menuID             = process.env.MENU_EVENT;
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log;

const master = async (req, res) => {
    const result = {};
    try {
        await commonModel.activityLog(log.event[1].id, log.event[1].value, req);
        const master = await eventModel.master(req);
        result.status = process.env.STATUS_200;
        result.master = master;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.event[0].id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const create = async (req, res) => {
    /*try {
        await commonModel.activityLog(log.event[2].id, log.event[2].value, req);
        let menuid = req.get('menuID');
        const menuPermission = await commonModel.menuPermission(req.myID, menuid);
        if (!menuPermission) {
            await commonModel.activityLog(log.event[3].id, log.event[3].value, req);
            let result = {};
            result.msg = 'User Un-Authorized';
            result.status = process.env.STATUS_401;
            res.status(result.status).send(result);
            return false;
        }
    } catch (err) {
        console.log(err)
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.event[4].id, log.event[4].value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }*/

    const result = {};
    try {
        const eventImage = [];
        const path = 'images/event/';
        if (req.body.banner && typeof req.body.banner !== undefined && (req.body.banner).length>0) {
            const uploadBanner = helper.uploadBase64(req.body.banner[0], path);
            eventImage.push({ type: "banner", imagePath: uploadBanner.path });
        }
        if(req.body.otherImage && typeof req.body.otherImage !== undefined && (req.body.otherImage).length>0){
            req.body.otherImage.forEach(e => {
                let uploadOther = helper.uploadBase64(e, path);
                eventImage.push({ type: "other", imagePath: uploadOther.path });
            });    
        }
        
        req.body.eventImage = eventImage;
        const add = await eventModel.add(req);
        if (add.id) {
            result.status = process.env.STATUS_200;
            result.msg = 'Event Added Successfully';
            result.event_id = add.id;
            await commonModel.activityLog(log.event[5].id, log.event[5].value, req);
        } else {
            result.status = process.env.STATUS_500;
            result.msg = 'Event Add Failed';
            await commonModel.activityLog(log.event[6].id, log.event[6].value, req);
        }
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ++");
        console.log(err);

        await commonModel.activityLog(log.event[0].id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const list = async (req, res) => {
    const result = {};
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.event[8].id, log.event[8].value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }*/
    try {
        //await commonModel.activityLog(log.event[7].id, log.event[7].value, req);
        const eventlist = await eventModel.list(req);
        result.status = process.env.STATUS_200;
        result.event = eventlist.list;
        result.nearme = eventlist.near;
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.event[0].id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const edit = async (req, res) => {
    /*try {
        await commonModel.activityLog(log.event[9].id, log.event[9].value, req);
        let menuid = req.get('menuID');
        const menuPermission = await commonModel.menuPermission(req.myID, menuid);
        if (!menuPermission) {
            await commonModel.activityLog(log.event[10].id, log.event[10].value, req);
            let result = {};
            result.msg = 'User Un-Authorized';
            result.status = process.env.STATUS_401;
            res.status(result.status).send(result);
            return false;
        }
    } catch (err) {
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.event[11].id, log.event[11].value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }*/
    try {
        let allow = false;
        const allowEdit = await eventModel.allowEdit(req.body.eventID);
        if (typeof allowEdit !== 'undefined' && allowEdit.length > 0 && allowEdit[0].allow == '1') allow = true;
        if (!allow) {
            await commonModel.activityLog(log.event[12].id, log.event[12].value, req);
            let result = {};
            result.msg = 'Not Allowed Edit : Allow to edit before registration start';
            result.status = process.env.STATUS_405;
            res.status(result.status).send(result);
            return false;
        }
        // if ( ( typeof(req.body.registerStartDate) != "undefined" && req.body.registerStartDate != '') || (typeof(req.body.registerEndDate) != "undefined" && req.body.registerEndDate != '') || (typeof(req.body.eventStartDate) != "undefined" && req.body.eventStartDate != '') || (typeof(req.body.eventEndDate) != "undefined" && req.body.eventEndDate != '') ) {
        //     const  validDate=  await eventModel.validDate(req);
        //     let allowDate = false;
        //     if(typeof validDate !== 'undefined' && validDate.length > 0 && validDate[0].allow == '1')allowDate = true;
        //     if(!allowDate)
        //     {
        //         await commonModel.activityLog(log.event[13].id,log.event[13].value,req);
        //         let result = {};
        //         result.msg = 'Invalid Dates';
        //         result.status = process.env.STATUS_405;
        //         res.status(result.status).send(result); 
        //         return false;
        //     }
        // }

        const path = 'images/event/';
        let bannerImage = '';
        //console.log("11111111111111111111111111111");
        //console.log(req.body.banner[0]);
        //console.log("2222222222222222222222222 otherImage ");
        //console.log(req.body.otherImage);


        if (req.body.banner && typeof (req.body.banner) != "undefined" && req.body.banner != '' && req.body.banner.length>0) {

        	console.log("banner if controller ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            const uploadBanner = helper.uploadBase64(req.body.banner[0], path);
            bannerImage = uploadBanner.path;

            

        }

        const eventOtherImage = [];
        if (req.body.otherImage && typeof (req.body.otherImage) != "undefined" && req.body.otherImage.length > 0) {
            req.body.otherImage.forEach(e => {
                let uploadOther = helper.uploadBase64(e, path);
                eventOtherImage.push({ type: "other", imagePath: uploadOther.path });
            });
        }
        //console.log("req.body.bannerImage333333333333333333333333");
        //console.log(req.body.bannerImage);

        req.body.bannerImage = bannerImage;

        console.log("banner if controller bannerImage++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(bannerImage);

        req.body.eventOtherImage = eventOtherImage;
        const result = {};
        const update = eventModel.edit(req);
        result.status = process.env.STATUS_200;
        await commonModel.activityLog(log.event[14].id, log.event[14].value, req);
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ");
        console.log(err);
        await commonModel.activityLog(log.event[0].id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const nonActiolist = async (req, res) => {
    let result = await eventModel.nonActiolist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        list: result
    });
}

const nonActioView = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.nonActioView(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        event: result
    });
}

const nonActioEdit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.nonActioEdit(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Updated successfully !'
    });
}

const eventControllerList = async (req, res) => {
    let result = await eventModel.eventControllerList(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result.data
    });
}

const eventControllerEdit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.eventControllerEdit(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: 'Successfully Updated'
    });
}

const eventControllerAdd = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.eventControllerAdd(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: 'Successfully Added'
    });
}

const getEventControllerDetail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.getEventControllerDetail(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const getplayerStatistics = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.getplayerStatistics(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const createplayerStatistics = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.createplayerStatistics(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully created !'
    });
}

const getEventDetails = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.getEventDetails(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        eventDetails: result
    });
}

const getSpecificPlayerStatistics = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.getSpecificPlayerStatistics(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        eventDetails: result
    });
}

const eventUpload = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = await eventModel.eventUpload(req);
    if (result) {
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_200,
            eventDetails: result,
            msg: "Successfully created.!"
        });
    } else {
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_500,
            eventDetails: result,
            msg: "Event Create failed!"
        });
    }
}

const deletedata = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await eventModel.deletedata(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const editevent = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await eventModel.editevent(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const eventRegistrationlist = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await eventModel.EventRegistrationlist(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

module.exports = {
    getSpecificPlayerStatistics, getEventDetails, createplayerStatistics, getplayerStatistics, getEventControllerDetail, eventControllerAdd,
    eventControllerEdit, master, create, list, edit, nonActiolist, nonActioView, nonActioEdit, eventControllerList, eventUpload,deletedata,editevent,eventRegistrationlist
}