var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/userdata');


module.exports = (app) => {

 





app.post('/v1/admin/userdata/add',addController.Add);
app.get('/v1/admin/userdata/list',addController.List);

app.post('/v1/admin/userdata/edit',addController.Edit);
app.post('/v1/admin/userdata/update',addController.Update);
app.post('/v1/admin/userdata/delete',addController.Delete);



}
