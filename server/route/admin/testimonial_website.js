const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const testimonialWebsiteController = require('../../controller/admin/testimonial_website');

module.exports = (app) => {
    // banner
    app.post('/v1/admin/testimonial_website/insert', testimonialWebsiteController.insert);
    app.post('/v1/admin/testimonial_website/info', testimonialWebsiteController.info);
    app.post('/v1/admin/testimonial_website/update', testimonialWebsiteController.update);
    app.get('/v1/admin/testimonial_website/list',  testimonialWebsiteController.list);
    app.post('/v1/admin/testimonial_website/delete',  testimonialWebsiteController.deletedata);
}