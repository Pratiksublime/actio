const {Schema} = require('../../model/schema');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const {queryMongo,mongoose} = require('../../mongodb');
const { idCounter } = require("../../helper/counter");
const moment = require('moment');
const validate = require("../../helper/validate");

let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
module.exports = {
    
    Add: async (req, res) => {

        console.log('dssssssssssssd')
        try {
            let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
            // let campaignCollectionName = req.username + "campaign";
             //let classCollectionName = req.body.username + 'class';
             //let levelCollectionName = req.body.username+ 'lavel';
            // let campaignParameterCollectionName = req.username + 'campaign_parameter'
            let CollectionName ="mainaccounts";
            let adminCollection = mongoose.model(CollectionName, Schema.Mainaccounts);

           
             //let class_Collection = mongoose.model(classCollectionName, Schema.class);
            // let campaign_parameter_Collection = connection.model(campaignParameterCollectionName, Schema.campaign_parameter);
             //let Level_Collection = mongoose.model(levelCollectionName,Schema.Level);

            //  let _isertlavel ={

            //  }
            
            // if (req.body.level_name && req.body.level_name !== "" && req.body.level_name != 'undefined') {
            //     _isertlavel.level_name = req.body.level_name
            // }
            

            // console.log(_isertlavel);

            // let addAdminleval = await Level_Collection.insertMany(_isertlavel);

             
           
            // if (addAdminleval.length > 0) {
            //     res.send({
            //         api_version:"v2",
            //         success: true,
            //         message: 'Data added successfully..!',
            //         data: []
            //     });
            // } else {
            //     res.send({
            //         api_version:"v2",
            //         success: false,
            //         message: 'Data Can Not Be Added ..!',
            //         data: []
            //     });
            // }

        
            const _counter = await idCounter(
                
                adminCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)
            if (req.files !== null) {
                var element = req.files.logo;
                let now = moment();
                var image_name = now.format("YYYYMMDDHHmmss") + element.name;
                element.mv('./public/images/' + image_name);
                doc_data = image_name;
            } else {
                var doc_data = null;
            }

            let _insertData = {
                id:_counter,
                created_at: todays_dt,
                logo:doc_data,
                status: 1
            }
            if (req.body.academyemail && req.body.academyemail !== "" && req.body.academyemail != 'undefined') {
              _insertData.academyemail = req.body.academyemail
          }
            
          if (req.body.fullName && req.body.fullName !== "" && req.body.fullName != 'undefined') {
              _insertData.fullName = req.body.fullName
          }
          if (req.body.role_id && req.body.role_id !== "" && req.body.role_id != 'undefined') {
            _insertData.role_id = req.body.role_id
        }
          if (req.body.subscriberID && req.body.subscriberID !== "" && req.body.subscriberID != 'undefined') {
            _insertData.subscriberID = req.body.subscriberID
            }
            if (req.body.email && req.body.email !== "" && req.body.email != 'undefined') {
              _insertData.email = req.body.email
          }
          if (req.body.mobileno && req.body.mobileno !== "" && req.body.mobileno != 'undefined') {
            _insertData.mobileno = req.body.mobileno
          }
            
            if (req.body.address && req.body.address !== "" && req.body.address != 'undefined') {
              _insertData.address = req.body.address
          }
           
          if (req.body.academy_no && req.body.academy_no !== "" && req.body.academy_no != 'undefined') {
            _insertData.academy_no = req.body.academy_no
        }
          if (req.body.is_coach && req.body.is_coach !== "" && req.body.is_coach != 'undefined') {
            _insertData.is_coach = req.body.is_coach
        }
            if (req.body.academy_name && req.body.academy_name !== "" && req.body.academy_name != 'undefined') {
                _insertData.academy_name = req.body.academy_name
            }
            // if (req.body.logo && req.body.logo !== "" && req.body.logo != 'undefined') {
            //     _insertData.logo = req.body.logo
            // }
            if (req.body.centre_name && req.body.centre_name !== "" && req.body.centre_name != 'undefined') {
                _insertData.centre_name = req.body.centre_name
            }
            if (req.body.website && req.body.website !== "" && req.body.website != 'undefined') {
                _insertData.website = req.body.website
            }
            if (req.body.location && req.body.location !== "" && req.body.location != 'undefined') {
                _insertData.location = req.body.location
            }
            if (req.body.person_incharge && req.body.person_incharge !== "" && req.body.person_incharge != 'undefined') {
                _insertData.person_incharge = req.body.person_incharge
            }
            if (req.body.designation && req.body.designation !== "" && req.body.designation != 'undefined') {
                _insertData.designation = req.body.designation
            }
            if (req.body.identificationid && req.body.identificationid !== "" && req.body.identificationid != 'undefined') {
                _insertData.identificationid = req.body.identificationid
            }
            
            
            if (req.body.password && req.body.password !== "" && req.body.password != 'undefined') {
                _insertData.password = req.body.password
            }
            if (req.body.username && req.body.username !== "" && req.body.username != 'undefined') {
                _insertData.username = req.body.username
            }
            if (req.body.sports && req.body.sports !== "" && req.body.sports != 'undefined') {
                _insertData.sports = req.body.sports
            }
            

            console.log('_insertData..................');
            console.log(_insertData);
            let addAdmin = await adminCollection.insertMany([_insertData]);

             
           
            if (addAdmin.length > 0) {
                res.send({
                    api_version:"v1",
                    success: true,
                    message: 'Data added successfully..!',
                    data: { academy_id: _counter }
                });
            } else {
                res.send({
                    api_version:"v1",
                    success: false,
                    message: 'Data Can Not Be Added ..!',
                    data: []
                });
            }

        } catch (error) {
            console.log(error);
            res.send({
                api_version:"v2",
                success: false,
                message: 'Something Went Wrong...',
                data: error
            });
        }
    },
    list: async (req, res) => {
        try {
            const baseURL = "http://192.168.29.130:3018/public/images/";
            let result={};
            let CollectionName = "Mainaccounts";
            let dtmfCollection = mongoose.model(CollectionName, Schema.Mainaccounts);
            console.log('req.myID.............');
            console.log(req.myID)
            if(req.myID && req.query.academyId){
              result = await dtmfCollection.find({status:1, subscriberID: req.myID, id: req.query.academyId});

            }else{
               result = await dtmfCollection.find({status:1}).sort({ id: -1 });;
            }

            // if (result.logo) {
            //          result.logo = baseURL + result.logo;
            //       }

                  result = result.map(item => {
                    if (item.logo !== null) {
                      item.logo = baseURL + item.logo;
                    }
                    return item;
                  });
            
            let Collection = "sports";
            let Sport = mongoose.model(Collection, Schema.sports);
            let sports = await Sport.find({});
            
            let sportMap = {};
            sports.forEach((sport) => {
                sportMap[sport.id] = sport.sport_name;
            });
            
            result = result.map((item) => {
                let sportIds = item.sports.split(',').map((id) => Number(id));
                let sportNames = sportIds.map((id) => sportMap[id]);
                return {
                    ...item.toObject(),
                    sportNames: sportNames
                };
            });
            
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "account list fetched...",
                    api_version: "v2",
                    data: result
                });
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version: "v2",
                    data: result
                });
            }
            

        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something wentwrong....!",
                api_version:"v2",
                data: error.message
            })
        } 
    },

Add_Level: async(req,res)=>{

try {
    console.log(req.body);
    const { user_id,form_id,fields } = req.body;
    
        // Create a dynamic schema and model for the user based on the input
    collectionName = user_id+'fromcollection';
    const User = Schema.createDynamicSchemaForUser(user_id,form_id, collectionName, fields);
    
    //Check if the user already exists in the database
    const existingUser = await User.findOne({ username });

    //const level = await User.find({level_name});
    console.log("level.............");
    console.log(existingUser);
   
    // if (existingUser) {
    // // User exists, update the level_name and save the updated user document
    // if (Array.isArray(level_name)) {
    //   // If level_name is an array, push each item to the existingUser.level_name array
    //   level_name.forEach(item => existingUser.level_name.push(item.level_name));
    // } else {
    //   // If level_name is not an array, push the single value to the existingUser.level_name array
    //   existingUser.level_name.push(level_name);
    // }

    // console.log('Existing User Before Save:');
    // console.log(existingUser);

    // await existingUser.save();

    // console.log('Existing User After Save:');
    // console.log(existingUser);
    // res.status(200).json(existingUser);
    if (existingUser) {
        // User exists, use a Set to keep track of unique level_names
        const newLevelNames = new Set(existingUser.level_name);
    
        if (Array.isArray(level_name)) {
          // If level_name is an array, add each item to the Set to remove duplicates
          level_name.forEach(item => newLevelNames.add(item.level_name));
        } else {
          // If level_name is not an array, add the single value to the Set to remove duplicates
          newLevelNames.add(level_name);
        }
    
        // Convert the Set back to an array and update the existingUser.level_name
        existingUser.level_name = Array.from(newLevelNames);
    
        console.log('Existing User Before Save:');
        console.log(existingUser);
    
        await existingUser.save();
    
        console.log('Existing User After Save:');
        console.log(existingUser);
    
        res.json(existingUser);
    
          } else {
          // User does not exist, create a new user document and save it to the database
          const newUser = new User({ username, level_name });
          await newUser.save();
    
          res.status(201).json(newUser);
         }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    

},

AddFormdata: async (req, res) => {
  try {
    const { user_name, user_id, form_id, fields } = req.body;
      let CollectionName ="formfields";
      let FormCollection = mongoose.model(CollectionName, Schema.formfields);

      const _counter = await idCounter(
          FormCollection,
        'id')

       
  
    
    console.log('COUNTER _ :: ', _counter)

      let _insertData = {
          //id:_counter,
          created_at: todays_dt,
          status:1
         
      }
      
      if (user_name && user_name !== "" && user_name != 'undefined') {
        _insertData.user_name = user_name;
    }
    if (user_id && user_id !== "" && user_id != 'undefined') {
        _insertData.user_id = user_id;
    }

    if (form_id && form_id !== "" && form_id != 'undefined') {
        _insertData.form_id = form_id;
    }
    if (fields && fields !== "" && fields != 'undefined') {
        _insertData.fields = fields;
    }

    console.log('_insertData.......................');
      console.log(_insertData);
      

      let addCampaign = await FormCollection.insertMany([_insertData]);

     
      if (addCampaign.length > 0) {
          res.send({
              api_version:"v1",
              success: true,
              message: 'Data added successfully..!',
              data: []
          });
      } else {
          res.send({
              api_version:"v1",
              success: false,
              message: 'Data Can Not Be Added ..!',
              data: []
          });
      }

  } catch (error) {
      console.log(error);
      res.send({
          api_version:"v1",
          success: false,
          message: 'Something Went Wrong...',
          data: error
      });
  }
},



AddLeveldata: async(req,res)=>{

  try {
    let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log(req.body);
    const { user, user_id, form_id, fields } = req.body;

    // Create a dynamic schema and model for the user based on the input
    collectionName = user_id + 'formfields';
    let User = mongoose.model(collectionName, Schema.formfields);

    const _counter = await idCounter(
                
      User,
      'id'
  )

  console.log('COUNTER _ :: ', _counter)

    
    let _insertData = {
        ids:_counter,
        created_at: todays_dt,
        status: 1
    };

    if (user && user !== "" && user != 'undefined') {
        _insertData.user = user;
    }
    if (user_id && user_id !== "" && user_id != 'undefined') {
        _insertData.user_id = user_id;
    }

    if (form_id && form_id !== "" && form_id != 'undefined') {
        _insertData.form_id = form_id;
    }
    if (fields && fields !== "" && fields != 'undefined') {
        _insertData.fields = fields;
    }

    

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ user_id: user_id + 'formfields' });

   

    if (existingUser) {
        
        res.send({
            success: false,
            message: "no data send..",
            api_version: "v1",
            data: existingUser
        });
    } else {
        
        const newUser = new User(_insertData); 
        let result = await newUser.save();

        res.send({
            success: true,
            message: "data send..",
            api_version: "v1",
            data: result
        });
    }
    
   

} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

        
    
    },


  fromlistbyid:async(req,res)=>{
    try{
    
    collectionName = user_id + 'formfields';
    let User = mongoose.model(collectionName, Schema.formfields);
    let result = await collectionName.find({status:1});

    }
    catch{

    }

},


    Update:async(req,res)=>{
        try{
          
          let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
           if (req.files !== null) {
            var element = req.files.logo;
            let now = moment();
            var image_name = now.format("YYYYMMDDHHmmss") + element.name;
            element.mv('./public/images/' + image_name);
            doc_data = image_name;
        } else {
            var doc_data = null;
        }

           let updatedata = {
            
            updated_at: todays_dt,
            logo:doc_data
            
        }
           
           let CollectionName ="mainaccounts";
           let adminCollection = mongoose.model(CollectionName, Schema.Mainaccounts);

           updatedata.academy_name = req.body.academy_name;
          updatedata.academyemail = req.body.academyemail;
           updatedata.address = req.body.address;
           updatedata.centre_name = req.body.centre_name;
           updatedata.website = req.body.website;
           updatedata.location = req.body.location;
           updatedata.person_incharge = req.body.person_incharge;
           updatedata.designation = req.body.designation;
           updatedata.identificationid = req.body.identificationid;
           updatedata.contact_no = req.body.contact_no;
           updatedata.email = req.body.email;

           updatedata.password = req.body.password; 
           updatedata.username = req.body.username;
           updatedata.sports = req.body.sports; 

          const id = req.body.id;

           let result = await adminCollection.updateOne({id: req.body.id},updatedata);
          if (result) {
            res.send({
              success: true,
              message: "Updated Successfully....",
              data: { academy_id: id },
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

    Edit:async(req,res)=>{

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
                let CollectionName ="mainaccounts";
                let adminCollection = mongoose.model(CollectionName, Schema.Mainaccounts);
                let result = await adminCollection.find({
                  status: 1,
                  id: req.body.id,
                })

                if (result.length > 0) {
                  res.send({
                    success: true,
                    message: "info fetched....!",
                    data: result,
                  });
                } else {
                  res.send({
                    success: false,
                    message: "No record Found...!",
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
              let oollectionname = "mainaccounts";
              let collection = mongoose.model(oollectionname, Schema.Mainaccounts);
            
              let result = await collection.updateOne({id: req.body.id},{status:2});
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


      

      superadminList: async (req, res) => {
        try {
            let CollectionName = "superadminlogins"
            let adminCollection = mongoose.model(CollectionName, Schema.superadminlogins);

            result = await adminCollection.find({ id: req.myID});
    
           
            if (result.length > 0) {
                res.send({
                    success: true,
                    status:200,
                    message: " list fetched...",
                    api_version:"v1",
                    data: result
                })
            } else {
                res.send({
                    success: true,
                    message: "no record found..",
                    api_version:"v1",
                    data: result
                })
            }
    
        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something wentwrong....!",
                api_version:"v1",
                data: error.message
            })
        }
    },
      superadminlogin:async(req,res)=>{
        try {
          console.log(req.body);
          const { username, password } = req.body;
                
          let usersCollection = "superadminlogins";
          let adminCollection = mongoose.model(usersCollection, Schema.superadminlogins);
        
          let result = await adminCollection.findOne({ username, password });
        
          console.log('eddeeeeeeeeeeeee');
          console.log(result);
        
          if (result) { // Check if result is not null
            res.send({
              success: true,
              message: "Login successful....!",
              data: result,
            });
          } else {
            res.send({
              success: false,
              message: "Invalid credentials...!",
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
      

    
}