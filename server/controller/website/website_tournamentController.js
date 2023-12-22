const { validationResult } = require('express-validator');
const commonModel = require('../../model/v1/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const websiteTournamentModel = require('../../model/v1/website/website_tournament_model');

const insert = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.insert(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
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
        const tournamentWesbite = await websiteTournamentModel.update(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const UpcomingList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.UpcomingList(req);

        console.log("UpcomingList tournamentWesbite: ");
        console.log(tournamentWesbite);
        console.log(typeof tournamentWesbite);

        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const PastListNew = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.PastListNew(req);

        console.log("PastListNew tournamentWesbite: ");
        console.log(tournamentWesbite);
        console.log(typeof tournamentWesbite);

        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const UpcomingListNew = async (req,res)=>{
try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.UpcomingListNew(req);

        console.log("UpcomingList tournamentWesbite: ");
        console.log(tournamentWesbite);
        console.log(typeof tournamentWesbite);

        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const pastList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.pastList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const withoutPastList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.withoutPastList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const countList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.countList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const detailsList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.detailsList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const info = async (req, res) => {
    console.log("banner website controller info")
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.info(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ");
        console.log(err);

        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const Eventlist = async (req, res) => {
    try {
        const result = {};
        const eventlist = await websiteTournamentModel.eventlist(req);
        result.status = process.env.STATUS_200;
        result.data = eventlist;
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ");
        console.log(err);

        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const championList = async (req, res) => {
    try {

        console.log("controller");
        console.log("result/////////////");
         //console.log(req);
        const result = {};
        const championWesbite = await websiteTournamentModel.championList(req);
        result.status = process.env.STATUS_200;
        result.data = championWesbite;

        
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const Tournamentlist_bychamp = async (req, res) => {
    try {
        const result = {};
        const Tournamentlist = await websiteTournamentModel.tournamentlist_bychamp(req);
        result.status = process.env.STATUS_200;
        result.data = Tournamentlist;
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ");
        console.log(err);

        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const sportList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.sportList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const locationList = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.locationtList(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}



const detailsListNew = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.detailsListNew(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}
/*const delete = async (req, res) => {
    try {
        const result = {};
        const tournamentWesbite = await websiteTournamentModel.delete(req);
        result.status = process.env.STATUS_200;
        result.data = tournamentWesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}*/


module.exports = { insert, update, UpcomingList, pastList, withoutPastList,countList, detailsList, info ,Eventlist,championList,Tournamentlist_bychamp,sportList,locationList,UpcomingListNew,PastListNew,detailsListNew }