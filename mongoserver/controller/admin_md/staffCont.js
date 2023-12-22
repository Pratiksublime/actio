const { Schema } = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const { queryMongo, mongoose } = require('../../mongodb');
// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');

let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const nodemailer = require('nodemailer');
const { sendEmail } = require('../../helper/sendmail');
const async = require('async');

module.exports = {


  Add: async (req, res) => {

    try {
      const dataToInsert = req.body; // Assuming req.body is an array of data documents

      const CollectionName = "staffdatas";
      const staffCollection = mongoose.model(CollectionName, Schema.staffdatas);

      let tasksCompleted = 0;
      const totalTasks = dataToInsert.length; // Total number of tasks
      // Create an async queue to process data records
      const queue = async.queue(async (data, callback) => {
        const {
          staff_name, designation, identification_id, contact_no, email_id, dob, is_coach, staff_last_name, subscriberID, age, academy_id, level_id, add_by, status,
        } = data;
        console.log(data);

        console.log('Email to send:');
        console.log(email_id);
        let checkduplicateemail = mongoose.model('staffdatas', Schema.staffdatas);
        let updatedata = await checkduplicateemail.find({ email_id: email_id });

        await checkduplicateemail.update(
          { email_id: email_id },
          { $set: { contact_no: contact_no } }
        );
        //console.log(checkdata);

        //  const Checkemail = "select id,email_id from subscriber where email_id = $1 and status = 1";
        //                 const queryResultid = await db.query(Checkemail, [email_id]);
        //                 console.log('Query result:', queryResultid.rowCount);

        let checkdata = await checkduplicateemail.find({ email_id: email_id, academy_id: academy_id, contact_no: contact_no });
        console.log(checkdata);

        console.log(checkdata.length);
        console.log("checkdata.................................");

        if (checkdata.length > 0) {
          res.send({
            api_version: "v1",
            success: true,
            message: 'email already exists.!',
            data: 1,
          });
        } else {

          let academyname = mongoose.model("Mainaccounts", Schema.Mainaccounts);

          let academy_name = await academyname.findOne({ id: academy_id });


          const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
          const queryResult = await db.query(Checkemail, [email_id]);
          console.log('Query result:', queryResult.rowCount);

          if (queryResult.rowCount > 0) {
            // If email exists in the subscriber collection, send an "Account Created" email
            const emailData = {
              to: email_id,
              subject: `Account Created at ${academy_name.academy_name}`,
              text: `Your account at ${academy_name.academy_name} has been successfully created  If you wish to log in,for email verification use below link http://18.117.233.92/login/${email_id} for mobile verification use below link http://18.117.233.92/AcademyAdmin/authentication/signin/${contact_no} `,
            };

            sendEmail(emailData.to, emailData.subject, emailData.text);
          } else {
            // If email does not exist in the subscriber collection, send a "Welcome" email
            const emailData = {
              to: email_id,
              subject: `Account Created at ${academy_name.academy_name}`,
              text: `Your account at ${academy_name.academy_name} has been successfully created  If you wish to log in,for email verification use below link http://18.117.233.92/login/${email_id} for mobile verification use below link http://18.117.233.92/AcademyAdmin/authentication/signin/${contact_no} `,
              //text: `Thank you for joining ${academy_name.academy_name}. Your account will be created shortly.If you wish to log in, please use the following link: http://18.117.233.92/AcademyAdmin/authentication/signin.`,
            };

            sendEmail(emailData.to, emailData.subject, emailData.text);
          }

          const _counter = await idCounter(staffCollection, 'id');
          console.log('COUNTER _ :: ', _counter);
          let otpNumber = Math.floor(100000 + Math.random() * 900000);

          var insertQuery = `
              INSERT INTO subscriber (username,password,full_name,isd_code, mobile_number, email_id, date_of_birth, age, created_at, status)
              VALUES ('${otpNumber}','123456','${staff_name}','null','${contact_no}', '${email_id}', '${dob}','${age}', now(), 1) 
              RETURNING id`;



          console.log("insertQuery...................................");
          console.log(insertQuery);

          let datalist = await db.query(insertQuery);
          let sid = datalist.rows[0].id;




          let stringprofile = "Insert into subscriber_web (last_name,parent_name,parent_number,isd_code,subscriber_id,add_dt)VALUES('" + staff_last_name + "','null','1234566','+91'," + sid + ",now())";

          console.log('iddddd...000000000...');
          console.log(stringprofile);
          await db.query(stringprofile);

          let stringotp = "Insert into otp (email_id,otp,mobile_number,isd_code,subscriber_sid)VALUES('" + email_id + "'," + otpNumber + ",'" + contact_no + "','+91'," + sid + ")";

          console.log('iddddd...000000000...');
          console.log(stringotp);
          await db.query(stringotp);

          const _insertData = {
            id: _counter,
            status: 1,
            created_at: todays_dt,
            subscriberID: sid

          };

          // Merge _insertData with the current data document
          const finalInsertData = { ..._insertData, ...data };





          var addstaff = await staffCollection.insertMany(finalInsertData);

          // if (queryResultid.rows[0] !== undefined) {
          //                   await staffCollection.update(
          //                       { email_id: email_id },
          //                       { $set: { subscriberID: queryResultid.rows[0].id } }
          //                   );
          //               }


          tasksCompleted++; // Increment the counter for completed tasks
          callback(); // Signal that this task is complete

          // Check if all tasks are completed and send the response
          if (tasksCompleted === totalTasks) {
            res.send({
              api_version: "v1",
              success: true,
              message: 'Data added successfully..!',
              data: [],
            });
          }
        }
      }, 1);
      // Limit concurrency to 1 task at a time (adjust as needed)

      // Enqueue data records for processing
      dataToInsert.forEach((data) => {
        queue.push(data);
      });
    } catch (error) {
      console.error(error);
      res.send({
        api_version: "v1",
        success: false,
        message: 'Something Went Wrong...',
        data: error,
      });
    }


  },

  List: async (req, res) => {
    // try {
    //   const CollectionName = "staffdatas";
    //   const Collection = mongoose.model(CollectionName, Schema.staffdatas);
    //   const idString = req.query.id;
    //   const idInt = parseInt(idString, 10);

    //   // Perform an aggregation to join "staffdata" and "designations" collections
    //   const result = await Collection.aggregate([
    //     {
    //       $match: { status: 1,academy_id:idInt } 
    //     },
    //     {
    //       $lookup: {
    //         from: "designations", 
    //         localField: "designation", 
    //         foreignField: "id", 
    //         as: "designationInfo" 
    //       }
    //     },
    //     {
    //       $unwind: "$designationInfo" 
    //     },
    //     {
    //       $project: {
    //         _id: 0, 
    //         id: 1, 
    //         staff_name: 1, 
    //         designation: 1,
    //         identification_id: 1,
    //         contact_no: 1,
    //         email_id: 1,
    //         dob: 1,
    //         is_coach: 1,
    //         academy_name: 1,
    //         academy_id: 1,
    //         level_id: 1,
    //         staff_last_name:1,
    //         age:1,
    //         designation_name: "$designationInfo.name", 


    //       }
    //     },
    //     {
    //       $sort: { id: -1 } // Sort by id in descending order
    //     }
    //   ]);

    //   console.log(result.length);

    //   if (result.length > 0) {
    //     res.send({
    //       success: true,
    //       message: "Staff data with designations fetched...",
    //       api_version: "v1",
    //       data: result
    //     });
    //   } else {
    //     res.send({
    //       success: false,
    //       message: "No records found.",
    //       api_version: "v1",
    //       data: []
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   res.send({
    //     success: false,
    //     message: "Something went wrong....",
    //     api_version: "v1",
    //     data: error.message
    //   });
    // }
    try {
      const CollectionName = "staffdatas";
      const Collection = mongoose.model(CollectionName, Schema.staffdatas);
      const idString = req.query.id;
      const idInt = parseInt(idString, 10);

      // Perform an aggregation to join "staffdata" and "designations" collections
      const result = await Collection.aggregate([
        {
          $match: { status: 1, add_by: req.myID, academy_id: idInt }
        },
        {
          $lookup: {
            from: "designations",
            localField: "designation",
            foreignField: "id",
            as: "designationInfo"
          }
        },
        {
          $unwind: {
            path: "$designationInfo",
            preserveNullAndEmptyArrays: true // Include documents with no matching "designation"
          }
        },
        {
          $project: {
            _id: 0,
            id: 1,
            staff_name: 1,
            designation: 1,
            identification_id: 1,
            contact_no: 1,
            email_id: 1,
            dob: 1,
            is_coach: 1,
            academy_name: 1,
            academy_id: 1,
            level_id: 1,
            staff_last_name: 1,
            age: 1,
            designation_name: { $ifNull: ["$designationInfo.name", ""] }, // Handle null designation
          }
        },
        {
          $sort: { id: -1 }
        }
      ]);

      console.log(result.length);

      if (result.length > 0) {
        res.send({
          success: true,
          message: "Staff data with designations fetched...",
          api_version: "v1",
          data: result
        });
      } else {
        res.send({
          success: false,
          message: "No records found.",
          api_version: "v1",
          data: []
        });
      }
    } catch (error) {
      console.error(error);
      res.send({
        success: false,
        message: "Something went wrong....",
        api_version: "v1",
        data: error.message
      });
    }


  },

  Listbycoach: async (req, res) => {
    try {
      const CollectionName = "staffdatas";
      const dtmfCollection = mongoose.model(CollectionName, Schema.staffdatas);

      // Perform an aggregation to join "staffdata" and "designations" collections
      const result = await dtmfCollection.aggregate([
        {
          $match: {
            $and: [
              { status: 1 }, // Match documents with status 1
              { is_coach: 1 },
              { academy_id: parseInt(req.query.id, 10) } // Additional condition
            ]
          }
        },
        {
          $lookup: {
            from: "designations", // Name of the "designations" collection
            localField: "designation", // Field in "staffdata" to match
            foreignField: "id", // Field in "designations" to match
            as: "designationInfo" // Name for the resulting array
          }
        },
        {
          $unwind: "$designationInfo" // Unwind the resulting array (if needed)
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the result
            id: 1, // Include the "id" field from "staffdata"
            staff_name: 1, // Include the "name" field from "staffdata"
            designation: 1,
            identification_id: 1,
            contact_no: 1,
            email_id: 1,
            dob: 1,
            is_coach: 1,
            academy_name: 1,
            academy_id: 1,
            level_id: 1,
            staff_last_name: 1,
            age: 1,
            designation_name: "$designationInfo.name", // Include the "name" field from "designations"
            // Include additional fields from "designations"

          }
        }
      ]);

      console.log(result);

      if (result.length > 0) {
        res.send({
          success: true,
          message: "Staff data with designations fetched...",
          api_version: "v1",
          data: result
        });
      } else {
        res.send({
          success: false,
          message: "No records found.",
          api_version: "v1",
          data: []
        });
      }
    } catch (error) {
      console.error(error);
      res.send({
        success: false,
        message: "Something went wrong....",
        api_version: "v1",
        data: error.message
      });
    }

  },


  Edit: async (req, res) => {
    try {
      let CollectionName = "staffdatas";
      let dtmfCollection = mongoose.model(CollectionName, Schema.staffdatas);
      let result = await dtmfCollection.findOne({ status: 1, id: req.body.id });




      if (result) {
        res.send({
          success: true,
          message: "level list fetched...",
          api_version: "v1",
          data: result
        });
      } else {
        res.send({
          success: false,
          message: "no record found..",
          api_version: "v1",
          data: result
        });
      }

    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        message: "something went wrong....!",
        api_version: "v1",
        data: error.message
      })
    }

  },

  Update: async (req, res) => {
    try {


      let updatedata = {

        updated_at: todays_dt,


      }

      let CollectionName = "staffdatas";
      let adminCollection = mongoose.model(CollectionName, Schema.staffdatas);

      updatedata.academy_id = req.body.academy_id;
      updatedata.staff_name = req.body.staff_name;
      updatedata.staff_last_name = req.body.staff_last_name,
        updatedata.age = req.body.age,
        updatedata.academy_name = req.body.academy_name;
      updatedata.centre_name = req.body.centre_name;
      updatedata.is_coach = req.body.is_coach;
      updatedata.location = req.body.location;
      updatedata.person_incharge = req.body.person_incharge;
      updatedata.designation = req.body.designation;
      updatedata.identification_id = req.body.identification_id;
      updatedata.contact_no = req.body.contact_no;
      updatedata.email_id = req.body.email_id;
      updatedata.dob = req.body.dob;
      updatedata.forms = req.body.forms;

      updatedata.sports = req.body.sports;



      let result = await adminCollection.updateOne({ id: req.body.id }, updatedata);
      if (result) {
        res.send({
          success: true,
          message: "Updated Successfully....",
          data: result,
        });
      } else {
        res.send({
          success: false,
          message: "Update Not successfully...",
          data: [],
        });
      }
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong...!",
        data: error.message,
      });
    }

  },

  delete: async (req, res) => {
    const validationRule = {
      id: "required",
    };
    validate(req.body, validationRule, {}, async (err, status) => {
      if (!status) {
        res.send({
          success: false,
          message: "Validation error....!",
          data: err,
        });
      } else {
        try {
          let oollectionname = "staffdatas";

          let collection = mongoose.model(oollectionname, Schema.staffdatas);

          let result = await collection.updateOne({ id: req.body.id }, { status: 2 });

          console.log(result)
          if (result) {
            res.send({
              success: true,
              message: "Deleted Successfully",
              data: result,
            });
          } else {
            res.send({
              success: false,
              message: "Deleted Un successfully",
              data: [],
            });
          }
        } catch (error) {
          res.send({
            success: false,
            message: "something went wrong...!",
            data: error.message,
          });
        }
      }
    });
  },
}