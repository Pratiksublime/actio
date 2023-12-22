var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/levelCont');
const { userAuth } = require('../../server/middleware/auth');

module.exports = (app) => {

   

app.post('/v1/admin/level/add',  addController.Add);

app.get('/v1/admin/level/list', userAuth, addController.List);
app.post('/v1/admin/level/MenuList',  addController.MenuList);
app.post('/v1/admin/level/update',  addController.Update);

app.post('/v1/admin/level/delete',  addController.delete);
app.post('/v1/admin/level/edit',  addController.Edit);
 

}
