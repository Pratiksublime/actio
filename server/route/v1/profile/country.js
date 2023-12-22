var express = require('express');
var router = express.Router();
var countryV1Controller= require('./../../../../src/controllers/v1/admin/countryController.js');
const auth = require('./../../../../src/config/auth');
const cache = require('./../../../../src/helper/cache.js');

//router.get('/list',auth.verifyToken, countryV1Controller.List);

router.get('/list', countryV1Controller.List);

router.post('/add', countryV1Controller.Add);

router.post('/info',countryV1Controller.Edit);

router.post('/update', countryV1Controller.Update);

router.post('/delete', countryV1Controller.Delete);

module.exports = router;