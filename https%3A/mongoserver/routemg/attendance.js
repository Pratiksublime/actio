var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/attendance');

module.exports = (app) => {

   

app.post('/v1/admin/attendance/add',  addController.Add);
app.get('/v1/admin/attendance/list',addController.List);

 app.post('/v1/admin/attendance/edit',addController.Edit);

// app.post('/v1/admin/attendance/addleveldata',addController.AddLeveldata);


}
