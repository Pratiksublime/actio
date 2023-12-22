const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const pModel = require('../../../model/v1/website/performance');




const List = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.performancelist_byid(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const msterList = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.individual_performance_master(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const awardList = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.Awardlist(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}
const clublist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.clublist(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const individualgallerylist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.individualgallerylist(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}
const individualvideoslist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.individualvideoslist(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const yearlist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await pModel.yearlist(req);
        

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}




module.exports = { List,msterList,awardList ,clublist,individualgallerylist,individualvideoslist,yearlist}