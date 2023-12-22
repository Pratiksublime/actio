const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
    

    Add: async (req, res) => {
        try {
            const { player_name,player_last_name,dob,age,parent_name,parent_no,email_id,gender,profile_photo,academy_id,level_id,batch_id,payment_type } = req.body;
        
            
            if (req.files !== null) {
                var element = req.files.profile_photo;
                let now = moment();
                var image_name = now.format("YYYYMMDDHHmmss") + element.name;
                element.mv('./public/images/' + image_name);
                doc_data = image_name;
            } else {
                var doc_data = null;
            }

            let CollectionName = "players";
            let CurriculumCollection = mongoose.model(CollectionName, Schema.players);
        
            const _counter = await idCounter(CurriculumCollection, 'id');
            console.log('COUNTER _ :: ', _counter);
        
            const _insertData = {
                id: _counter,
                status: 1,
                profile_photo:doc_data,
                created_at: todays_dt
            };
            
           
            if (player_name) _insertData.player_name = player_name;
            if (player_last_name) _insertData.player_last_name = player_last_name;
            if (dob) _insertData.dob = dob;
            if (age) _insertData.age = age;

            if (parent_name) _insertData.parent_name = parent_name;
            if (parent_no) _insertData.parent_no = parent_no;
            if (email_id) _insertData.email_id = email_id;
            if (gender) _insertData.gender = gender;
            if (profile_photo) _insertData.profile_photo = profile_photo;
            if (academy_id) _insertData.academy_id = academy_id;
            if (level_id) _insertData.level_id = level_id;
            if (batch_id) _insertData.batch_id = batch_id;
            if (payment_type) _insertData.payment_type = payment_type;
            
            
            
            
            
            let addCurriculum = await CurriculumCollection.insertMany([_insertData]);
        
            if (addCurriculum.length > 0) {
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
      // Define the Player model
      const playerCollectionName = "players";
      const Player = mongoose.model(playerCollectionName, Schema.players);
    
      
      const players = await Player.aggregate([
        {
          $match: {
            status: 1
          }
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
          $project: {
            _id: 0, 
            id: 1, 
            player_name:1,
            player_last_name:1,
            dob:1,
            age:1,
            parent_name:1,
            parent_no:1,
            email_id:1,
            gender:1,
            academy_id:1,
            level_id:1,
            batch_id:1,
            payment_type:1,
            profile_photo: 1, 
            academy_name: "$academy.academy_name", 
           
          }
        },
        {
          $sort: { id: -1 } // Sort by id in descending order
        }
      ]);
    
      const baseURL = "http://192.168.29.130:3018/public/images/";
    
      
      players.forEach(player => {
        if (player.profile_photo) {
          player.profile_photo = baseURL + player.profile_photo;
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
    try {
      let CollectionName = "players";
      let dtmfCollection = mongoose.model(CollectionName, Schema.players);
      const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });
  
      if (result) {
        
          
  
          res.send({
              success: true,
              message: "level fetched...",
              api_version: "v1",
              data: result
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
           
           let CollectionName ="players";
           let adminCollection = mongoose.model(CollectionName, Schema.players);
          
           updatedata.player_name = req.body.player_name;
           updatedata.player_last_name = req.body.player_last_name;
           updatedata.parent_name = req.body.parent_name;
           updatedata.dob = req.body.dob;
           updatedata.parent_no = req.body.parent_no;
           updatedata.email_id = req.body.email_id;
           updatedata.gender = req.body.gender;
           updatedata.profile_photo = req.body.profile_photo;
           updatedata.academy_id = req.body.academy_id;

           updatedata.level_id =req.body.level_id;
           updatedata.batch_id = req.body.batch_id;
           updatedata.payment_type =req.body.payment_type;
          
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
              let oollectionname = "players";
              
              let collection = mongoose.model(oollectionname, Schema.players);
              
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