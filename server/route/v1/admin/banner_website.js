const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const bannerWebsiteController = require('../../../controller/v1/admin/banner_website');

module.exports = (app) => {
    // banner
    app.post('/v1/admin/banner_website/insert', bannerWebsiteController.insert);
    app.post('/v1/admin/banner_website/info', bannerWebsiteController.info);
    app.post('/v1/admin/banner_website/update', bannerWebsiteController.update);
    app.get('/v1/admin/banner_website/list',  bannerWebsiteController.list);
    app.post('/v1/admin/banner_website/delete',  bannerWebsiteController.deletedata);
}