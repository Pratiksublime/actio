var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/superadmin');
//const auth = require('../../mongoserver/config/auth')
const { userAuth } = require('../../server/middleware/auth');

module.exports = (app) => {

    

app.post('/v1/admin/adminaccount/add', addController.Add);
app.post('/v1/admin/adminaccount/edit',  addController.Edit);
app.post('/v1/admin/adminaccount/update',  addController.Update);
app.get('/v1/admin/adminaccount/list',userAuth,addController.list);
app.post('/v1/admin/adminaccount/delete',addController.Delete);

app.post('/v1/admin/adminaccount/addlevel',addController.Add_Level);

app.post('/v1/admin/adminaccount/addformdata',addController.AddFormdata);

app.post('/v1/admin/adminaccount/superadminlogin',addController.superadminlogin);

app.get('/v1/admin/adminaccount/superadminlist',userAuth,addController.superadminList);



}
