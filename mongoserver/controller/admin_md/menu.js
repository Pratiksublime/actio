const {Schema} = require('../../model/schema');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const {queryMongo,mongoose} = require('../../mongodb');
const { idCounter } = require("../../helper/counter");
const moment = require('moment');
const validate = require("../../helper/validate");

module.exports = {

Add: async(req,res)=>{

    try {
        let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
        let CollectionName = "menu_academies";
        let adminCollection = mongoose.model(CollectionName, Schema.menu_academies);
        console.log(req.body);
    
        for (const inputData of req.body) {
            const _counter = await idCounter( 
                adminCollection,
                'id'
            );
    
            const _insertData = {
                id: _counter,
                created_at: todays_dt,
                status: 1,
                ...inputData, 
            };
    
            console.log('Inserting data:');
            console.log(_insertData);
    
            try {
                let result = await adminCollection.insertMany([_insertData]);
                
            } catch (err) {
                console.error(err);
                
            }
        }
    
        res.send({
            success: true,
            message: "Data sent...",
            api_version: "v1",
            data: req.body, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    


},

Update: async(req,res)=>{

    try {
        let CollectionName = "menupermissions";
        let adminCollection = mongoose.model(CollectionName, Schema.menupermissions);
        console.log(req.body);
      
        let { level_id, role_id, academy_id } = req.body;
      
        // Create a query object with the conditions
        let query = {};
      
        if (level_id) {
          query.level_id = parseInt(level_id, 10);
        }
      
        if (role_id) {
          query.role_id = role_id;
        }
      
        if (academy_id) {
          query.academy_id = academy_id;
        }
      
        const _insertData = {
          ...req.body, // Use the entire req.body as the update data
        };
      
        console.log('Inserting data:');
        console.log(_insertData);
      
        try {
          // Update the document based on the query conditions
          let result = await adminCollection.updateOne(query, _insertData);
      
          // Handle the result if needed
          if (result.nModified > 0) {
            // The document was updated
            console.log('Document updated successfully');
          } else {
            // The document was not updated, it may not have met the conditions
            console.log('No matching document found for update');
          }
        } catch (err) {
          console.error(err);
          // Handle the error if needed
        }
      
        res.send({
          success: true,
          message: "Data sent...",
          api_version: "v1",
          data: req.body,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      

},

List: async (req, res) => {
    try {
        let CollectionName = "menu_academies"
        let dtmfCollection = mongoose.model(CollectionName,Schema.menu_academies)

        let result = await dtmfCollection.find({role: { $ne: 1 }})
        if (result.length > 0) {
            res.send({
                success: true,
                message: "Sport list fetched...",
                api_version:"v1",
                data: result
            })
        } else {
            res.send({
                success: false,
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

menupermissions: async (req, res) => {
    
    try {
        let CollectionName = "menupermissions";
        let adminCollection = mongoose.model(CollectionName, Schema.menupermissions);
        console.log('req.body.................');
        console.log(req.body);
      
        let { level_id, role_id, academy_id } = req.body;
      
        // Create a query object with the conditions
        let query = {};
      
        if (level_id) {
          query.level_id = parseInt(level_id, 10);
        }
      
        if (role_id) {
          query.role_id = role_id;
        }
      
        if (academy_id) {
          query.academy_id = academy_id;
        }
      
        const _insertData = {
          ...req.body,
        };
      
        console.log('Inserting data:');
        console.log(_insertData); 
      
        
          // Check if a document with the specified conditions exists
          const existingDocument = await adminCollection.findOne(query);
      
          if (existingDocument) {
            // Document exists, update it
            let result = await adminCollection.updateOne(query, _insertData);
      
            // Handle the result if needed
            if (result.nModified > 0) {
              console.log('Document updated successfully');
            } else {
              console.log('No changes made to the document');
            }
          } else {
            // Document does not exist, add a new one
            let result = await adminCollection.insertMany(_insertData);
      
            // Handle the result if needed
            console.log('Document added successfully');
          }
        
      
        res.send({
          success: true,
          message: "Data sent...",
          api_version: "v1",
          data: req.body,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      
    
},
MenuList: async (req, res) => {
    
try {
  // Define collection names and models
  let CollectionName = "menupermissions";
  let Collection = mongoose.model(CollectionName, Schema.menupermissions);

  let CollectionMenu = mongoose.model("menu_academies", Schema.menu_academies);

  let { level_id, role_id, academy_id } = req.body;

  

  let query = {};

  if (level_id) {
      query.level_id = parseInt(level_id, 10);
  }

  if (role_id) {
      query.role_id = role_id;
  }

  if (academy_id) {
      query.academy_id = academy_id;
  }

  if (role_id == 1) {
    let menuList = await CollectionMenu.find({ id: { $in: [ 2, 3, 4] } }).sort({ id: 1 });

  //let menuList = await CollectionMenu.find().sort({ id: 1 });
      res.send({
          success: true,
          message: "Menu list fetched...",
          api_version: "v1",
          data: menuList
      });
  } else {
    if (Object.keys(query).length > 0) {
      let levelDataResults = await Collection.find(query);

      if (levelDataResults.length > 0) {
          let allMenuData = [];

          // for (const result of levelDataResults) {
          //     for (const menuId of result.menu_id.id) {
          //         let menuData = await CollectionMenu.findOne({
          //             id: menuId
          //         });
          //         if (menuData) {
          //             allMenuData.push(menuData);
          //         }
          //     }
          // }
          for (const result of levelDataResults) {
            for (const menu of result.menu_id) {
                let menuData = await CollectionMenu.findOne({
                    id: menu.id
                });
                if (menuData) {
                    // Also get the operations array for this menuId
                    let menuWithOperations = {
                        ...menuData._doc,
                        operations: menu.operations
                    };
                    allMenuData.push(menuWithOperations);
                }
            }
        }

          let menuList = allMenuData.map(menuData => {
              return {
                  id: menuData.id,
                  profile_id: menuData.profile_id,
                  class: menuData.class,
                  path: menuData.path,
                  title: menuData.title,
                  iconType: menuData.iconType,
                  icon: menuData.icon,
                  role: menuData.role,
                  submenu: menuData.submenu,
                  operations: menuData.operations
              };
          });

          res.send({
              success: true,
              message: "Menu list fetched...",
              api_version: "v1",
              data: menuList
          });
      }
     }
      else {
          res.send({
              success: true,
              message: "No record found..",
              api_version: "v1",
              data: []
          });
      }
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

}