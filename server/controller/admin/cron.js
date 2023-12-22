const cronModel = require('../../model/admin/cron');
const db = require('../../db');
const matchModel = require('../../model/v1/admin/match_schedule');
const helper = require('../../helper/helper');
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

const teamplayerEmail = async (req, res) => {
    try {
        console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');


        let result = {};

       teamid= "SELECT DISTINCT(p.player_email) FROM registration_player p WHERE  p.status = 1 and p.player_email  NOT IN ( SELECT a.email_id FROM subscriber a WHERE a.status = 1)";

        

        let teamdata = await db.query(teamid);

        let palyerdada = teamdata.rows;

        console.log("regemailwwwwwwwwwwwwwwwwwwwwwww");
        console.log(palyerdada);

 for (var i = 0; i < palyerdada.length; i++) {
     
 


            result.isValid = true;
            result.status = 200; 
            result.msg = 'Success';
            const maildata = {};
            maildata.To = palyerdada[i].player_email; 
            maildata.Content = 'register before 24 hr:'; 
           
            maildata.Subject = 'remember';
            

            console.log("maildata");
            console.log(maildata);

             await helper.remembersendMail(maildata);
            //i.type = process.env.EMAIL_TYPE_STATUS;
            //await cronModel.logEmail(i);

        }

                
    } 
    catch (err) {

        console.log(err);
    }
}


const teamplayerexpired = async (req, res) => {
   try {

    console.log('4444444444444444444444444444444444444444444444444444444444');
  const moment = require('moment');

  // Get the current date
  const currentDate = moment();

  // Subtract 72 hours from the current date
  const expirationDate = moment().subtract(72, 'hours');

  // Convert the dates to the desired format
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
  const formattedExpirationDate = expirationDate.format('YYYY-MM-DD HH:mm:ss');

  // Update the registration_status of expired records
  const updateQuery = `UPDATE registration_player SET registration_status = 3  WHERE status = 1 and created_at < '${formattedExpirationDate}'`;

  console.log("updateQuery:", updateQuery);

  // Execute the update query using your database connection or ORM
  await db.query(updateQuery);

  // Send email or perform other actions
  //await helper.remembersendMail(maildata);
  
} catch (err) {
  console.log(err);
}

}

const sendreminder = async (req, res) => {
   try {

  console.log('4444444444444444444444444444444444444444444444444444444444');

  
var result = {};

let notifyStr = "SELECT rp.id,rp.team_id,rp.player_name,rp.player_email,r.register_name,t.tournament_name,r.subscriber_id,r.event_id from registration_player as rp left join registration as r on r.id = rp.team_id left join tournament as t on t.id = r.tournament_id  WHERE rp.player_email = '"+req.body.player_email+"' and rp.id= "+req.body.id+" ";
console.log('eeeeeeeeeeeeeeeeeeeeeee');

  
console.log(notifyStr);
        
        const notify = await db.query(notifyStr);
        players = notify.rows;

  // const players = await cronModel.sendreminder();
   console.log('rrrrrrrrr');

console.log(players)

        players.forEach(async e => {
            // if (e.coach_email_id != "") {
            //     e.email.push(e.coach_email_id);
            // }

             var htmlContent = `
                <body>
                    <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
                    <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${e.tournament_name}</div><br>
                    <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${e.register_name}</p><br>
                    <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${e.register_name}. You need to do the verification to receive all the updates and details of the event.</div><br>
                    <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
                     <a href="https://actiosport.com/login?subscriber_id=${e.subscriber_id}&event_id=${e.event_id}&team_id=${e.team_id}" style="text-decoration: none;">
              <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
                <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
              </div>
            </a>
                    <br>
                    <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;
           


            result.isValid = true;
            result.status = 200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = e.player_email;  
            maildata.html = htmlContent;

            maildata.Subject = 'Actio Sport';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);

            res.status(result.status).send(result);


            
        });
         //result.status = process.env.STATUS_200;
        //result.data = result;
        //res.status(result.status).send(result);
 
}
        
  // Send email or perform other actions
  //await helper.remembersendMail(maildata);
  
 catch (err) {
  console.log(err);
}

}


 

module.exports = { subscriberPush, subscriberBulk, updateSubscriber, menuPermission, registerSMS, registerEmail, registerstatusEmail, notify, backupDB,teamplayerEmail,teamplayerexpired,sendreminder }