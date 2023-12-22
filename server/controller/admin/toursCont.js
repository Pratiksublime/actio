const { validationResult } = require('express-validator');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const toursModel = require('../../model/admin/toursMod');


const insert = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.insert(req);
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

const list = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.list(req);
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

const info = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.info(req);
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

const update = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.update(req);
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

const deletedata = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.deletedata(req);
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

const master = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.master(req);
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

const tours_presentation = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.tours_presentation(req);
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

const tours_presentation_update = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.tours_presentation_update(req);
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
const tours_presentation_info = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.tours_presentation_info(req);
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

const tourtypeMst = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await toursModel.tourtypeMst(req);
        
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
const tourtypeselect = async (req, res) => {
   
    let result = await toursModel.tourtypeselect(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const toursdownloads = async (req, res) => {
   
    let result = await toursModel.tours_downloads(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const tourstypeinfo = async (req, res) => {
   
    let result = await toursModel.tourtypeinfo(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const tourtypeupdate = async (req, res) => {
   
    let result = await toursModel.tourtypeupdate(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}

const tourtypedelete = async (req, res) => {
   
    let result = await toursModel.tourtypedelete(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}
const tours_downloadsinfo = async (req, res) => {
   
    let result = await toursModel.tours_downloadsinfo(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}
const tours_deletealltoursdata = async (req, res) => {
   
    let result = await toursModel.deletetoursdata(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}



const citylist = async (req, res) => {
   
    let result = await toursModel.citylist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}
const countrylist = async (req, res) => {
   
    let result = await toursModel.countrylist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}
const statelist = async (req, res) => {
   
    let result = await toursModel.statelist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        data: result
    });
}


module.exports = { insert ,list,info,update,deletedata ,master,tours_presentation,tours_presentation_update,tours_presentation_info,tourtypeMst,tourtypeselect,toursdownloads,tourstypeinfo,tourtypeupdate,tourtypedelete,tours_downloadsinfo,tours_deletealltoursdata,citylist,countrylist,statelist}