const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
//app.use('/public', express.static('public'));
const {queryMongo,mongoose} = require('../../mongodb');

let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
    

    Add: async (req, res) => {
        try {
            const { batch_name,batch_timing,location,academy_name,centre_name,academy_id,level_id,coach_id,days,level_name } = req.body;
        
            
            let CollectionName = "batchdata";
            let campaignCollection = mongoose.model(CollectionName, Schema.batchdata);
        
            const _counter = await idCounter(campaignCollection, 'id');
            console.log('COUNTER _ :: ', _counter);
        
            const _insertData = {
                id: _counter,
                status: 1,
                created_at: todays_dt
            };
            if (coach_id) _insertData.coach_id = coach_id;
            if (batch_name) _insertData.batch_name = batch_name;
            if (batch_timing) _insertData.batch_timing = batch_timing;
            if (location) _insertData.location = location;
            if (centre_name) _insertData.centre_name = centre_name;
           
            if (academy_id) _insertData.academy_id = academy_id;
            if (academy_name) _insertData.academy_name = academy_name;
            if (level_id) _insertData.level_id = level_id;
            if (level_name) _insertData.level_name = level_name;
            if (days) _insertData.days = days;
            
            
            
            let addCampaign = await campaignCollection.insertMany([_insertData]);
        
            if (addCampaign.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data added successfully..!',
                    data: []
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be Added ..!',
                    data: []
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                api_version: "v1",
                success: false,
                message: 'Something Went Wrong...',
                data: error
            });
        }
        
    },


    Batchlist:async(req,res)=>{
      try {
        const CollectionName = "batchdata";
        const dtmfCollection = mongoose.model(CollectionName, Schema.batchdata);
      
       
        const results = await dtmfCollection.find({ status: 1 }).sort({ id: -1 });;
      
       
        const batchData = {};
      
        
        const uniqueCoachIds = [...new Set(results.flatMap((document) => document.coach_id))];
      
       
        const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
        const staffList = await staffCollection.find({ id: { $in: uniqueCoachIds } });
      
       
        for (const document of results) {
          const { id, batch_name, batch_timing, centre_name,level_id,level_name, coach_id ,days} = document;
      
         
          if (!batchData[id]) {
            batchData[id] = {
              id,
              batch_name,
              batch_timing,
              centre_name,
              level_id,
              level_name,
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
        let playerCollectionName = "players";
        let playerCollection = mongoose.model(playerCollectionName, Schema.players);
        
        let attendanceCollectionName = "Attendance";
        let attendanceCollection = mongoose.model(attendanceCollectionName, Schema.Attendance);
        
        const batchId = req.body.id;
        
        const player = await playerCollection.findOne({ status: 1, batch_id: batchId }).sort({ id: -1 });;
        
        if (!player) {
            return res.send({
                success: true,
                message: "No player found..",
                api_version: "v1",
                data: [] 
            });
        }
        
        
       const baseURL = "http://192.168.29.130:3018/public/images/";
        if (player.profile_photo) {
            player.profile_photo = baseURL + player.profile_photo;
        }
        
        const attendance = await attendanceCollection.findOne({ player_id: player.id, batch_id: player.batch_id }, { attendance_status: 1, player_id: 1 });
        
        res.send({
            success: true,
            message: "Data fetched successfully...",
            api_version: "v1",    
            data: [{
                player,
                attendance: attendance || "No attendance record found.."
            }]
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
    
    //   try {
    //     let playerCollectionName = "players";
    //     let playerCollection = mongoose.model(playerCollectionName, Schema.players);
        
    //     let attendanceCollectionName = "Attendance";
    //     let attendanceCollection = mongoose.model(attendanceCollectionName, Schema.Attendance);
        
    //     // Assuming req.body.id is the player_id you are looking for
    //     const batchId = req.body.id;
        
    //     const player = await playerCollection.findOne({ status: 1, batch_id: batchId });
        
    //     if (!player) {
    //         return res.send({
    //             success: true,
    //             message: "No player found..",
    //             api_version: "v1",
    //             data: [] 
    //         });
    //     }
        
    //     // Retrieve attendance status from the Attendance collection using player_id
    //     const attendance = await attendanceCollection.findOne({ player_id: player.id,batch_id:player.batch_id }, { attendance_status: 1,player_id:1});
        
    //     // Include both player and attendance data in the response
    //     res.send({
    //         success: true,
    //         message: "Data fetched successfully...",
    //         api_version: "v1",    
    //         data: [{
    //             player,
    //             attendance: attendance || "No attendance record found.."
    //         }]
    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.send({
    //         success: false,
    //         message: "Something went wrong....!",
    //         api_version: "v1",
    //         data: error.message
    //     });
    // }
    
    
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