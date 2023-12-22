var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/master');


module.exports = (app) => {

 
app.get('/v1/admin/master/designationlist',addController.designationlist);
app.get('/v1/admin/master/sportlist',addController.sportslist);
app.post('/v1/admin/master/addsport',addController.Add);
app.post('/v1/admin/master/updatesport',addController.Updatesport);
app.post('/v1/admin/master/adddesignation',addController.Adddesignation);
app.post('/v1/admin/master/updatedesignation',addController.Updatedesignation);

app.post('/v1/admin/master/sportdelete',addController.sportdelete);
app.post('/v1/admin/master/desdelete',addController.designationdelete);

app.post('/v1/admin/master/addinput',addController.Inputmaster);
app.get('/v1/admin/master/listinput',addController.Inputmasterlist);




app.get('/v1/admin/master/headerlist',addController.Headerlist);


}
