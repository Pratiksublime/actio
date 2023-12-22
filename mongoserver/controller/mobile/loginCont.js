const { Schema } = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const { sendSMS } = require("../../helper/sendmail");
const moment = require('moment');
const { queryMongo, mongoose } = require('../../mongodb');
// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');
const { generateToken } = require('../../config/auth.js')
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const nodemailer = require('nodemailer');
const { sendEmail } = require('../../helper/sendmail');
const async = require('async');

module.exports = {

  loginCall: async (req, res) => {
    const validationRule = {
      mobile_number: "required",
    }
    validate(req.body, validationRule, {}, async (err, status) => {
      if (!status) {
        res.send({
          api_version: "v1",
          success: false,
          message: 'Validation Error',
          data: err
        });
      } else {
        try {
          const { mobile_number } = req.body;
          console.log("mobile_number", mobile_number);

          const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
          const otpCollection = mongoose.model("otps", Schema.otpSchema);


          // check if coach data is present in subscriber table
          const existedCoachCheck = "select subscriber_id, mobile_number, isd_code from subscriber where mobile_number = $1 and status = 1";
          const queryResult = await db.query(existedCoachCheck, [mobile_number]);
          console.log('Query result:', queryResult.rowCount);

          if (queryResult.rowCount > 0) {
            const [subscriber_id, isd_code, mobile_number] = [queryResult.rows[0].subscriber_id, queryResult.rows[0].isd_code, queryResult.rows[0].mobile_number];
            // check if user is coach or not
            console.log(subscriber_id, isd_code, mobile_number)
            const checkIsCheck = await staffCollection.findOne({ subscriberID: subscriber_id, contact_no: mobile_number, is_coach: 1, status: 1 });
            if (checkIsCheck) {
              // send otp

              const otpCode = Math.floor(1000 + Math.random() * 8999);       // 4-digit otp 
              const otpGenerated = new Date();
              const otpValidTill = new Date(otpGenerated);
              otpValidTill.setMinutes(otpGenerated.getMinutes() + 30);

              const _data = {
                creationTime: otpGenerated,
                validTill: otpValidTill,
                otp: otpCode,
                mobile_number: mobile_number,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                isd_code: isd_code,
                status: 1,
                subscriber_sid: subscriber_id,
                created_by: subscriber_id,
                updated_by: subscriber_id,
              };
              console.log("_data : : ", _data)

              await otpCollection.updateOne(
                { mobile_number: mobile_number },
                { $set: _data },
                { upsert: true }
              )

              const bodySMS = `Please enter this OTP to verify your mobile number is ${otpCode} . Don't give it to anyone else. This OTP is only valid for 30 minutes.`;
              // console.log('bodySMS : : ', bodySMS)
              let smsData = {
                message: bodySMS,
                mobileNumber: mobile_number,
              };

              await sendSMS(smsData, (err, data) => {
                if (err) {
                  console.log("error : ", err)
                }
                global.smsResponse = data;
              });

              res.send({
                api_version: "v1",
                success: true,
                message: 'OTP send successfully',
                data: checkIsCheck
              });
            } else {
              res.send({
                api_version: "v1",
                success: false,
                message: 'Invalid Credentials',
                data: []
              });
            }
          } else {
            res.send({
              api_version: "v1",
              success: false,
              message: 'No Such User Found',
              data: []
            });
          }


        } catch (error) {
          console.error(error);
          res.send({
            api_version: "v1",
            success: false,
            message: 'Something Went Wrong...',
            data: error,
          });
        }
      }
    })
  },

  verifyOTP: async (req, res) => {
    try {
      const { mobile_number, otpCode } = req.body;


      const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
      const otpCollection = mongoose.model("otp", Schema.otpSchema);

      if (!mobile_number) {
        return res.send({
          success: false,
          message: 'Please provide your contact number.',
        });
      }

      // Check if OTP is provided and valid
      if (!otpCode || !Number.isInteger(Number(otpCode)) || otpCode.toString().length !== 6) {
        return res.send({ success: false, message: 'Invalid OTP' });
      }
      const _otpExist = await otpCollection.findOne({
        mobile_number: mobile_number,
        otpCode: Number(otpCode),
      });

      if (!_otpExist) {
        return res.send({
          success: false,
          message: 'Invalid OTP',
        });
      }
      // console.log("_otpExist : : ", _otpExist,)
      if (new Date().getTime() > _otpExist.validTill.getTime()) {
        return res.send({
          success: false,
          message: 'OTP Expired',
        });
      }

      // Check if user already existed or not 
      let _token = '';
      let _user = false;
      let userExist = await staffCollection.findOne({ contact_no: mobile_number, status: ACTIVE_STATUS }).select({ _id: 0, __v: 0 });
      console.log('userExist - -', userExist)

      if (userExist !== null) {                   // generate token for existed user
        _user = true;
        _token = await generateToken(userExist);
        res.setHeader('Authorization', _token);
      }
      res.send({
        success: true,
        message: 'OTP validated successfully',
        userExisted: _user,
        token: _token
      });

    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      })
    }
  },

}