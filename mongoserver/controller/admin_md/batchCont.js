const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
//app.use('/public', express.static('public'));
const {queryMongo,mongoose} = require('../../mongodb');

let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const async = require('async');
const { sendEmail } = require('../../helper/sendmail');
// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');

module.exports = {
    

    Add: async (req, res) => {
        try {
           
          const dataToInsert = req.body; // Assuming req.body is an array of data documents
      
          const CollectionName = "batchdata";
          const campaignCollection = mongoose.model(CollectionName, Schema.batchdata);
      
          let tasksCompleted = 0; // Counter to track completed tasks
          const totalTasks = dataToInsert.length; // Total number of tasks
      
          // Create an async queue to process data records
          const queue = async.queue(async (data, callback) => {
          const {
            batch_name,batch_timing,location,academy_name,academy_id,level_id,coach_id,days,sports,add_by
          } = data;
      
         
      
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


    Batchlist:async(req,res)=>{
      try {  

        var results ={};
        const CollectionName = "batchdata";
        const batchCollection = mongoose.model(CollectionName, Schema.batchdata);

        let { id, level_id,date,days } = req.query; 
      
        
        let query = {status:1,add_by:req.myID}; 

        // if (days) {
        //  // query.days = id;
        //   query.days = { $in: [/days/i] }
        // }
        if (days) {
          // Assuming days is a comma-separated string, e.g. "Monday,Tuesday"
          let daysArray = days.split(',').map(day => day.trim());
      
          // Update the query to include the days condition
          query.days = { $in: daysArray };
      }
      
        if (id) {
          query.academy_id = id;
        }
      
        if (level_id) {
          
          query.level_id = level_id;
        }

        console.log(query);
        console.log("query0000000000000000000000000000");
      
        

        // if(req.query.id && req.query.level_id && req.query.id!== null && req.query.id!== 'undefined' && req.query.level_id!== null && req.query.level_id!=='undefined')
        //     {
        //         results = await batchCollection.find({status:1,academy_id:req.query.id,level_id:req.query.level_id}).sort({ id: -1 });
        //     }
        // else
        //     {
              
               results = await batchCollection.find(query).sort({ id: -1 });
            //}
        
        const batchData = {};
      
        
        const uniqueCoachIds = [...new Set(results.flatMap((document) => document.coach_id))];
        const uniqueLevelIds = [...new Set(results.map((document) => document.level_id))];
        const uniquesportIds = [...new Set(results.map((document) => document.sports))];



        const validSportIds = uniquesportIds.filter((id) => id !== null);

      // Check if there are valid sport IDs to query
      if (validSportIds.length > 0) {
        // Construct the SQL query with the IN clause
        let Sport = `SELECT id, sports_name FROM sports WHERE status = 1 AND id IN (${validSportIds.join(",")})`;

        console.log(Sport);
        console.log("Sport......................");

        let sportss = await db.query(Sport);
        var sports = sportss.rows;
      }

             

              // let data = sports.map((sport) => ({
              //       id: sport.id,
              //       sports_name: sport.sports_name
              //     }));

      
       
        const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
        const staffList = await staffCollection.find({ id: { $in: uniqueCoachIds } });

       

        const levelCollection = mongoose.model("leveldata", Schema.leveldata);
        const levelList = await levelCollection.find({ id: { $in: uniqueLevelIds } });
        //const levelList = await levelCollection.find({ id: { $in: uniqueLevelIds } });


        const levelMap = {};
        levelList.forEach(level => {
        levelMap[level.id] = level.centre_name;
      });


      
       
        for (const document of results) {
          const { id, batch_name, batch_timing, centre_name,level_id,level_name, coach_id ,days} = document;
      
         
          if (!batchData[id]) {
            batchData[id] = {
              id,
              batch_name,
              batch_timing,
              centre_name,
              level_id,
              level_name: levelMap[level_id],
              sports:sports,
              days,
              staff: [], 
            };
          }
      
          // Find the staff members associated with this batch's coach_id
          const staffForBatch = staffList.filter((staff) => coach_id.includes(staff.id))
          .map((staff) => ({ "staff_name": staff.staff_name }));
          //.map((staff) => staff.staff_name);
      
          // Add the staff data to the batch
          batchData[id].staff.push(...staffForBatch);
        }
      
        
        const finalResult = Object.values(batchData);
        finalResult.sort((a, b) => b.id - a.id);

         
         if (finalResult.length > 0) {
           res.send({
             success: true,
             message: "batchdata data fetched...",
             api_version: "v1",
             data: finalResult
           });
         } else {
           res.send({
             success: false,
             message: "No records found.",
             api_version: "v1",
             data: []
           });
         }
      
        // Log the finalResult
        console.log(finalResult);
      
        // Rest of your code...
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


    playerlistbyid: async (req, res) => {

    try {
    const playerCollectionName = "players";

    const playerCollection = mongoose.models[playerCollectionName] || mongoose.model(playerCollectionName, Schema.players);
    //const playerCollection = mongoose.model(playerCollectionName, Schema.players);

    const attendanceCollectionName = "Attendance";
    const attendanceCollection = mongoose.model(attendanceCollectionName, Schema.Attendance);

    const batchId = req.body.id;
    const date = req.body.date;

//     const dateString = req.body.date; // Your desired date format

//     console.log(dateString)
// const year = parseInt(dateString.split("/")[0]);
// const month = parseInt(dateString.split("/")[1]) - 1; // Months are zero-based in JavaScript
// const day = parseInt(dateString.split("/")[2]); 

// const date = new Date(year, month, day);

console.log(date);  


    //const date = new Date(req.body.date);   

    // Find players based on the provided criteria
    const players = await playerCollection.find({ status: 1, batch_id: batchId, level_id: req.body.level_id }).sort({ id: -1 });

    if (players.length === 0) {
        return res.send({
            success: true,
            message: "No players found..",
            api_version: "v1",
            data: []
        });
    }

    //const baseURL = "http://18.117.233.92:3000/public/images"; 

    // Process each player to include attendance data
    const playersWithAttendance = await Promise.all(players.map(async (player) => {
        // if (player.profile_photo) {
        //     player.profile_photo = baseURL + player.profile_photo;
        // }
        const baseURL = "http://18.117.233.92:3000";
     
      
      
        if (player.profile_photo && typeof player.profile_photo === 'string' && player.profile_photo.trim() !== "" && player.profile_photo.trim().toLowerCase() !== "null") {
            // Remove "./" from the beginning of the string if it exists
            let cleanPath = player.profile_photo.startsWith("./") ? player.profile_photo.substring(2) : player.profile_photo;
            player.profile_photo = baseURL + '/' + cleanPath;
        } else {
            player.profile_photo = null;
        }
    

        // Find attendance records for the current player
        const attendance = await attendanceCollection.find({ player_id: player.id, batch_id: player.batch_id,date:date }, { attendance_status: 1, player_id: 1 });

        return {
            ...player.toObject(), // Convert Mongoose document to plain object
            attendance: attendance || "No attendance record found.."
        };
    }));

    res.send({
        success: true,
        message: "Data fetched successfully...",
        api_version: "v1",
        data: playersWithAttendance
    });
} catch (error) {
    console.error(error);
    res.send({
        success: false,
        message: "Something went wrong....!",
        api_version: "v1",
        data: error.message
    });
}


  },
  

  Edit:async(req,res)=>{
      try {
        const CollectionName = "batchdata";
        const dtmfCollection = mongoose.model(CollectionName, Schema.batchdata);
        
        // Find a single document with status: 1 and matching id
        const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });
        
        if (result) {
          // Create an object to store the batch with staff data
          const batchData = {
            id: result.id,
            batch_name: result.batch_name,
            batch_timing: result.batch_timing,
            centre_name: result.centre_name,
            sports:result.sports,
            level_id: result.level_id,
            level_name: result.level_name,
            coach_id:result.coach_id,
            days:result.days,
            location:result.location,
            academy_name:result.academy_name,
            academy_id:result.academy_id,
            staff: [], // Add a staff array to store staff members
          };
          
          // Retrieve staff members based on unique coach_id values
          const uniqueCoachIds = [...new Set(result.coach_id)];
          
          // Retrieve staff members based on uniqueCoachIds
          const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
          const staffList = await staffCollection.find({ id: { $in: uniqueCoachIds } });
          
          // Find the staff members associated with this batch's coach_id
          const staffForBatch = staffList
            .filter((staff) => result.coach_id.includes(staff.id));
            //.map((staff) => ({ "staff_name": staff.staff_name }));
          
          // Add the staff data to the batch
          batchData.staff.push(...staffForBatch);
          
          // Send the batchData as the response
          res.send({
            success: true,
            message: "batch data fetched...",
            api_version: "v1",
            data: batchData
          });
          
          // Log the batchData
          console.log(batchData);
        } else {
          res.send({
            success: false,
            message: "No records found.",
            api_version: "v1",
            data: {}
          });
        }
        
        // Rest of your code...
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

   

   

    Update:async(req,res)=>{
        try{
          
          
          let updatedata = {
            
           updated_at: todays_dt,
         }
           
           let CollectionName ="batchdata";
           let adminCollection = mongoose.model(CollectionName, Schema.batchdata);
           updatedata.batch_name = req.body.batch_name;
           updatedata.academy_id = req.body.academy_id;
           updatedata.academy_name = req.body.academy_name;
           updatedata.coach_id = req.body.coach_id;
           updatedata.location = req.body.location;
           updatedata.batch_timing = req.body.batch_timing;
           updatedata.location = req.body.location;
           updatedata.centre_name = req.body.centre_name;
           updatedata.level_id = req.body.level_id;
           updatedata.level_name = req.body.level_name;
           updatedata.sports = req.body.sports;
          
           updatedata.days = req.body.days;



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
              let oollectionname = "batchdata";
              
              let collection = mongoose.model(oollectionname, Schema.batchdata);
              
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