const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const performancesport_masterMod = require('../../../model/v1/admin/performancesport_master');

//const commonModel = require('../../model/common');



const addperformancesport= async (req, res) => {
    try {
        const result = {}; 
        const adminsit = await performancesport_masterMod.addperformancesport(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const performancelist = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await performancesport_masterMod.performancelist(req);
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

const performancelist_byid = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await performancesport_masterMod.performancelist_byid(req);
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
const deleteperformancesport= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.deleteperformancesport(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}
const performanceupdatedata= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.performanceupdatedata(req); 
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const addindividualperformance= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.addindividualperformance(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}
const individual_performancebyid= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_performancebyid(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const performanceDelete= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.performanceDelete(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}
const performanceupdate= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.performanceupdate(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const individual_performanceMast= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_performanceMast(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const individual_eventMast= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_eventMast(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const individual_matchlevelMast= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_matchlevelMast(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const individual_stacMast= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_stacMast(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const eventlist= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.eventlist(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const individual_performancelist= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.individual_performancelist(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indimatchlevelMastlist= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indimatchlevelMastlist(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indistacMastlist= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indistacMastlist(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indimatchlevelInfo= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indimatchlevelInfo(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indieventInfo= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indieventInfo(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indistatisticInfo= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indistatisticInfo(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const indiperformanceInfo= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.indiperformanceInfo(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const updatePerformance= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.updatePerformance(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const updateEvent= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.updateEvent(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const updateMatchlavel= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.updateMatchlavel(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const updatestatastic= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.updatestatastic(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const deleteperformance= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.deleteperformance(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const deletevent= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.deletevent(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const deletmatchlevel= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.deletmatchlevel(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}
const deletstatistic= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.deletstatistic(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const listbysubscriberid= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.listbysubscriberid(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const checksportdublicate= async (req, res) => {
    try {
        const result = {};
        const adminsit = await performancesport_masterMod.checksportdublicate(req);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}

const performanceedit= async (req, res) => {
    try {

        const result = {};
        const adminsit = await performancesport_masterMod.performanceeditdada(req);

        console.log(adminsit);
        result.status = process.env.STATUS_200; 
        result.data = adminsit;
       result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    } 
}





 



module.exports = { addperformancesport , performancelist ,performancelist_byid,deleteperformancesport,performanceupdatedata,addindividualperformance,individual_performancebyid,performanceDelete,performanceupdate,individual_performanceMast,individual_eventMast,individual_matchlevelMast ,individual_stacMast,eventlist,individual_performancelist,indimatchlevelMastlist,indistacMastlist,indimatchlevelInfo,indieventInfo,indistatisticInfo,indiperformanceInfo,updatePerformance,updateEvent,updateMatchlavel,updatestatastic,deleteperformance ,deleteperformance,deletevent,deletmatchlevel,deletstatistic,listbysubscriberid,checksportdublicate,performanceedit}
  
