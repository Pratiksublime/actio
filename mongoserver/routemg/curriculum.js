var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/curriculumCont');
const { userAuth } = require('../../server/middleware/auth');

module.exports = (app) => {

   

app.post('/v1/admin/curriculum/add',  addController.Add);

app.get('/v1/admin/curriculum/list',userAuth,  addController.List);
app.post('/v1/admin/curriculum/edit',  addController.Edit);

app.post('/v1/admin/curriculum/update',  addController.Update);
app.post('/v1/admin/curriculum/delete',  addController.Delete);



 

}
