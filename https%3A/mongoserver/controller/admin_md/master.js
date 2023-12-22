
//const Schema = require('');

const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const {queryMongo,mongoose} = require('../../mongodb');

module.exports = {

    Add: async (req, res) => {
        try {
            
            let CollectionName ="sports";
            let campaignCollection = mongoose.model(CollectionName, Schema.sports);

         

            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id:_counter,
                status:1
               
            }
            
            if (req.body.sport_name && req.body.sport_sport_name !== "" && req.body.sport_name != 'undefined') {
                _insertData.sport_name = req.body.sport_name
            }
            
            

            let addCampaign = await campaignCollection.insertMany([_insertData]);

           
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


    Updatesport :async(req,res)=>{

        const validationRule = {
            id: "required",
        }
        validate(req.body, validationRule, {}, async (err, status) => {
            if (!status) {
                res.send({
                    success: false,
                    message: "validation error.....!",
                    api_version:"v1",
                    data: err
                })
            }
            else {
                try {
                    let collectionname = "sports"
                    let collection = mongoose.model(collectionname, Schema.sports)

                    let _existingDepartment = await collection.find({ id: { $ne: req.body.id }, sport_name: { "$regex": req.body.sport_name }})
                    console.log("_existingDepartment :: ", _existingDepartment)
                    if (_existingDepartment.length > 0) {
                        res.send({
                            success: false,
                            message: "Sports Already Existed....!",
                            data: []
                        })                                                                      
                    } else {
                        let update = {
                            //mdf_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        }
                        if (req.body.sport_name && req.body.sport_name !== "" && req.body.sport_name !== "undefined" && typeof req.body.sport_name !== "undefined") {
                            update.sport_name = req.body.sport_name
                        }
                        

                        console.log(update);
                        let result = await collection.updateOne({ id: req.body.id }, update)
                        if (result) {
                            res.send({
                                success: true,
                                message: "Record update",
                                api_version:"v1",
                                data: result
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "Not Updated Successfully",
                                api_version:"v2",
                                data: []
                            })
                        }
                    }

                } catch (error) {
                    res.send({
                        success: false,
                        message: "something went wrong....!",
                        api_version:"v2",
                        data: error.message
                    })
                }
            }

        })

    },
    Adddesignation: async (req, res) => {
        try {
            
            let CollectionName ="designations";
            let campaignCollection = mongoose.model(CollectionName, Schema.designations);

         

            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id:_counter,
                status:1
               
            }
            
            if (req.body.name && req.body.sport_name !== "" && req.body.name != 'undefined') {
                _insertData.name = req.body.name
            }
            
            

            let addCampaign = await campaignCollection.insertMany([_insertData]);

           
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


    Updatedesignation :async(req,res)=>{

        const validationRule = {
            id: "required",
        }
        validate(req.body, validationRule, {}, async (err, status) => {
            if (!status) {
                res.send({
                    success: false,
                    message: "validation error.....!",
                    api_version:"v1",
                    data: err
                })
            }
            else {
                try {
                    let collectionname = "designations"
                    let collection = mongoose.model(collectionname, Schema.designations)

                    let _existingDepartment = await collection.find({ id: { $ne: req.body.id }, name: { "$regex": req.body.name }})
                    console.log("_existingDepartment :: ", _existingDepartment)
                    if (_existingDepartment.length > 0) {
                        res.send({
                            success: false,
                            message: "designations Already Existed....!",
                            data: []
                        })                                                                      
                    } else {
                        let update = {
                            //mdf_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        }
                        if (req.body.name && req.body.name !== "" && req.body.name !== "undefined" && typeof req.body.name !== "undefined") {
                            update.name = req.body.name
                        }
                        

                        console.log(update);
                        let result = await collection.updateOne({ id: req.body.id }, update)
                        if (result) {
                            res.send({
                                success: true,
                                message: "Record update",
                                api_version:"v1",
                                data: result
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "Not Updated Successfully",
                                api_version:"v2",
                                data: []
                            })
                        }
                    }

                } catch (error) {
                    res.send({
                        success: false,
                        message: "something went wrong....!",
                        api_version:"v2",
                        data: error.message
                    })
                }
            }

        })

    },
    sportslist: async (req, res) => {
        try {
            let CollectionName = "sports"
            let dtmfCollection = mongoose.model(CollectionName,Schema.sports)

            let result = await dtmfCollection.find({
                
            })
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "Sport list fetched...",
                    api_version:"v2",
                    data: result
                })
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version:"v2",
                    data: result
                })
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

    designationlist: async (req, res) => {
        try {
            let CollectionName = "designations"
            let Collection = mongoose.model(CollectionName,Schema.designations);

            

            let result = await Collection.find({
                
            })

            console.log('kkkkkkkkkkkkkk');

            console.log(result);
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "designations list fetched...",
                    api_version:"v2",
                    data: result
                })
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version:"v2",
                    data: result
                })
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


    sportdelete: async (req, res) => {
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
              let oollectionname = "sports";
              let collection = mongoose.model(oollectionname, Schema.sports);
            
              let result = await collection.deleteOne({id: req.body.id});
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

//add
      designationdelete: async (req, res) => {
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
              let oollectionname = "designations";
              let collection = mongoose.model(oollectionname, Schema.designations);
            
              let result = await collection.deleteOne({id: req.body.id});
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

    Inputmaster:async(req,res)=>{
        try {
                
            let CollectionName ="Inputmaster";
            let campaignCollection = mongoose.model(CollectionName, Schema.Inputmaster);

        

            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id:_counter
                
            
            }

            console.table([req.body]);
            
            if (req.body.name && req.body.sport_name !== "" && req.body.name != 'undefined') {
                _insertData.name = req.body.name
            }
            if (req.body.add_by && req.body.sport_add_by !== "" && req.body.add_by != 'undefined') {
                _insertData.add_by = req.body.add_by
            }
            
            

            let addinputType = await campaignCollection.insertMany([_insertData]);

        
            if (addinputType.length > 0) {
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
    Inputmasterlist:async(req,res)=>{
        try {
                
            let CollectionName ="Inputmaster";
            let Collection = mongoose.model(CollectionName, Schema.Inputmaster);

        
            let result = await Collection.find({
                
            })
           
            

        
            if (result.length > 0) {
                res.send({
                    api_version:"v1",
                    success: true,
                    message: 'Data successfully..!',
                    data: result
                });
            } else {
                res.send({
                    api_version:"v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
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


    Headerlist:async(req,res)=>{
        try {
                
            let CollectionName ="HeaderCollection";
            let Collection = mongoose.model(CollectionName, Schema.HeaderCollection);

        
            let result = await Collection.find({
                
            })
           
            

        
            if (result.length > 0) {
                res.send({
                    api_version:"v1",
                    success: true,
                    message: 'Data successfully..!',
                    data: result
                });
            } else {
                res.send({
                    api_version:"v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
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
    }
    
    
}