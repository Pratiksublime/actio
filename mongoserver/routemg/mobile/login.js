var express = require('express');
var router = express.Router();
const loginCont = require('../../controller/mobile/loginCont');


module.exports = (app) => {
    console.log("MONGO ROUTE")
    app.post('/v1/mobile/login', loginCont.loginCall);
    app.post('/v1/mobile/verifyOTP', loginCont.verifyOTP);
}
