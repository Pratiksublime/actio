const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
const db = require('D:/actio_dev/play_actio_api/Actio_Backend_Api/server/db');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const nodemailer = require('nodemailer');
const { sendEmail } = require('../../helper/sendmail');

module.exports = {
    

    Add: async (req, res) => {
        
        // try {
        //   const dataToInsert = req.body; 
        
        //   const CollectionName = "staffdatas";
        //   const campaignCollection = mongoose.model(CollectionName, Schema.staffdatas);
        
        //   for (const data of dataToInsert) {
        //     const {
        //       staff_name,
        //       designation,
        //       identification_id,
        //       contact_no,
        //       email_id,
        //       dob,
        //       is_coach,
        //       academy_name,
        //       academy_id,
        //       level_id,
        //       status,
        //     } = data;
        
        //     console.log('Email to send:');
        //     console.log( email_id);
        
        //     const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
        //     const queryResult = await db.query(Checkemail, [email_id]);
        //     console.log('Query result:', queryResult.rowCount);
        
        //     if (queryResult.rowCount > 0) {
        //       // If email exists in the subscriber collection, send an "Account Created" email
        //       const emailData = {
        //         to: email_id,
        //         subject: `Account Created at ${academy_name}`,
        //         text: `Your account at ${academy_name} has been successfully created`,
        //       };
        
        //       sendEmail(emailData.to, emailData.subject, emailData.text);
        //     } else {
        //       // If email does not exist in the subscriber collection, send a "Welcome" email
        //       const emailData = {
        //         to: email_id,
        //         subject: `Account Created at ${academy_name}`,
        //         text: `Thank you for joining ${academy_name}. Your account will be created shortly..`,
        //       };
        
        //       sendEmail(emailData.to, emailData.subject, emailData.text);
        //     }
        
        //     const _counter = await idCounter(campaignCollection, 'id');
        //     console.log('COUNTER _ :: ', _counter);
        
        //     const _insertData = {
        //       id: _counter,
        //       status: 1,
        //       created_at: todays_dt,
              
        //     };
        
        //     // Merge _insertData with the current data document
        //     const finalInsertData = { ..._insertData, ...data };
        
        //     const addCampaign = await campaignCollection.insertMany(finalInsertData);
        
        //     if (addCampaign.insertedCount === 1) {
        //       console.log('Data added successfully for email:', email_id);
        //     } else {
        //       console.error('Data could not be added for email:', email_id);
        //     }
        //   }
        
        //   res.send({
        //     api_version: "v1",
        //     success: true,
        //     message: 'Data added successfully..!',
        //     data: [],
        //   });
        // } catch (error) {
        //   console.error(error);
        //   res.send({
        //     api_version: "v1",
        //     success: false,
        //     message: 'Something Went Wrong...',
        //     data: error,
        //   });
        // }
        const async = require('async');

try {
  const dataToInsert = req.body; // Assuming req.body is an array of data documents

  const CollectionName = "staffdatas";
  const campaignCollection = mongoose.model(CollectionName, Schema.staffdatas);

  let tasksCompleted = 0; // Counter to track completed tasks
  const totalTasks = dataToInsert.length; // Total number of tasks

  // Create an async queue to process data records
  const queue = async.queue(async (data, callback) => {
    const {
      staff_name,
      designation,
      identification_id,
      contact_no,
      email_id,
      dob,
      is_coach,
      academy_name,
      academy_id,
      level_id,
      status,
    } = data;

    console.log('Email to send:');
    console.log(email_id);

    const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
    const queryResult = await db.query(Checkemail, [email_id]);
    console.log('Query result:', queryResult.rowCount);

    if (queryResult.rowCount > 0) {
      // If email exists in the subscriber collection, send an "Account Created" email
      const emailData = {
        to: email_id,
        subject: `Account Created at ${academy_name}`,
        text: `Your account at ${academy_name} has been successfully created`,
      };

      sendEmail(emailData.to, emailData.subject, emailData.text);
    } else {
      // If email does not exist in the subscriber collection, send a "Welcome" email
      const emailData = {
        to: email_id,
        subject: `Account Created at ${academy_name}`,
        text: `Thank you for joining ${academy_name}. Your account will be created shortly..`,
      };

      sendEmail(emailData.to, emailData.subject, emailData.text);
    }

    const _counter = await idCounter(campaignCollection, 'id');
    console.log('COUNTER _ :: ', _counter);

    const _insertData = {
      id: _counter,
      status: 1,
      created_at: todays_dt,
      // Rest of your data fields
    };

    // Merge _insertData with the current data document
    const finalInsertData = { ..._insertData, ...data };

    const addCampaign = await campaignCollection.insertMany(finalInsertData);

    if (addCampaign.insertedCount === 1) {
      console.log('Data added successfully for email:', email_id);
    } else {
      console.error('Data could not be added for email:', email_id);
    }

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
  }, 1); // Limit concurrency to 1 task at a time (adjust as needed)

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
      try {
        const CollectionName = "staffdatas";
        const dtmfCollection = mongoose.model(CollectionName, Schema.staffdatas);
      
        // Perform an aggregation to join "staffdata" and "designations" collections
        const result = await dtmfCollection.aggregate([
          {
            $match: { status: 1 } 
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
            $unwind: "$designationInfo" 
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
              designation_name: "$designationInfo.name", 
             
             
            }
          },
          {
            $sort: { id: -1 } // Sort by id in descending order
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
                { is_coach: 1 } // Additional condition
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

    Update:async(req,res)=>{
        try{
          
          
           let updatedata = {
            
            updated_at: todays_dt,
            
            
        }
           
           let CollectionName ="staffdatas";
           let adminCollection = mongoose.model(CollectionName, Schema.staffdatas);

           updatedata.academy_id = req.body.academy_id;
           updatedata.staff_name = req.body.staff_name ;
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



           let result = await adminCollection.updateOne({id: req.body.id},updatedata);
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
              
              let result = await collection.updateOne({id: req.body.id},{status:2});

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