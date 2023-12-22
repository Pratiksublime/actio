const request = require('postman-request');
//let jsonData = require('../../log.json');
const nodemailer = require('nodemailer');
const db = require('../db');
const mime = require('mime');
const TeleSignSDK = require('telesignsdk');
const twilio = require('twilio');
const client = new twilio('AC7a5bfc85fa41d7a8d54419f3c1ea9aad', '7b79b0ea6e41aac36e7e21077f86e162');

'use strict';

const fs = require('fs');
const log = async (req, res) => {
    try {
        let logStr = "INSERT INTO log (type,log) values('" + req.type + "','" + JSON.stringify(req.log) + "')";
        await db.query(logStr);
        return true;
    } catch (err) {
        return false;
    }
}

const logError = async (req, res) => {
    try {
        /*fs.readFile('log.json', 'utf8', function readFileCallback(err, data){
            if (err){
            } else {
            obj = JSON.parse(data);  
            obj.error.push(req);  
            json = JSON.stringify(obj);  
            fs.writeFile('log.json', json, (err) => {});
        }});*/
        return true;
    } catch (err) {
        return false;
    }
}

const sendSMS = (data) => {
    try{
      //const client = require('twilio')(accountSid, authToken);
      client.messages
        .create({
           body: data.message,
           from: '+14097109182',
           to: data.mobileNumber
         })
        .then(message => console.log('message.sid---'));
    }
    catch(err){
       console.log(err);
    }
}

const sendSMS_old = async (data, callback) => {
    try {
        if (data.mobileNumber && (data.mobileNumber.substring(0, 3) != '+91')) {
            teleSignSendSms(data.mobileNumber, data.message)
            return;
        }
        let Key = encodeURI('mVe2aWCU954-5jMJaAz7eJEll8EsGi1fohvDqlezOO');
        let number = encodeURI(data.mobileNumber);
        let sender = encodeURI('Adiish');
        let message = encodeURIComponent(data.message);
        let urlstr = 'apikey=' + Key + '&numbers=' + number + '&sender=' + sender + '&message=' + message;

        
        const url = 'http://api.textlocal.in/send/?' + urlstr;
        const logdata = {};
        logdata.type = 'sms';
        logdata.log = {};
        logdata.log.mobileNumber = data.mobileNumber;
        logdata.log.message = data.message;
        await log(logdata);
        callback('', url);
        request({ url: url }, (err, res) => {
            if (err) {
                console.log(err)
            }
            console.log(res)
            callback('', res.body);
        })
    } catch (err) {
        console.log(err)
    }
}

const teleSignSendSms = (phoneNumber, message) => {
    const customerId = process.env.telesign_customer_id;
    const apiKey = process.env.telesign_api_key;
    const rest_endpoint = "https://rest-api.telesign.com";
    const timeout = 10 * 1000; // 10 secs
    const client = new TeleSignSDK(customerId,
        apiKey,
        rest_endpoint,
        timeout
    );
    const messageType = "ARN";
    client.sms.message(teleSignMessageCallback, phoneNumber, message, messageType);
}

const teleSignMessageCallback = (error, responseBody) => {
    if (error === null) {
        console.log(`Messaging response for messaging phone number` +
            ` => code: ${responseBody['status']['code']}` +
            `, description: ${responseBody['status']['description']}`);
    } else {
        console.error("Unable to send message. " + error);
    }
}

const androidFCM = async (req, res) => {
    try {
        const { admin, iosAdmin } = require('./firebase');
        const message_notification = { data: req.message };
        const notification_options = { priority: "high", timeToLive: 60 * 60 * 24 };
        const registrationToken = req.fcmToken;
        admin.messaging().sendToDevice(registrationToken, message_notification, notification_options)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            });
    } catch (err) {
        console.log(err)
    }
}

const iosFCM = async (req, res) => {
    const { iosAdmin } = require('./firebase');
    const registrationToken = "d3t7p4YRK0ORp7oGFd4Dfd:APA91bFZwXk_JZwtsrIEVDNYJCDWJ7GebJG8AOtEgaZWlVK35QJOosegjRqIIXlgZ2iClLUMJXMCYhXJtP-WvJE9_JCMrxaOHDoG8ScuIWS6iuRc0U9FxhS0bqAh-nSJKEG9T6U4kDOk";
    const name = req.message.name;
    const payload = {
        notification: {
            title: name,
            body: req.message.msg,
            userInfo: JSON.stringify(req)
        }
    };
    const options = {
        priority: "high",
        timeTolive: 60 * 60 * 24
    };
    iosAdmin.messaging().sendToDevice(registrationToken, payload, options).then(function (response) {
        console.log("Succesfully sent Message:", response);
    }).catch(function (error) {
        console.log("Error Sending Message:", error);
    });
    // try{
    //     const { iosAdmin } = require('./firebase');
    //     const message_notification = { data: req.message };
    //     const notification_options = { priority: "high", timeToLive: 60 * 60 * 24 };
    //     const registrationToken = req.fcmToken;
    //     console.log('inside iosfcm')
    //     iosAdmin.messaging().sendToDevice(registrationToken, message_notification, notification_options)
    //     .then( response => {
    //         console.log(response.results[1])
    //     })
    //     .catch( error => {
    //         console.log(error)
    //     });
    //   }catch(err){
    //     console.log(err)
    //   }
}

const fcmAndroid = async (data, res) => {
    try {
        const message_notification = {
            data: {
                title: 'ACTIO',
                msg: data.Message,
                userStatus: data.userStatus,
                type: data.type
            }
        };
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        /* const  registrationToken = "fQMVPqBJwSY:APA91bHKkb4ELkymGTxDp0QWfIXrgi0xs6PEf5m4oxFyGFw7IZBobYTrUDdXn6Y40Xz-CGe8CQYG8oAlfYxjMBrYV85jbdmb3T-Ts_upToHMwGCjGMrGYc77_H6SSItB32uDJHkWIPO5"; */
        const registrationToken = data.fcmToken;
        const options = notification_options;
        admin.messaging().sendToDevice(registrationToken, message_notification, options)
            .then(response => {
            })
            .catch(error => {
            });
        const logdata = {};
        logdata.type = 'fcm';
        logdata.log = {};
        logdata.log.token = registrationToken;
        logdata.log.message = message_notification.data;
        await log(logdata);
    } catch (err) {
    }
}

const subscriberid = async (seqid) => {
    let text = "000000000";
    let limit = text.length - seqid.toString().length;
    text = text.substring(0, limit) + seqid;
    let digits = text.split('');
    let i = 0;
    let digit = 0;
    digits.forEach(val => {
        i++;
        switch (i) {
            case 1:
            case 4:
            case 7:
                digit += (val * 1);
                break;
            case 2:
            case 5:
            case 8:
                digit += (val * 3);
                break;
            case 3:
            case 6:
            case 9:
                digit += (val * 7);
                break;
        }
    });

    while (digit > 9) {
        let n_text = "000";
        let n_limit = n_text.length - digit.toString().length;
        n_text = n_text.substring(0, n_limit) + digit.toString();
        digits = n_text.split('');
        digit = 0;
        digits.forEach(val => {
            digit += +val;
        });
    }
    return seqid.toString() + digit.toString();
}

const sendMail = async (req, res) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
                user: 'contactus@actiosport.com',
                pass: 'Act!o@2020'
            }
        });
        var mailOptions = {
            from: 'contactus@actiosport.com',
            to: req.To,
            subject: req.Subject,
            html: req.Content
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
            } else {
            }
        });

        const logdata = {};
        logdata.type = 'mail';
        logdata.log = {};
        logdata.log.to = req.To;
        logdata.log.text = req.Content;
        await log(logdata);
    } catch (err) {
    }
}

const validateTime = (req, res) => {
    if (!req.match(/(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/)) {
        return false;
    } else {
        return true;
    }
}

const isValidDate = (value, res) => {
    try {
        let strdate = value.split('-');
        let newDate = strdate[2] + '-' + strdate[1] + '-' + strdate[0];
        if (!newDate.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(newDate);
        if (!date.getTime()) return false;
        if (date.toISOString().slice(0, 10) === newDate) return value;
    } catch (err) {
        return false;
    }
}

const uploadBase64 = (base64, path, res) => {
    const result = {};
    let matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
    let decodeImge = response;
    let imageBuffer = decodeImge.data;
    let type = decodeImge.type;
    let extensions = mime.getExtension(type);
    var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    path = path + random + '.' + extensions;
    try {
        fs.writeFileSync(path, imageBuffer, 'utf8');
        result.path = path;
    } catch (err) {
        result.path = false;
    } finally {
        return result;
    }
}

const hasDuplicates = async (arr) => {
    let unique = arr.filter((v, i, a) => a.indexOf(v) === i)
    if (unique.length != arr.length) {
        return false;
    } else {
        return true;
    }
}

const getAge = async (DOB) => {
    let strdate = DOB.split('-');
    let newDOB = strdate[2] + '-' + strdate[1] + '-' + strdate[0];
    var today = new Date();
    var birthDate = new Date(newDOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
}

const welcomeSMS = async (req, res) => {
    try {
        let link = (req.smsLink) ? req.smsLink : 'https://playactio.com';
        let Key = encodeURI('mVe2aWCU954-5jMJaAz7eJEll8EsGi1fohvDqlezOO');
        let number = encodeURI(req.mobile ? req.mobile.toString() : req.mobile_number);
        let sender = encodeURI('Adiish'); // encodeURI('ActioS');
        let message = encodeURIComponent(`Welcome to Actio Sport. To know more or update profile, visit , https://playactio.com /ADIISHA`);
        let urlstr = 'apikey=' + Key + '&numbers=' + number + '&sender=' + sender + '&message=' + message;
        const url = 'http://api.textlocal.in/send/?' + urlstr;
        request({ url: url }, (err, ress) => {
            if (err) {
                console.log(err)
            }
            else {
                // console.log(ress)
            }
        })
        return true;
    } catch (err) {
        return true;
    }
}

const getdateTime = (req, res) => {
    let dt = new Date();
    let date = `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
    return date;
}

const convertFalsytoEmptyString = (element) => {
    if (Array.isArray(element)) {
        const result = element.map((subElement) => {
            for (var k in subElement) {
                if (subElement.hasOwnProperty(k) && subElement[k] == null) {
                    subElement[k] = "";
                }
            }
            return subElement;
        });
        return result;
    }
    else if (typeof element === 'object') {
        for (var k in element) {
            if (element.hasOwnProperty(k) && element[k] == null) {
                element[k] = "";
            }
        }
        return element;
    }
}

function generateRangeOfYears(start, stop, step) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
}

function getAgeFromYYYYMMDD(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function cleanNull(obj) {
    for (var propName in obj) {
        if (obj[propName] === null) {
            obj[propName] = '';
        }
    }
    return obj;
}

const checkParent = async (mobileNumber, id) => {
    let parent = await db.query(`SELECT s.*,r.bond FROM subscriber_approvel as sa INNER JOIN subscriber as s ON s.id = sa.parent_id  LEFT JOIN relationship as r ON r.id = sa.relation_id where sa.child_id=${id} ORDER BY id LIMIT 1`);
    if (parent.rowCount) {
        let row = parent.rows[0];
        // if(row.id == id) {
        //     return {
        //         isParent : true,
        //         parentData : row
        //     }
        // }
        return row;
        // isParent : false,
    }
    else {
        return {};
    }
}

const sendMailweb = async (req, res) => {
    try {
        console.log('1111111111111111111111');
        var transporter = nodemailer.createTransport({
            //service: 'smtp.zoho.com',
            //host: 'smtp.zoho.in',
            //host: 'smtp.gmail.com', 
  
            //port: 465,
            //port: 2525,
            service: 'Gmail',
            port: 465,
            //secure: true,
            auth: {
                // user: 'contactus@actiosport.com',
                // pass: '@Actio2021!'

                user: 'contactus@actiosport.com',
                pass: 'ntmwwnxsqaygxfzl'
            }
        });
        var mailOptions = { 
            from: 'contactus@actiosport.com',
            to: req.To,
            subject: req.Subject,
            text: req.Content,
            html: req.html,
           
        };
        transporter.sendMail(mailOptions, function (error, info) { 
            if (error) {
                console.log("ereeeeeeeeeeeeeeee22222222");
                console.log(error);
            } else {
            }
        });

        const logdata = {}; 
        logdata.type = 'mail';
        logdata.log = {};
        logdata.log.to = req.To;
        logdata.log.text = req.Content;
        await log(logdata);
    } catch (err) {
    }
}

const remembersendMail =async(req,res)=>{
    try {
        console.log('1111111111111111111111');
        var transporter = nodemailer.createTransport({
           
            service: 'Gmail',
            port: 465,
            auth: {
                user: 'contactus@actiosport.com',
                pass: 'ntmwwnxsqaygxfzl'
            }
        });
        var mailOptions = { 
            from: 'contactus@actiosport.com',
            to: req.To,
            subject: req.Subject,
            text: req.Content,
            //html: req.html,
           
        };
        transporter.sendMail(mailOptions, function (error, info) {   
            if (error) {
                console.log("ereeeeeeeeeeeeeeee");
                console.log(error);
            } else {
            }
        });

        const logdata = {}; 
        logdata.type = 'mail';
        logdata.log = {};
        logdata.log.to = req.To;
        logdata.log.text = req.Content;
        await log(logdata);
    } catch (err) {
    }
}

const sendMailController = async (req, res) => {
    try {
        console.log('1111111111111111111111');
        var transporter = nodemailer.createTransport({
            
            service: 'Gmail',
            port: 465,
            auth: {
                user: 'contactus@actiosport.com',
                pass: 'ntmwwnxsqaygxfzl'
            }
        });
        var mailOptions = { 
            from: 'contactus@actiosport.com',
            to: req.To,
            subject: req.Subject,
           // text: req.Content,
            html: req.html,
           
        };
        transporter.sendMail(mailOptions, function (error, info) {  
            if (error) {
                console.log("ereeeeeeeeeeeeeeee22222222");
                console.log(error);
            } else {
            }
        });

        const logdata = {}; 
        logdata.type = 'mail';
        logdata.log = {};
        logdata.log.to = req.To;
        //logdata.log.text = req.Content;
        logdata.log.html = req.html;
        await log(logdata);
    } catch (err) {
    }
}

const teampmail = async (req, res) => {
    try {
        console.log('1111111111111111111111');
        var transporter = nodemailer.createTransport({
            
            service: 'Gmail',
            port: 465,
            auth: {
                user: 'contactus@actiosport.com',
                pass: 'ntmwwnxsqaygxfzl'
            }
        });
        var mailOptions = { 
            from: 'contactus@actiosport.com',
            to: req.To,
            subject: req.Subject,
           // text: req.Content,
            html: req.html,
           
        };
        transporter.sendMail(mailOptions, function (error, info) {  
            if (error) {
                console.log("ereeeeeeeeeeeeeeee22222222");
                console.log(error);
            } else {
            }
        });

        const logdata = {}; 
        logdata.type = 'mail';
        logdata.log = {};
        logdata.log.to = req.To;
        //logdata.log.text = req.Content;
        logdata.log.html = req.html;
        await log(logdata);
    } catch (err) {
    }
}



module.exports = {
    teleSignSendSms, checkParent, cleanNull, getAgeFromYYYYMMDD, iosFCM, generateRangeOfYears, convertFalsytoEmptyString,
    getdateTime, sendSMS, fcmAndroid, androidFCM, subscriberid, logError, sendMail,sendMailweb,isValidDate, validateTime, uploadBase64, hasDuplicates, getAge, welcomeSMS,remembersendMail,sendMailController
}
