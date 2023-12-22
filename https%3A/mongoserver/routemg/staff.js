var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/staffCont');

module.exports = (app) => {

   

app.post('/v1/admin/staff/add',  addController.Add);

app.get('/v1/admin/staff/list',  addController.List);
app.post('/v1/admin/staff/update',  addController.Update);

app.post('/v1/admin/staff/delete',  addController.delete);
app.post('/v1/admin/staff/edit',  addController.Edit);

app.get('/v1/admin/staff/listbycoach',  addController.Listbycoach);


}
