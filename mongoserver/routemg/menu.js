var express = require('express');
var router = express.Router();
const addController = require('../../mongoserver/controller/admin_md/menu');


module.exports = (app) => {

    



app.post('/v1/admin/menu/add',addController.Add);
app.post('/v1/admin/menu/addmenupermistion',addController.menupermissions);

app.post('/v1/admin/menu/MenuList',addController.MenuList);
app.post('/v1/admin/menu/update',addController.Update);
app.get('/v1/admin/menu/list',addController.List);


}
