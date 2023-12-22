const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const Model = require('../../../model/v1/website/match_score');





const Add = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.insert(req);

        // console.log("Wesbite: ");
        // console.log(Wesbite);
        

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

const Addplayer = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.insertplayer(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

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

const teamplayerlist = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.teamplayerlist(req);
    result.status = process.env.STATUS_200;
    result.data = [Wesbite]; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message });
}
}

const insertplayerscore = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.insertplayerscore(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

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

const playerscorelist = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.playerscorelist(req);
    result.status = process.env.STATUS_200;
    result.data = Wesbite; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message });
}
}

const palyerstatus = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.palyerstatus(req);
    result.status = process.env.STATUS_200;
    result.data = Wesbite; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message });
}
}

const playerdelete = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.playerdelete(req);
    result.status = process.env.STATUS_200;
    result.data = Wesbite; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message });
}
}

const kpiinsert = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.kpiinsert(req);
    result.status = process.env.STATUS_200;
    result.data = Wesbite; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message });
}
}


const kpiscorelist = async (req, res) => {
    try {
    const result = {};
    const Wesbite = await Model.kpiscorelist(req);

    result.status = process.env.STATUS_200;
    result.data = Wesbite; // Wrap Wesbite in an array
    res.status(result.status).send(result);
} catch (err) {
    const error = {};
    error.status = process.env.STATUS_500;
    error.message = "Something went wrong...!!";
    res.status(error.status).send({ status: error.status, msg: error.message }); 
}
}





module.exports = {  Add,Addplayer ,teamplayerlist,insertplayerscore,playerscorelist,palyerstatus,playerdelete,kpiinsert,kpiscorelist} 