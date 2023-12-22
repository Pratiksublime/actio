var express = require('express');
var router = express.Router();
var controller = require('../../controller/website/sub_sportsController.js');
// const auth = require('./../../../src/config/auth');

router.get('/list', controller.List);
router.post('/add', controller.Add);
router.post('/getinfo', controller.Edit);
router.post('/update', controller.Update);
router.post('/delete', controller.Delete);

module.exports = router;