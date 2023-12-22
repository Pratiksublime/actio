const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const registrationModel = require('../../../model/v1/website/registration');
const db = require('../../../db');

const insert = async (req, res) => {
    try {
        //const result = {};


        let result = await registrationModel.insert(req);


        






if(result.length > 0){
for (var j = 0; j < result.length; j++) {

    let subdata = `SELECT id from subscriber WHERE email_id =  '${result[j].email}'`;

    console.log('subdata........................'); 
    console.log(subdata)

      let datainfo = await db.query(subdata); 

      console.log('datainfo.222222222222222222222222222222222222222.......................'); 
    console.log(datainfo.rows.length)

      if(datainfo.rows.length > 0){




         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[j].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[j].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[j].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login?subscriber_id=${result[j].subscriber_id}&event_id=${result[j].event_id}&team_id=${result[j].team_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>
            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }
    else{

        var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[j].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[j].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[j].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>
            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;
    }

            result.isValid = true;
            result.status = 200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = result[j].email; 
            maildata.html = htmlContent;

            maildata.Subject = 'Actio Sport';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);
        }
    }
    else{



let subdata = `SELECT id from subscriber WHERE email_id =  ${result[0].email}`;

    console.log('subdata........................'); 
    console.log(subdata)

      let datainfo = await db.query(subdata); 

      if(datainfo.length >0){

         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[0].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[0].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[0].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login?subscriber_id=${result[0].subscriber_id}&event_id=${result[0].event_id}&team_id=${result[0].team_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>

            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }

    else{

         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[0].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[0].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[0].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>

            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }

            result.isValid = true;
            result.status = 200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = result[0].email; 
            maildata.html = htmlContent;

            maildata.Subject = 'Actio Sport';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);
    }

        result.status = process.env.STATUS_200;
        result.data = result;
        res.status(result.status).send(result);
    } catch (err) {

        console.log(err);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}
const singleplayer = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await registrationModel.singleplayer(req);
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const eventfilter = async (req, res) => {
    try {

        console.log('dcfds....');

        const result = {};
        const Wesbite = await registrationModel.eventfilter(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const rolelist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await registrationModel.rolelist(req);
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

// const yearlist = async (req, res) => {
//     try {
//         const result = {};
//         const Wesbite = await registrationModel.Yearlist(req);
        
// console.log('Wesbite,.........')
//         console.log(Wesbite)
//         result.status = process.env.STATUS_200;
//         result = Wesbite;

//         console.log('result,.........')
//         console.log(result)
//         res.status(result.status).send(result);
//     } catch (err) {
//         const error = {};
//         error.status = process.env.STATUS_500;
//         error.message = "something wen't wrong...!!" 
//         res.status(error.status).send({ status: error.status, msg: error.message });  
//     }
// }

const yearlist = async (req, res) => {
    try {
        const result = {};

        let listStrd = "SELECT distinct DATE_PART('Year', tournament_date) as year FROM individual_performance WHERE sport_id = "+req.body.sport_id+" and subscriber_id = "+req.body.subscriber_id+"" ; 
        console.log('dataResult');
        console.log(listStrd);
        let dataResult = await db.query(listStrd);  
        dataResult = dataResult.rows;
        //const Wesbite = await registrationModel.Yearlist(req); 
        

        result.status = process.env.STATUS_200;
        result.data = dataResult;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const qualificationstatus = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await registrationModel.qualificationstatus(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });  
    }
}

const Listdata = async (req, res) => {
    try {
        console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.Listdata(req);
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}
const updatesubscriber = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.updatesubscriber(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const registrationbysublid = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.registrationbysublid(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}
const demo = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.demo(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}

const registrationinfo = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.subscriberinfo(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}

const subscribermatchlist = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.subscribermatchlist(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}


const registrationstatus = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.registrationstatus(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}
// const update = async (req, res) => {
//     try {


//         //console.log('jfddf.........')
//         const result = {};
//         const Wesbite = await registrationModel.update(req); 
//         result.status = process.env.STATUS_200;
//         result.data = Wesbite;
//         res.status(result.status).send(result);
//     } catch (err) {
//         const error = {};
//         error.status = process.env.STATUS_500;
//         error.message = "something wen't wrong...!!" 
//         res.status(error.status).send({ status: error.status, msg: error.message }); 
//     }
// }

const update = async (req, res) => {
    try {
        //const result = {};


        let result = await registrationModel.update(req);


        






if(result.length > 0){
for (var j = 0; j < result.length; j++) {

    let subdata = `SELECT id from subscriber WHERE email_id =  '${result[j].email}'`;

    console.log('subdata........................'); 
    console.log(subdata)

      let datainfo = await db.query(subdata); 

      console.log('datainfo.222222222222222222222222222222222222222.......................'); 
    console.log(datainfo.rows.length)

      if(datainfo.rows.length > 0){




         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[j].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[j].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[j].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login?subscriber_id=${result[j].subscriber_id}&event_id=${result[j].event_id}&team_id=${result[j].team_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>
            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }
    else{

        var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[j].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[j].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[j].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>
            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;
    }

            result.isValid = true;
            result.status = 200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = result[j].email; 
            maildata.html = htmlContent;

            maildata.Subject = 'Actio Sport';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);
        }
    }
    else{



let subdata = `SELECT id from subscriber WHERE email_id =  ${result[0].email}`;

    console.log('subdata........................'); 
    console.log(subdata)

      let datainfo = await db.query(subdata); 

      if(datainfo.length >0){

         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[0].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[0].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[0].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login?subscriber_id=${result[0].subscriber_id}&event_id=${result[0].event_id}&team_id=${result[0].team_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>

            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }

    else{

         var htmlContent = `
        <body>
            <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
            <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[0].tournament_name}</div><br>
            <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[0].coachname}</p><br>
            <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[0].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
            <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
             <a href="https://actiosport.com/login" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a>

            <br>
            <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    }

            result.isValid = true;
            result.status = 200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = result[0].email; 
            maildata.html = htmlContent;

            maildata.Subject = 'Actio Sport';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);
    }

        result.status = process.env.STATUS_200;
        result.data = result;
        res.status(result.status).send(result);
    } catch (err) {

        console.log(err);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });   
    }
}



const pastregistrationbysublid = async (req, res) => {
    try {
        //console.log('jfddf.........')
        const result = {};
        const Wesbite = await registrationModel.pastregistrationbysublid(req); 
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!" 
        res.status(error.status).send({ status: error.status, msg: error.message }); 
    }
}

const mongoinser = async (req, res) => {
      try {
        console.log('req.body:--------------------------', req);
        const result = {};

        // Call your model function (mongoinser) and pass the request body
        const websiteData = await registrationModel.mongoinser(req);
        console.log('websiteData:========================', websiteData);
 
        result.status = process.env.STATUS_200;
        result.data = websiteData;

        res.status(result.status).send(result);
    } catch (err) {
        console.error('An error occurred:', err);

        const error = {
            status: process.env.STATUS_500,
            message: "Something went wrong...!!"
        };

        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}











module.exports = { mongoinser,insert ,eventfilter,singleplayer,rolelist,yearlist,qualificationstatus,Listdata,updatesubscriber,demo,registrationbysublid,registrationinfo,subscribermatchlist,registrationstatus,update,pastregistrationbysublid}