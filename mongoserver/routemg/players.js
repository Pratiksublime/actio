var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/playersCont');
const { userAuth } = require('../../server/middleware/auth');

module.exports = (app) => {

   

app.post('/v1/admin/player/add',  addController.Add);

app.get('/v1/admin/player/list', userAuth, addController.List);
app.post('/v1/admin/player/edit',  addController.Edit);

app.post('/v1/admin/player/update',  addController.Update);
app.post('/v1/admin/player/delete',  addController.Delete);



 

}
