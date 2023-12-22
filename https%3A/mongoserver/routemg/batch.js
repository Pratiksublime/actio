var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/batchCont');

module.exports = (app) => {

   

app.post('/v1/admin/batch/add',  addController.Add);

app.get('/v1/admin/batch/batchlist',  addController.Batchlist);

app.post('/v1/admin/batch/edit',  addController.Edit);
app.post('/v1/admin/batch/update',  addController.Update);
app.post('/v1/admin/batch/delete',  addController.Delete);
app.post('/v1/admin/batch/playerlistbyid',  addController.playerlistbyid);
 

}
