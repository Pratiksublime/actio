var express = require('express');
var router = express.Router();
var cityV1Controller= require('../../controllers/v1/profile/cityController.js');

router.get('/list', cityV1Controller.List);

/*router.post('/add', cityV1Controller.Add);

router.post('/info',cityV1Controller.Edit);

router.post('/update', cityV1Controller.Update);

router.post('/delete', cityV1Controller.Delete);*/

module.exports = router;