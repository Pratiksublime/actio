const cronModel = require('../../../model/admin/cron');
const helper = require('../../../helper/helper');
var exec = require('child_process').exec;

const subscriberPush = async (req, res) => {
    try {
        const push = await cronModel.getPush();
        if (push.success) {
            push.data.forEach(async e => {
                await cronModel.updatePush(e);
            });
        }
    } catch (err) {
    }
}

const subscriberBulk = async (req, res) => {
    try {
        const bulk = await cronModel.getBulk();
        if (bulk.success) {
            bulk.data.forEach(async e => {
                await helper.welcomeSMS(e);
                await cronModel.createBulk(e);
            });
        }
    } catch (err) {
    }
}

const updateSubscriber = async (req, res) => {
    try {
        const subscriber = await cronModel.getnonSubscriber();
        if (subscriber.success) {
            subscriber.data.forEach(async e => {
                await cronModel.updateSubscriber(e);
            });
        }
    } catch (err) {
    }
}

const menuPermission = async (req, res) => {
    try {
        await cronModel.menuPermission();
    } catch (err) {
    }
}

const registerSMS = async (req, res) => {
    try {
        const players = await cronModel.nonSubscriber();
        players.forEach(async e => {
            await helper.welcomeSMS(e);
            await cronModel.logSMS(e);
        });
    } catch (err) {
    }
}

const registerEmail = async (req, res) => {
    try {
        const players = await cronModel.playerEmail();
        players.forEach(async e => {
            if (e.coach_email_id != "") {
                e.email.push(e.coach_email_id);
            }
            const maildata = {};
            maildata.To = e.email.toString();
            maildata.Content = ' Team :' + e.team_name + ' \n\xA0 Tournament :' + e.tournament_name + ' \n\xA0 Event :' + e.event_name + '\n\xA0 Sports :' + e.sports_name + '\n\xA0 Start Date :' + e.start_date + '\n\xA0 End Date :' + e.end_date + '\n\xA0 From Time :' + e.from_time + '\n\xA0 To Time :' + e.to_time;
            maildata.Subject = 'Registration acknowledgement for Event : ' + e.event_name;
            await helper.sendMail(maildata);
            e.type = process.env.EMAIL_TYPE_AKG;
            await cronModel.logEmail(e);
        });
    } catch (err) {
    }
}

const registerstatusEmail = async (req, res) => {
    try {
        const players = await cronModel.playerEmailStatus();
        players.forEach(async e => {
            if (e.coach_email_id != "") {
                e.email.push(e.coach_email_id);
            }
            let status = 'Confirmed';
            if (e.log_status == 32) {
                status = 'Rejected'
            }
            const maildata = {};
            maildata.To = e.email.toString();
            maildata.Content = ' Team :' + e.team_name + ' \n\xA0 Tournament :' + e.tournament_name + ' \n\xA0 Event :' + e.event_name + '\n\xA0 Sports :' + e.sports_name + '\n\xA0 Start Date :' + e.start_date + '\n\xA0 End Date :' + e.end_date + '\n\xA0 From Time :' + e.from_time + '\n\xA0 To Time :' + e.to_time;
            maildata.Subject = 'Registration has been ' + status + ' for the event : ' + e.event_name;
            await helper.sendMail(maildata);
            e.type = process.env.EMAIL_TYPE_STATUS;
            await cronModel.logEmail(e);
        });
    } catch (err) {
    }
}

const notify = async (req, res) => {
    try {
        const notify = await cronModel.notify();
        let mode;
        if (notify[0] && notify[0].fcm) {
            let fcm = notify[0].fcm[0];
            mode = (fcm) ? fcm.mode : '';
        }
        // console.log((notify.length)? notify[0].fcm:'' )
        notify.forEach(async e => {
            let data = {};
            data.message = {};
            data.message.notifyId = e.notification_id.toString();
            data.message.title = 'ACTIO';
            data.message.from_id = e.from_id.toString();
            data.message.to_id = e.to_id.toString();
            data.message.type = e.message.type.toString();
            data.message.name = e.full_name.toString();
            switch (e.message.type) {
                case 'friend_request':
                    data.message.msg = e.message.msg.toString() + " From " + e.full_name.toString();
                    data.message.screen = e.message.screen.toString();
                    break;
                case 'accept_request':
                    data.message.msg = e.full_name.toString() + " " + e.message.msg.toString();
                    data.message.screen = e.message.screen.toString();
                    break;
                case 'parent_submit':
                    data.message.msg = e.full_name.toString() + " " + e.message.msg.toString();
                    break;
                case 'parent_approve':
                case 'parent_reject':
                    data.message.msg = e.full_name.toString() + " " + e.message.msg.toString();
                    data.message.userStatus = e.message.userStatus;
                    break;
                case 'coach_validate':
                    data.message.msg = e.message.msg.toString();
                    data.message.screen = e.message.screen.toString();
                default:
                    data.message.msg = e.message.msg.toString();
                    break;
            }
            let fcmToken = [];
            e.fcm.forEach(v => {
                fcmToken.push(v.device_token);
            });
            data.fcmToken = fcmToken;
            await cronModel.notifySent(e.notification_id);
            if (fcmToken.length > 0) {
                if (mode == 3) {
                    console.log('Inside mode')
                    helper.iosFCM(data);
                }
                else {
                    helper.androidFCM(data);
                }
            }
        });
    } catch (err) {
        console.log(111, err)
    }
}

const backupDB = async (req, res) => {
    try {
        console.log("Database Backup started");
        exec(`sudo sh /opt/backup/db_backup.sh`, { cwd: '/opt/backup' }, function (error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { subscriberPush, subscriberBulk, updateSubscriber, menuPermission, registerSMS, registerEmail, registerstatusEmail, notify, backupDB }