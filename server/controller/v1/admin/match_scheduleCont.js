//const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const matchModel = require('../../../model/v1/admin/match_schedule');
const helper = require('../../../helper/helper');

const { validationResult } = require('express-validator');



const insert = async (req, res) => {
    let result = await matchModel.insert(req);
    if (result == false) {
        return res.status(process.env.STATUS_400).send({ status: 400, error_type: 'Data not inserted', error_message: result.err })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        my_match: result,
        message: "Successfully...!!"
    });
}



const tournamentlist = async (req, res) => {
    let result = await matchModel.tournamentlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result
    });
}

const eventlist = async (req, res) => {
    let result = await matchModel.eventlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_match: result
    });
}

const playarealist = async (req, res) => {
    let result = await matchModel.playarealist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_match: result
    });
}

const playerslist = async (req, res) => {
    let result = await matchModel.playerslist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_match: result
    });
}


const insertofficials = async (req, res) => {
    let result = await matchModel.insertofficials(req);
    if (result == false) {
        return res.status(process.env.STATUS_201).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        my_match: result
    });
}

const surfacetypelist = async (req, res) => {
    let result = await matchModel.surfacetypelist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_match: result
    });
}

const insertcontrollers = async (req, res) => {

    let result = await matchModel.insertcontrollers(req);








    console.log(' kkkkkkkkkkkkkkkkkk,,,,,,,');
    console.log(result.email);


    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {

            result.isValid = true;
            result.status = process.env.STATUS_200;
            result.msg = 'Success';
            const maildata = {};
            maildata.To = result[i].email;
            maildata.html = "<html><head><title>Email Template</title></head><body><p>You are allotted as match controller for match: <b>"+result[i].match_no+"</b> of event name: <b>"+result[i].event+"</b>.</p><p>To access the match details, enter the following access code: <b>"+result[i].accesscode+"</b>. Using this access code, you are permitted to add a score for this match.</p></body></html>";
            maildata.accesscode = result[i].accesscode;
            maildata.Subject = 'Accesscode ';
            //maildata.html='<h1>Hello!</h1><p>This is an example HTML email.</p>'

            console.log("maildata");
            console.log(maildata);

            await helper.sendMailController(maildata); 

        }
    } else {


        result.isValid = true;
        result.status = process.env.STATUS_200;
        result.msg = 'Success';
        const maildata = {};
        maildata.To = result.email;
        maildata.html = "<html><head><title>Email Template</title></head><body><p>You are allotted as match controller for match: <b>"+result.match_no+"</b> of event name: <b>"+result.event+"</b>.</p><p>To access the match details, enter the following access code: <b>"+result.accesscode+"</b>. Using this access code, you are permitted to add a score for this match.</p></body></html>";
        maildata.accesscode = result.accesscode;
        maildata.Subject = 'Accesscode ';
        //maildata.html='<h1>Hello!</h1><p>This is an example HTML email.</p>'


        console.log("maildata");
        console.log(maildata);

        await helper.sendMailController(maildata);


    }


    if (result == false) {
        return res.status(process.env.STATUS_201).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }


    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        my_match: true
    });
}

const updateController = async (req, res) => {
    const result = await matchModel.updateController(req);
    console.log('Result :: ', result);

    if (result.length > 0) {
        let resultLength = result.length;

        for (i = 0; i < resultLength; i++) {
            result.isValid = true;
            result.status = process.env.STATUS_200;
            result.msg = 'Success';

            const maildata = {
                To: result[i].email,
                html: "<html><head><title>Email Template</title></head><body><p>You are allotted as match controller for match: <b>"+result[i].match_no+"</b> of event name: <b>"+result[i].event+"</b>.</p><p>To access the match details, enter the following access code: <b>"+result[i].accesscode+"</b>. Using this access code, you are permitted to add a score for this match.</p></body></html>",
                accesscode: result[i].accesscode,
                Subject: 'Accesscode'
            };
            console.log("maildata ===> ", maildata);

            await helper.sendMailController(maildata);
        }
    } else {
        result.isValid = true;
        result.status = process.env.STATUS_200;
        result.msg = 'Success';

        const maildata = {
            To: result.email,
            html: "<html><head><title>Email Template</title></head><body><p>You are allotted as match controller for match: <b>"+result.match_no+"</b> of event name: <b>"+result.event+"</b>.</p><p>To access the match details, enter the following access code: <b>"+result.accesscode+"</b>. Using this access code, you are permitted to add a score for this match.</p></body></html>",
            accesscode: result.accesscode,
            Subject: 'Accesscode'
        };
        console.log("maildata ---- \n", maildata);

        await helper.sendMailController(maildata);
    }
}

const insertteam = async (req, res) => {
    let result = await matchModel.insertteam(req);
    if (result == false) {
        return res.status(process.env.STATUS_201).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        my_match: result
    });
}

const insertparticipant = async (req, res) => {
    let result = await matchModel.insertparticipant(req);
    if (result == false) {
        return res.status(process.env.STATUS_400).send({ status: 400, error_type: 'Data not inserted', error_message: result.err })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        my_match: result,
        message: "Successfully...!!"
    });
}

const updateParticipant = async (req, res) => {
    let result = await matchModel.updateParticipant(req);
    if (!result) {
        return res.status(process.env.STATUS_400).send({ status: 400, error_type: 'Data not updated', error_message: result.err })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_201,
        my_match: result,
        message: "Updated Successfully"
    })
}

const update = async (req, res) => {
    let result = await matchModel.update(req);
    if (!result) {
        return res.status(process.env.STATUS_400).send({ status: 400, error_type: 'Data not updated', error_message: result.err })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_201,
        my_match: result,
        message: "Updated Successfully"
    })
}

const list = async (req, res) => {
    let result = await matchModel.list(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result
    });
}

const champlist = async (req, res) => {
    let result = await matchModel.champlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result
    });
}

const matchstructurelist = async (req, res) => {
    let result = await matchModel.matchstructurelist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result
    });
}

const insertpool = async (req, res) => {
    let result = await matchModel.insertpool(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}


const dailymatchlist = async (req, res) => {
    let result = await matchModel.dailymatchlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const deletedata = async (req, res) => {
    let result = await matchModel.deletedata(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const poollist = async (req, res) => {
    let result = await matchModel.poollist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const teampoollist = async (req, res) => {
    let result = await matchModel.teampoollist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const insertsportpoints = async (req, res) => {
    let result = await matchModel.insertsportpoints(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const updateofficials = async (req, res) => {
    let result = await matchModel.updateofficials(req);
console.log("result")
    console.log(result)
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not updated', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}


const sportpointlist = async (req, res) => {
    let result = await matchModel.sportpointlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const sportpointedit = async (req, res) => {
    let result = await matchModel.sportpointedit(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}


const updatesportpoints = async (req, res) => {
    let result = await matchModel.updatesportpoints(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not updated', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const deletesportpoints = async (req, res) => {
    let result = await matchModel.deletesportpoints(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not delete', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const edit = async (req, res) => {
    let result = await matchModel.edit(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const teamlist = async (req, res) => {
    let result = await matchModel.teamlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const updateteam = async (req, res) => {
    let result = await matchModel.updateteam(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}


const teamplayer = async (req, res) => {  

    let result = await matchModel.teamplayer(req); 
    console.log("result............");
    console.log(result);
if(result.length > 0){
for (var j = 0; j < result.length; j++) {
    const htmlContent = `
  <body>
    <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
    <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[j].tournament_name}</div><br>
    <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[j].coachname}</p><br>
    <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[j].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
    <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
       <a href="https://actiosport.com/login?subscriber_id=${result[j].subscriber_id}&event_id=${result[j].event_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a><br>
    <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    

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
}else{
      const htmlContent = `
  <body>
    <div style="top: 274px; left: 383px; width: 62px; height: 57px; background: transparent url('C:\\Users\\Admin\\Downloads') 0% 0% no-repeat padding-box; opacity: 1;" id="abc"><img src="http://3.140.199.19:3000/images/Artworkmail.png" alt="icon"></div><br>
    <div style="top: 349px; left: 383px; width: 581px; height: 77px; font: normal normal bold 30px/32px Kanit; letter-spacing: 0px; color: #B92B1B; text-transform: uppercase; opacity: 1;" id="myHeader">YOU HAVE BEEN INVITED TO PARTICIPATE IN ${result[0].tournament_name}</div><br>
    <p style="height: 0px; font: normal normal medium 25px/34px Exo; letter-spacing: 0px; color: #747474; opacity: 1;" id="devone">Invited by Coach ${result[0].coachname}</p><br>
    <div style="top: 24px; left: 0px; width: 519px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devtwo">Your account has been created with Actio Sport on the request by ${result[0].coachname}. You need to do the verification to receive all the updates and details of the event.</div><br>
    <div style="top: 477px; left: 383px; width: 581px; height: 96px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; text-align: left; opacity: 1; color: #C91103;" id="devthree">**The invitation needs to be accepted within 72 hours.</div><br>
       <a href="https://actiosport.com/login?subscriber_id=${result[0].subscriber_id}&event_id=${result[0].event_id}" style="text-decoration: none;">
      <div style="top: 586px; left: 383px; width: 190px; height: 50px; background: #FBE24C 0% 0% no-repeat padding-box; opacity: 1; padding: 5px 13px; display: inline; line-height: 63px;" id="devfour">
        <t style="top: 599px; left: 404px; width: 144px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #707070; opacity: 1;" id="devfive">Verify and accept</t>
      </div>
    </a><br>
    <div style="top: 24px; left: 0px; width: 143px; height: 24px; font: normal normal medium 18px/24px Exo; letter-spacing: 0px; color: #747474;" id="devsix">Sincerely, Team Actio Sport</div><br>`;

    

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
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        //result
    });
}

const matchstatuslist = async (req, res) => {
    let result = await matchModel.matchstatuslist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}


const updatematchteam = async (req, res) => {
    let result = await matchModel.updatematchteam(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        my_match: result
    });
}

const insertposition = async (req, res) => {
    let result = await matchModel.insertposition(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}


const updateposition = async (req, res) => {
    let result = await matchModel.updateposition(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'not updated', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const deleteposition = async (req, res) => {
    let result = await matchModel.deleteposition(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'not deletedata', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const positionlist = async (req, res) => {
    let result = await matchModel.positionlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}


const matchdateval = async (req, res) => {
    let result = await matchModel.matchdateval(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}

const insertaction = async (req, res) => {
    let result = await matchModel.insertAction(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not inserted', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}


const updateaction = async (req, res) => {
    let result = await matchModel.updateAction(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'not updated', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const deleteaction = async (req, res) => {
    let result = await matchModel.deleteAction(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'not deletedata', error_message: result.error })
    }
    res.status(process.env.STATUS_201).send({
        status: process.env.STATUS_201,
        message: "Successfully...!!",
        result
    });
}

const actionlist = async (req, res) => {
    let result = await matchModel.Actionlist(req);
    if (result == false) {
        return res.status(process.env.STATUS_200).send({ status: 400, error_type: 'Data not Found', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: "Successfully...!!",
        result
    });
}
































module.exports = { insert, tournamentlist, eventlist, playarealist, playerslist, insertofficials, surfacetypelist, insertcontrollers, insertteam, insertparticipant, list, champlist, matchstructurelist, insertpool, dailymatchlist, deletedata, poollist, teampoollist, insertsportpoints, updateofficials, sportpointlist, sportpointedit, updatesportpoints, deletesportpoints, edit, teamlist, updateteam, teamplayer, update, updateParticipant, matchstatuslist, updateController,updatematchteam,insertposition,updateposition,deleteposition,positionlist,matchdateval,insertaction,updateaction,deleteaction,actionlist }