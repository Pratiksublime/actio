var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var tournamentController = require('../../../controller/v1/website/tournamentController.js');

module.exports = (app) => {
    // banner
    app.post('/v1/website/upcomingList', tournamentController.upcomingList);
    app.get('/v1/website/pastList', tournamentController.pastList);
    app.post('/v1/website/withoutPastList', tournamentController.withoutPastList);
    app.get('/v1/website/detailsList',  tournamentController.detailsList);
    app.get('/v1/website/championList',  tournamentController.championList)
}
