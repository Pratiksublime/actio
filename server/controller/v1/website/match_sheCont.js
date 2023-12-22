const { validationResult } = require('express-validator');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const matchModel = require('../../../model/v1/website/match');

    
    const accesscodeList = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.accesscodedata(req);
        

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

const matchlisbyid = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.matchlisbyid(req);
        

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



const poollist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.poollist(req);
        

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


const eventlist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.eventinfo(req);
        

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

const insertteamscore = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.insertteamscore(req);
        

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

const kpilist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.kpilist(req);
        

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

const matchilistdetails = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.matchilistdetails(req);
        

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

const insermatchhighlights = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.insermatchhighlights(req);
        

        result.status = process.env.STATUS_201;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const insermatchimages = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.insermatchimages(req);
        

        result.status = process.env.STATUS_201;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const leaderboardlist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.leaderboardlist(req);
        

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

const imglist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.imglist(req);
        

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


const updatematchstatistics = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.updatematchstatistics(req);
        

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


const inserststzero = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.inserststzero(req);
        

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
const statisticslist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.statisticslist(req);
        

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


const deletematchimg = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.deletematchimg(req);
        

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

const matchhighlightslist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await matchModel.matchhighlightslist(req);
        

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








module.exports = { accesscodeList ,matchlisbyid,poollist,eventlist,insertteamscore,kpilist,matchilistdetails,insermatchhighlights,insermatchimages,leaderboardlist,imglist,updatematchstatistics,inserststzero,statisticslist,deletematchimg,matchhighlightslist};