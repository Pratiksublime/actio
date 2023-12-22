const helper = require('../helper/helper');
const chatModel = require('../model/chat');
const chatController = require('../controller/chat');

exports = module.exports = async function (io) {
    const users = [];
    const chatUsers = {};
    // connection init
    io.sockets.on('connection', function (socket) {
        socket.on('shareMessage', async function (data) {
            let date = helper.getdateTime();
            let message = {};
            message.msg = data.msg;
            message.fromID = data.fromID;
            message.type = data.type;
            message.refID = data.refID;
            message.status = "1";
            message.date = date;
            message.imgURL = '';
            data.toID.forEach(async to => {
                message.toID = to.id;
                let touser = to.id + '~' + data.fromID;
                if (touser in chatUsers) {
                    message.status = "2";
                    message.position = "2";
                    chatUsers[touser].emit('receiveMessage', message);
                }
                await chatModel.message(message);
            });
            await chatController.shareMessage(data);
        })

        // Connect user;
        socket.on('connectUser', async function (data) {
            var chatID = data.fromID + '~' + data.toID;
            await chatModel.updatedSeen(data);
            if (chatID !== chatUsers) {
                socket.chatUser = data.fromID + '~' + data.toID;
                chatUsers[socket.chatUser] = socket;
            }
            var readID = data.toID + '~' + data.fromID;
            if (readID in chatUsers) {
                var readData = {
                    fromID: data.toID,
                    toID: data.fromID
                }
                readStatus(readData);
            }
        });

        // Disconnect User
        socket.on('disconnect', function (data) {
            if (!socket.chatUser) return;
            delete chatUsers[socket.chatUser];
        });

        // Read Status
        function readStatus(data) {
            var fromuser = data.fromID + '~' + data.toID;
            chatUsers[fromuser].emit('receiveMessage', { status: 2 });
        }

        // send message
        socket.on('sendMessage', async function (data) {
            let touser = data.toID + '~' + data.fromID;
            let fromuser = data.fromID + '~' + data.toID;
            let date = helper.getdateTime();
            let message = {};
            message.msg = data.message;
            message.fromID = data.fromID;
            message.toID = data.toID;
            message.type = data.type;
            message.status = "1";
            message.date = date;
            message.imgURL = '';
            switch (data.type) {
                case 'image':
                    message.msg = '';
                    message.imgURL = data.imageURL;
                    if (touser in chatUsers) {
                        message.status = "2";
                        message.position = "2";
                        chatUsers[touser].emit('receiveMessage', message);
                    }
                    if (fromuser in chatUsers) {
                        message.position = "1";
                        chatUsers[fromuser].emit('receiveMessage', message);
                    }
                    break;
                case 'text':
                    if (touser in chatUsers) {
                        message.status = "2";
                        message.position = "2";
                        chatUsers[touser].emit('receiveMessage', message);
                    }
                    if (fromuser in chatUsers) {
                        message.position = "1";
                        chatUsers[fromuser].emit('receiveMessage', message);
                    }
                    break;
            }
            await chatModel.message(message);
            await chatController.notification(message);
        });
    });
}