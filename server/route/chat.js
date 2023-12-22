const { body } = require('express-validator');
const { userAuth } = require('../middleware/auth');
const chatController = require('../controller/v1/chat');

module.exports = (app) => {
    const historyValidation = [
        body('friendID', 'Friend ID Required').isNumeric()
    ];

    const uploadValidation = [
        body('image')
            .custom((value, { req, loc, path }) => {
                if (req.files) {
                    if (req.files.image) {
                        let t_file = req.files.image.mimetype;
                        t_file = t_file.split('/');
                        if (t_file[0] == 'image') {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }).withMessage('Image Required'),
    ];

    app.post('/v1/chat/history', userAuth, historyValidation, chatController.history);
    app.post('/v1/chat/friends', userAuth, chatController.friends);
    app.post('/v1/chat/conversation', userAuth, chatController.conversation);
    app.post('/v1/chat/upload', userAuth, uploadValidation, chatController.upload);
}