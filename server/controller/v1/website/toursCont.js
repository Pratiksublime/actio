const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const Model = require('../../../model/v1/website/toursMod');




const List = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.list(req);

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


const tourtype = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.tourtype(req);

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


const ToursInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursInfo(req);

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


const ToursDocumentsInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursDocumentsInfo(req);

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


const ToursDownloadsInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursDownloadsInfo(req);

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


const ToursExclustionsInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursExclustionsInfo(req);

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


const ToursGalleryInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursGalleryInfo(req);

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
const ToursvideoInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursvideoInfo(req);

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



const ToursInclutionsInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursInclutionsInfo(req);

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


const ToursIternaryInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursIternaryInfo(req);

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


const ToursPresentationInfo = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.ToursPresentationInfo(req);

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

const locationList = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.locationList(req);

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

const tourtypeList = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.tourtypeList(req);

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

module.exports = { List ,tourtype, ToursInfo, ToursDocumentsInfo, ToursDownloadsInfo, ToursExclustionsInfo, ToursGalleryInfo,ToursvideoInfo, ToursInclutionsInfo, ToursIternaryInfo, ToursPresentationInfo,locationList,tourtypeList};