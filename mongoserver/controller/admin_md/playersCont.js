const { Schema } = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const { queryMongo, mongoose } = require('../../mongodb');

// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');

let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const { sendEmail } = require('../../helper/sendmail');
const async = require('async');
// const helper = require('/var/www/code/play_actio_api/server/helper/helper');
const helper = require('../../../server/helper/helper');
var bannerPath = './public/images/';


module.exports = {

  Add: async (req, res) => {

    try {
      const dataToInsert = req.body;
      const CollectionName = "players";
      const playersCollection = mongoose.model(CollectionName, Schema.players);
      const paymentCollection = mongoose.model("playerpayment", Schema.playerpayment);

      let tasksCompleted = 0;
      const totalTasks = dataToInsert.length;

      const queue = async.queue(async (data, callback) => {
        var {
          player_name, player_last_name, dob, age, parent_name, parent_no, player_no, email_id, gender, profile_photo, academy_id, level_id, batch_id, payment_type, add_by, paymentArray
        } = data;

        let otpNumber = Math.floor(100000 + Math.random() * 900000);
        var insertQuery = `INSERT INTO subscriber (username,password,full_name,isd_code, mobile_number, email_id, date_of_birth, gender, created_at, status)
              VALUES (${otpNumber},'123456','${player_name}','null','${player_no}', '${email_id}', '${dob}', ${gender}, now(), 1) 
              RETURNING id`;
        console.log("insertQuery...................................");
        console.log(insertQuery);



        let datalist = await db.query(insertQuery);
        let sid = datalist.rows[0].id;

        if (parent_name == '') {
          parent_name = null
        }

        if (parent_no == '') {
          parent_no = 123;
        }


        let stringprofile = "Insert into subscriber_web (last_name,parent_name,parent_number,isd_code,subscriber_id,add_dt)VALUES('" + player_last_name + "','" + parent_name + "','" + parent_no + "','+91'," + sid + ",now())";

        console.log('iddddd...000000000...');
        console.log(stringprofile);
        await db.query(stringprofile);

        let stringotp = "Insert into otp (email_id,otp,mobile_number,isd_code,subscriber_sid)VALUES('" + email_id + "'," + otpNumber + ",'" + player_no + "','+91'," + sid + ")";

        console.log('iddddd...000000000...');
        console.log(stringotp);
        await db.query(stringotp);

        const doc_data = profile_photo ? helper.uploadBase64(profile_photo, bannerPath).path : "null";

        let existingPlayer = await playersCollection.findOne({ email_id: email_id });

        if (existingPlayer) {

          // Ensure level_id and batch_id are initialized arrays
          if (!existingPlayer.level_id) {
            existingPlayer.level_id = [];
          }
          if (!existingPlayer.batch_id) {
            existingPlayer.batch_id = [];
          }

          // Update level_id
          for (let id of level_id) {
            if (!existingPlayer.level_id.includes(id)) {
              existingPlayer.level_id.push(id);
            }
          }

          // Update batch_id
          for (let id of batch_id) {
            if (!existingPlayer.batch_id.includes(id)) {
              existingPlayer.batch_id.push(id);
            }
          }

          await existingPlayer.save();

          // Update payment info if necessary (you can adjust this)
          await paymentCollection.updateOne({ player_id: existingPlayer.id }, { $set: { paymentArray: paymentArray } });

        } else {
          // Fetching academy name for email sending
          let academyname = mongoose.model("Mainaccounts", Schema.Mainaccounts);
          let academy_names = await academyname.findOne({ id: academy_id });
          const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
          const queryResult = await db.query(Checkemail, [email_id]);

          // Send emails based on query result
          let emailText = '';
          if (queryResult.rowCount > 0) {
            emailText = `Your account at ${academy_names.academy_name} has been successfully created  If you wish to log in,for email verification use below link http://18.117.233.92/login/${email_id} for mobile verification use below link http://18.117.233.92/AcademyAdmin/authentication/signin/${player_no} `;
            //emailText = `Your account at ${academy_names.academy_name} has been successfully created. If you wish to log in, please use the following link: http://18.117.233.92/AcademyAdmin/authentication/signin`;
          } else {

            emailText = `Your account at ${academy_names.academy_name} has been successfully created  If you wish to log in,for email verification use below link http://18.117.233.92/login/${email_id} for mobile verification use below link http://18.117.233.92/AcademyAdmin/authentication/signin/${player_no} `;
            // emailText = `Thank you for joining ${academy_names.academy_name}. Your account will be created shortly. If you wish to log in, please use the following link: http://18.117.233.92/AcademyAdmin/authentication/signin.`;
          }
          sendEmail(email_id, `Account Created at ${academy_names.academy_name}`, emailText);




          // Insert new player and payment data
          const _counter = await idCounter(playersCollection, 'id');
          const _counterpay = await idCounter(paymentCollection, 'id');
          const _insertData = {
            id: _counter,
            status: 1,
            created_at: todays_dt,
            subscriberID: sid


          };

          for (let i = 0; i < paymentArray.length; i++) {
            paymentArray[i].status = 1;
          }
          const insert = {
            id: _counterpay,
            player_id: _counter,
            status: 1,
            paymentArray: paymentArray,
            created_at: todays_dt
          };


          const finalInsertData = { ..._insertData, ...data, profile_photo: doc_data };

          await paymentCollection.insertMany(insert);
          await playersCollection.insertMany(finalInsertData);
        }

        tasksCompleted++;
        callback();

        // Send response after all tasks are completed
        if (tasksCompleted === totalTasks) {
          res.send({
            api_version: "v1",
            success: true,
            message: 'Data added/updated successfully..!',
            data: [],
          });
        }

      }, 1);

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



    //   try {
    //     const dataToInsert = req.body; // Assuming req.body is an array of data documents

    //     const CollectionName = "players";
    //     const playersCollection = mongoose.model(CollectionName, Schema.players);
    //     const paymentCollection = mongoose.model("playerpayment", Schema.playerpayment);

    //     let tasksCompleted = 0; // Counter to track completed tasks
    //     const totalTasks = dataToInsert.length; // Total number of tasks

    //     // if (req.body.profile_photo !== undefined && req.body.profile_photo !== null) {

    //    const queue = async.queue(async (data, callback) => {
    //     const {
    //       player_name,player_last_name,dob,age,parent_name,parent_no,player_no,email_id,gender,profile_photo,academy_id,level_id,batch_id,payment_type,add_by,paymentArray
    //     } = data;


    //     const doc_data = profile_photo ? helper.uploadBase64(profile_photo, bannerPath).path : "null";

    //     console.log("doc_data*******************************************************************************");

    //     console.log('Email to send:');
    //     console.log(email_id);
    //       // update mobile no in postgres subscriber


    //     let  checkduplicateemail = mongoose.model('players',Schema.players);
    //     //let updatedata = await checkduplicate.find({email_id:email_id});
    //      await checkduplicateemail.update(
    //             { email_id: email_id }, 
    //             { $set: { level_id: level_id,batch_id:batch_id } }
    //         );



    //     let checkdata = await checkduplicateemail.find({email_id:email_id,academy_id:academy_id});
    //     console.log(checkdata);

    //     //console.log(checkdata.length);
    //     //console.log("checkdata.................................");

    //     if(checkdata.length>0){
    //       res.send({
    //         api_version: "v1",
    //         success: true,
    //         message: 'email already exists.!',
    //         data: 1,
    //       });
    //     }else{

    //     let academyname = mongoose.model("Mainaccounts",Schema.Mainaccounts);
    //     let academy_names = await academyname.findOne({id:academy_id});

    //     console.log('Query result:-------------------------------------------------------') ;
    //     console.log(academy_names);



    //     const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
    //     const queryResult = await db.query(Checkemail, [email_id]);

    //     if (queryResult.rowCount > 0) {
    //       // If email exists in the subscriber collection, send an "Account Created" email
    //       const emailData = {
    //         to: email_id,
    //         subject: `Account Created at ${academy_names.academy_name}`,
    //         text: `Your account at ${academy_names.academy_name} has been successfully created  If you wish to log in, please use the following link: http://18.117.233.92/AcademyAdmin/authentication/signin`,
    //       };

    //       sendEmail(emailData.to, emailData.subject, emailData.text);
    //     } else {
    //       // If email does not exist in the subscriber collection, send a "Welcome" email
    //       const emailData = {
    //         to: email_id,
    //         subject: `Account Created at ${academy_names.academy_name}`,
    //         text: `Thank you for joining ${academy_names.academy_name}. Your account will be created shortly.If you wish to log in, please use the following link: http://18.117.233.92/AcademyAdmin/authentication/signin.`,
    //       };

    //       sendEmail(emailData.to, emailData.subject, emailData.text);
    //     }


    //     const _counter = await idCounter(playersCollection, 'id');

    //     const _insertData = {
    //       id: _counter,
    //       status: 1,
    //       created_at: todays_dt,


    //     };
    //     const _counterpay = await idCounter(paymentCollection, 'id');

    //         const insert ={
    //           id: _counterpay,
    //           player_id:_counter,
    //           status: 1,
    //           //academy_id:academy_id,
    //           paymentArray:paymentArray,
    //           created_at: todays_dt,

    //         };


    //     // Merge _insertData with the current data document
    //     const finalInsertData = { ..._insertData, ...data,profile_photo:doc_data };

    //     let checkdublicat = await playersCollection.find({email_id:email_id});
    //     console.log(checkdublicat);
    //     console.log(checkdublicat.length);
    //     console.log("checkdublicat....................");

    //         if(checkdublicat.length>0){
    //             await playersCollection.update({$set:{level_id:level_id,batch_id:batch_id}});
    //             await paymentCollection.update({$set:{paymentArray:paymentArray}});
    //         }




    //              await paymentCollection.insertMany(insert);

    //             await playersCollection.insertMany(finalInsertData);

    //       // if (queryResultid.rows[0] !== undefined) {
    //       //                   await playersCollection.update(
    //       //                       { email_id: email_id },
    //       //                       { $set: { subscriberID: queryResultid.rows[0].id } }
    //       //                   );
    //       //               }





    //     tasksCompleted++; // Increment the counter for completed tasks
    //     callback(); // Signal that this task is complete

    //     // Check if all tasks are completed and send the response
    //     if (tasksCompleted === totalTasks) {
    //       res.send({
    //         api_version: "v1",
    //         success: true,
    //         message: 'Data added successfully..!',
    //         data: [],
    //       });
    //     }
    //   }
    //   }, 1); 

    //   dataToInsert.forEach((data) => {
    //     queue.push(data);
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

  },


  Addbk: async (req, res) => {
    const async = require('async');

    try {

      let dataToInsert = req.body;

      console.log("dataToInsert,,,,,,,,,,,,,,,....................................................");
      console.log(dataToInsert);


      // If dataToInsert is not an array, make it an array
      if (!Array.isArray(dataToInsert)) {
        dataToInsert = [dataToInsert];
      }

      // Normalize the dataToInsert to handle the array format inside each object
      const normalizedData = [];
      dataToInsert.forEach(entry => {
        if (Array.isArray(entry.player_name)) {
          for (let i = 0; i < entry.player_name.length; i++) {
            normalizedData.push({
              player_name: entry.player_name[i],
              player_last_name: entry.player_last_name[i],
              dob: entry.dob[i],
              age: entry.age[i],
              parent_name: entry.parent_name[i],
              parent_no: entry.parent_no[i],
              email_id: entry.email_id[i],
              gender: entry.gender[i],
              academy_id: entry.academy_id[i],
              level_id: entry.level_id[i],
              batch_id: entry.batch_id[i],
              payment_type: entry.payment_type[i],
              add_by: entry.add_by[i]
            });
          }
        } else {
          normalizedData.push(entry);
        }
      });

      dataToInsert = normalizedData;

      console.log("dataToInsert......................");
      console.log(dataToInsert);

      const CollectionName = "players";
      const playersCollection = mongoose.model(CollectionName, Schema.players);
      const paymentCollection = mongoose.model("playerpayment", Schema.playerpayment);

      let tasksCompleted = 0; // Counter to track completed tasks
      const totalTasks = dataToInsert.length; // Total number of tasks


      // Create an async queue to process data records
      const queue = async.queue(async (data, callback) => {
        const {
          player_name, player_last_name, dob, age, parent_name, parent_no, email_id, gender, profile_photo, academy_id, level_id, batch_id, payment_type, add_by, paymentArray
        } = data;

        console.log(paymentArray);
        console.log("paymentArray...........................");
        console.log('Email to send:');
        console.log(email_id);

        const Checkemail = "select email_id from subscriber where email_id = $1 and status = 1";
        const queryResult = await db.query(Checkemail, [email_id]);
        console.log('Query result:', queryResult.rowCount);

        let academyname = mongoose.model("Mainaccounts", Schema.Mainaccounts);
        let academy_name = await academyname.findOne({ id: academy_id });

        if (queryResult.rowCount > 0) {
          // If email exists in the subscriber collection, send an "Account Created" email
          const emailData = {
            to: email_id,
            subject: `Account Created at ${academy_id}`,
            text: `You have been added to the staff of ${academy_id}. If you wish to log in, please use the following link.http://18.117.233.92/AcademyAdmin/authentication/signin`,
            //text: `Your account at ${academy_name} has been successfully created`,
          };

          sendEmail(emailData.to, emailData.subject, emailData.text);
        } else {
          // If email does not exist in the subscriber collection, send a "Welcome" email
          const emailData = {
            to: email_id,
            subject: `Account Created at ${academy_id}`,
            text: `If you dont have Actio Sport account First you have  to register from here http://18.117.233.92/AcademyAdmin/authentication/signin
              Please make sure that your mobile number and email id is same as you have provided`,
            text: `Thank you for joining ${academy_id}. Your account will be created shortly..`,
          };

          sendEmail(emailData.to, emailData.subject, emailData.text);
        }

        const _counter = await idCounter(playersCollection, 'id');
        console.log('COUNTER _ :: ', _counter);

        if (req.files !== undefined && req.files !== null) {
          var element = req.files.profile_photo;
          let now = moment();
          var image_name = now.format("YYYYMMDDHHmmss") + element.name;
          element.mv('./public/images/' + image_name);
          doc_data = image_name;
        } else {
          var doc_data = "null";
        }

        const _insertData = {
          id: _counter,
          status: 1,
          created_at: todays_dt,
          profile_photo: doc_data,
          // Rest of your data fields
        };

        //payment function ........................//
        const _counterpay = await idCounter(paymentCollection, 'id');

        const insert = {
          id: _counterpay,
          player_id: _counter,
          status: 1,
          academy_id: academy_id,
          paymentArray: paymentArray,
          created_at: todays_dt,

        };

        // Merge _insertData with the current data document



        const finalInsertData = { ..._insertData, ...data };

        let checkdublicat = await playersCollection.find({ email_id: email_id });
        console.log(checkdublicat);
        console.log(checkdublicat.length);
        console.log("checkdublicat....................");

        if (checkdublicat.length > 0) {
          await playersCollection.update({ $set: { level_id: level_id, batch_id: batch_id } });
          await paymentCollection.update({ $set: { paymentArray: paymentArray } });
        }
        const addPayment = await paymentCollection.insertMany(insert);
        const addplayers = await playersCollection.insertMany(finalInsertData);


        if (addplayers.insertedCount === 1) {
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
    //   try {
    //     let CollectionName = "players";
    //     let dtmfCollection = mongoose.model(CollectionName, Schema.players);
    //     let Collection = mongoose.model('mainaccounts', Schema.Mainaccounts);


    //     let results = await dtmfCollection.find({ status: 1 });

    //     let resultsid = await Collection.find({ status: 1 ,id:results.id});

    //     const baseURL = "http://192.168.29.130:3018/public/images/";
    //     results.forEach(player => {
    //       if (player.profile_photo) {
    //           player.profile_photo = baseURL + player.profile_photo;
    //       }
    //   });
    //     console.log(results.profile_photo)


    //     if (results.profile_photo) {
    //         results.profile_photo = baseURL + player.profile_photo;
    //     }



    //     if (results.length > 0) {
    //         res.send({
    //             success: true,
    //             message: "level list fetched...",
    //             api_version: "v1",
    //             data: results
    //         });
    //     } else {
    //         res.send({
    //             success: false,
    //             message: "no record found..",
    //             api_version: "v1",
    //             data: results
    //         });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.send({
    //         success: false,
    //         message: "something went wrong....!",
    //         api_version: "v1",
    //         data: error.message
    //     });
    // }
    try {

      const playerCollectionName = "players";
      const Player = mongoose.models[playerCollectionName] || mongoose.model(playerCollectionName, Schema.players);
      //const Player = mongoose.model(playerCollectionName, Schema.players);

      // Always match these base conditions
      let baseMatchCondition = {
        status: 1,
        add_by: req.myID,
        academy_id: parseInt(req.query.id, 10)
      };

      let orConditions = [];
      // If req.query.date is provided and valid, prepare a date condition.
      // if (req.query.date) {
      //   const targetDate = new Date(req.query.date); // Convert to a Date object
      //   orConditions.push({ converted_mdf_dt: { $lte: targetDate } });
      // }

      if (req.query.date) {
        const targetDate = new Date(req.query.date); // Convert to a Date object
        const thirtyDaysAgo = new Date(targetDate); // Copy targetDate to a new variable
        thirtyDaysAgo.setDate(targetDate.getDate() - 30); // Subtract 30 days from the copied date

        // Add the condition to your orConditions array
        // This will select documents where the 'converted_mdf_dt' is between thirtyDaysAgo and targetDate
        orConditions.push({
          converted_mdf_dt: {
            $gte: thirtyDaysAgo, // Greater than or equal to thirty days ago
            $lte: targetDate // Less than or equal to the target date
          }
        });
      }

      if (orConditions.length > 0) {
        baseMatchCondition.$or = orConditions;
      }


      const players = await Player.aggregate([
        {
          $addFields: {
            converted_mdf_dt: {
              $cond: {
                if: { $eq: [{ $type: "$created_at" }, "string"] },
                then: { $dateFromString: { dateString: "$created_at" } },
                else: "$created_at"
              }
            },
          },
        },
        {
          // $match: {

          //   // status: 1,
          //   // add_by:req.myID,
          //   // academy_id:parseInt(req.query.id, 10), 

          //   $or: orConditions
          // }
          $match: baseMatchCondition
        },
        {
          $lookup: {
            from: "mainaccounts",
            localField: "academy_id",
            foreignField: "id",
            as: "academy"
          }
        },
        {
          $unwind: "$academy"
        },
        {
          $lookup: {
            from: "playerpayments",
            localField: "id",
            foreignField: "player_id",
            as: "paymentArraydata"
          }
        },
        {
          $unwind: { path: "$paymentArraydata", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            player_name: 1,
            player_last_name: 1,
            dob: 1,
            age: 1,
            parent_name: 1,
            parent_no: 1,
            email_id: 1,
            gender: 1,
            academy_id: 1,
            level_id: 1,
            batch_id: 1,
            payment_type: 1,
            profile_photo: 1,
            academy_name: "$academy.academy_name",
            paymentArray: { $ifNull: ["$paymentArraydata.paymentArray", []] },
            //paymentArray:"$paymentArraydata.paymentArray",


          }
        },
        {
          $sort: { id: -1 } // Sort by id in descending order
        }
      ]);

      const baseURL = "http://18.117.233.92:3000";


      players.forEach(player => {
        if (player.profile_photo && typeof player.profile_photo === 'string' && player.profile_photo.trim() !== "" && player.profile_photo.trim().toLowerCase() !== "null") {
          // Remove "./" from the beginning of the string if it exists
          let cleanPath = player.profile_photo.startsWith("./") ? player.profile_photo.substring(2) : player.profile_photo;
          player.profile_photo = baseURL + '/' + cleanPath;
        } else {
          player.profile_photo = null;
        }
      });



      if (players.length > 0) {
        res.send({
          success: true,
          message: "Player list fetched...",
          api_version: "v1",
          data: players
        });
      } else {
        res.send({
          success: false,
          message: "No records found.",
          api_version: "v1",
          data: players
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        message: "Something went wrong....!",
        api_version: "v1",
        data: error.message
      });
    }



  },



  Edit: async (req, res) => {
    //   try {
    //     let CollectionName = "players";
    //     let dtmfCollection = mongoose.model(CollectionName, Schema.players);
    //     let Collection = mongoose.model("playerpayment", Schema.playerpayment);
    //     const palyer = await Collection.findOne({  player_id: req.body.id });

    //     const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });

    //     if (result) {

    //       result.paymentArray = palyer.paymentArray;

    //         res.send({
    //             success: true,
    //             message: "level fetched...",
    //             api_version: "v1",
    //             data: result,
    //             //paymentArray:palyer.paymentArray

    //         });
    //     } else {
    //         res.send({
    //             success: false,
    //             message: "no record found..",
    //             api_version: "v1",
    //             data: null 
    //         });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.send({
    //         success: false,
    //         message: "something went wrong....!",
    //         api_version: "v1",
    //         data: error.message
    //     });
    // }
    try {
      const baseURL = "http://18.117.233.92:3000";
      let CollectionName = "players";
      let dtmfCollection = mongoose.model(CollectionName, Schema.players);
      let Collection = mongoose.model("playerpayment", Schema.playerpayment);
      const palyer = await Collection.findOne({ player_id: req.body.id });
      const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });

      if (result) {
        if (result.profile_photo && typeof result.profile_photo === 'string' && result.profile_photo.trim() !== "" && result.profile_photo.trim().toLowerCase() !== "null") {
          let cleanPath = result.profile_photo.startsWith("./") ? result.profile_photo.substring(2) : result.profile_photo;
          result.profile_photo = baseURL + '/' + cleanPath;
        } else {
          result.profile_photo = null;
        }



        // Create a new data object and include paymentArray
        const data = {
          ...result._doc,  // Copy the properties of result
          paymentArray: palyer ? palyer.paymentArray : []
        };

        res.send({
          success: true,
          message: "level fetched...",
          api_version: "v1",
          data: data  // Include the new data object in the response
        });
      } else {
        res.send({
          success: false,
          message: "no record found..",
          api_version: "v1",
          data: null
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        message: "something went wrong....!",
        api_version: "v1",
        data: error.message
      });
    }



  },






  Update: async (req, res) => {
    try {



      console.log(req.body.player_name);
      console.log('req.body.id---------------------------------------');




      //const doc_data = req.body.profile_photo ? helper.uploadBase64(req.body.profile_photo, bannerPath).path : "null";



      let updatedata = {

        updated_at: todays_dt,
        //profile_photo:doc_data


      }

      if (req.body.profile_photo && req.body.profile_photo.startsWith("data:image/")) {
        updatedata.profile_photo = helper.uploadBase64(req.body.profile_photo, bannerPath).path;
      }


      let CollectionName = "players";
      let adminCollection = mongoose.model(CollectionName, Schema.players);
      const paymentCollection = mongoose.model("playerpayment", Schema.playerpayment);

      updatedata.player_name = req.body.player_name;
      updatedata.player_last_name = req.body.player_last_name;
      updatedata.parent_name = req.body.parent_name;
      updatedata.dob = req.body.dob;
      updatedata.parent_no = req.body.parent_no;
      updatedata.email_id = req.body.email_id;
      updatedata.no_of_session = req.body.no_of_session;
      updatedata.gender = req.body.gender;
      // updatedata.profile_photo = req.body.profile_photo;
      updatedata.academy_id = req.body.academy_id;

      updatedata.level_id = req.body.level_id;
      updatedata.batch_id = req.body.batch_id;
      updatedata.payment_type = req.body.payment_type;

      updatedata.id = req.body.id;
      paymentArray = req.body.paymentArray;





      const updateResult = await paymentCollection.updateOne({ player_id: updatedata.id }, { $set: { paymentArray: paymentArray } });


      console.log(updateResult)
      console.log("paymentCollection............")



      let result = await adminCollection.updateOne({ id: updatedata.id }, updatedata);
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

  Delete: async (req, res) => {
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
          let oollectionname = "players";

          let collection = mongoose.model(oollectionname, Schema.players);

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