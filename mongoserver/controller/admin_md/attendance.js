const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
    

  Add:async (req, res) => {
    try {
      const { player_id, attendance_status, date, academy_id, academy_name, level_id, level_name, add_by,batch_id, coach_id } = req.body;
      
      const CollectionName = "Attendance";
      const Collection = mongoose.model(CollectionName, Schema.Attendance);
      
      // Check if a document with the same date already exists
      console.log('date...........');
      console.log(date);
      const existingDocument = await Collection.findOne({ date: date, player_id: player_id ,batch_id:batch_id});
      
      if (existingDocument) {
          // Update the attendance status if document exists
          await Collection.updateOne({ id: existingDocument.id }, { $set: { attendance_status: attendance_status } });
          
          res.send({
              api_version: "v1",
              success: true,
              message: 'Data updated successfully..!',
              data: []
          });
      } else {
          // If document does not exist, insert a new one
          // Fetch the counter asynchronously
          const _counter = await idCounter(Collection, 'id');
          
          // Prepare data to be inserted
          const _insertData = {
              id: _counter,
              status: 1,
              created_at: todays_dt,
              ...req.body
          };
          
          const addedData = await Collection.insertMany([_insertData]);
          
          res.send({
              api_version: "v1",
              success: addedData.length > 0,
              message: addedData.length > 0 ? 'Data added successfully..!' : 'Data Can Not Be Added ..!',
              data: []
          });
      }
  
  } catch (error) {
      console.error(error); 
      res.status(500).send({
          api_version: "v1",
          success: false,
          message: 'Something Went Wrong...',
          data: error
      });
  }
  
},

    List: async (req, res) => {
      try {
        let CollectionName = "Attendance";
        let dtmfCollection = mongoose.model(CollectionName, Schema.Attendance);
        let result = await dtmfCollection.find({ status: 1,add_by:myID }).sort({ id: -1 });;
    
       
    
        if (result.length > 0) {
            res.send({
                success: true,
                message: "list fetched...", 
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
        });
    }
    
    
  },

  Edit: async (req, res) => {
    try {
      let CollectionName = "Attendance";
      let dtmfCollection = mongoose.model(CollectionName, Schema.Attendance);
      const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });
  
      if (result) {
        
          
  
          res.send({
              success: true,
              message: "list fetched...",
              api_version: "v1",
              data: result
          });
      } else {
          res.send({
              success: false,
              message: "no record found..",
              api_version: "v1",
              data: null // Send null data if no record is found
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



    
   

    Update:async(req,res)=>{
        try{


            if (req.files !== null) {
                var element = req.files.profile_photo;
                let now = moment();
                var image_name = now.format("YYYYMMDDHHmmss") + element.name;
                element.mv('./public/images/' + image_name);
                doc_data = image_name;
            } else {
                var doc_data = null;
            }
    
              
          
          
           let updatedata = {
            
            updated_at: todays_dt,
            profile_photo:doc_data
            
            
        }
           
           let CollectionName ="Attendance";
           let adminCollection = mongoose.model(CollectionName, Schema.Attendance);
          
           updatedata.player_id = req.body.player_id;
           updatedata.status = req.body.status;
           updatedata.parent_name = req.body.parent_name;
           updatedata.date = req.body.date;
           updatedata.parent_no = req.body.parent_no;
           updatedata.email_id = req.body.email_id;
           updatedata.gender = req.body.gender;
           updatedata.profile_photo = req.body.profile_photo;
           updatedata.academy_id = req.body.academy_id;

           updatedata.level_id =req.body.level_id;
           updatedata.batch_id = req.body.batch_id;
           updatedata.coche_id =req.body.coche_id;
          
           updatedata.id = req.body.id;



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
              let oollectionname = "Attendance";
              
              let collection = mongoose.model(oollectionname, Schema.Attendance);
              
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