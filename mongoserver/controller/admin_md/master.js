
//const Schema = require('');

const { Schema } = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const { queryMongo, mongoose } = require('../../mongodb');
// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');


module.exports = {

    Add: async (req, res) => {
        try {

            let CollectionName = "sports";
            let campaignCollection = mongoose.model(CollectionName, Schema.sports);



            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id: _counter,
                status: 1

            }

            if (req.body.sport_name && req.body.sport_sport_name !== "" && req.body.sport_name != 'undefined') {
                _insertData.sport_name = req.body.sport_name
            }



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


    Updatesport: async (req, res) => {

        const validationRule = {
            id: "required",
        }
        validate(req.body, validationRule, {}, async (err, status) => {
            if (!status) {
                res.send({
                    success: false,
                    message: "validation error.....!",
                    api_version: "v1",
                    data: err
                })
            }
            else {
                try {
                    let collectionname = "sports"
                    let collection = mongoose.model(collectionname, Schema.sports)

                    let _existingDepartment = await collection.find({ id: { $ne: req.body.id }, sport_name: { "$regex": req.body.sport_name } })
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
                                api_version: "v1",
                                data: result
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "Not Updated Successfully",
                                api_version: "v2",
                                data: []
                            })
                        }
                    }

                } catch (error) {
                    res.send({
                        success: false,
                        message: "something went wrong....!",
                        api_version: "v2",
                        data: error.message
                    })
                }
            }

        })

    },
    Adddesignation: async (req, res) => {
        try {

            let CollectionName = "designations";
            let campaignCollection = mongoose.model(CollectionName, Schema.designations);



            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id: _counter,
                status: 1

            }

            if (req.body.name && req.body.sport_name !== "" && req.body.name != 'undefined') {
                _insertData.name = req.body.name
            }



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


    Updatedesignation: async (req, res) => {

        const validationRule = {
            id: "required",
        }
        validate(req.body, validationRule, {}, async (err, status) => {
            if (!status) {
                res.send({
                    success: false,
                    message: "validation error.....!",
                    api_version: "v1",
                    data: err
                })
            }
            else {
                try {
                    let collectionname = "designations"
                    let collection = mongoose.model(collectionname, Schema.designations)

                    let _existingDepartment = await collection.find({ id: { $ne: req.body.id }, name: { "$regex": req.body.name } })
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
                                api_version: "v1",
                                data: result
                            })
                        } else {
                            res.send({
                                success: false,
                                message: "Not Updated Successfully",
                                api_version: "v2",
                                data: []
                            })
                        }
                    }

                } catch (error) {
                    res.send({
                        success: false,
                        message: "something went wrong....!",
                        api_version: "v2",
                        data: error.message
                    })
                }
            }

        })

    },
    sportslist: async (req, res) => {
        try {
            let CollectionName = "sports"
            let dtmfCollection = mongoose.model(CollectionName, Schema.sports)

            let result = await dtmfCollection.find({

            })
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "Sport list fetched...",
                    api_version: "v2",
                    data: result
                })
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version: "v2",
                    data: result
                })
            }

        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something wentwrong....!",
                api_version: "v2",
                data: error.message
            })
        }
    },

    designationlist: async (req, res) => {
        try {
            let CollectionName = "designations"
            let Collection = mongoose.model(CollectionName, Schema.designations);



            let result = await Collection.find({

            })

            console.log('kkkkkkkkkkkkkk');

            console.log(result);
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "designations list fetched...",
                    api_version: "v2",
                    data: result
                })
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version: "v2",
                    data: result
                })
            }

        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something wentwrong....!",
                api_version: "v2",
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

                    let result = await collection.deleteOne({ id: req.body.id });
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

                    let result = await collection.deleteOne({ id: req.body.id });
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

    Inputmaster: async (req, res) => {
        try {

            let CollectionName = "Inputmaster";
            let campaignCollection = mongoose.model(CollectionName, Schema.Inputmaster);



            const _counter = await idCounter(
                campaignCollection,
                'id'
            )
            console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                id: _counter


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
    Inputmasterlist: async (req, res) => {
        try {

            let CollectionName = "Inputmaster";
            let Collection = mongoose.model(CollectionName, Schema.Inputmaster);


            let result = await Collection.find({

            })




            if (result.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data successfully..!',
                    data: result
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
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


    Headerlist: async (req, res) => {
        try {

            let CollectionName = "HeaderCollection";
            let Collection = mongoose.model(CollectionName, Schema.HeaderCollection);


            let result = await Collection.find({

            })




            if (result.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data successfully..!',
                    data: result
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
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


    AddSkill: async (req, res) => {
        try {

            const Collection = mongoose.model("skills", Schema.skills);


            const { sport_id, skill_name } = req.body;

            // Generate ID counter
            const _counter = await idCounter(Collection, 'id');

            let _insertData = {
                id: _counter,
                status: 1
            };

            if (sport_id) {
                _insertData.sport_id = sport_id;
            }

            if (skill_name) {
                _insertData.skill_name = skill_name;
            }

            let addCampaign = await Collection.insertMany([_insertData]);

            if (addCampaign.length > 0) {
                return res.status(201).send({
                    api_version: "v1",
                    success: true,
                    message: 'Data added successfully!',
                    data: []
                });
            } else {
                return res.status(400).send({
                    api_version: "v1",
                    success: false,
                    message: 'Data cannot be added.',
                    data: []
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).send({
                api_version: "v1",
                success: false,
                message: 'Something went wrong.',
                data: { reason: error.message }
            });
        }
    },

    Skilllist: async (req, res) => {
        try {


            let Collection = mongoose.model("skills", Schema.skills);


            let result = await Collection.find({ "status": 1, sport_id: req.query.id })
            if (result.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data successfully..!',
                    data: result
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
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

    sportslistbyid: async (req, res) => {


        let Collection = mongoose.model("Mainaccounts", Schema.Mainaccounts);
        let levelCollection = mongoose.model("leveldata", Schema.leveldata);
        let resultdata = {};
        try {
            // Retrieve documents from the "Mainaccounts" collection
            if (req.query.level_id && req.query.level_id !== null) {

                resultdata = await levelCollection.find(
                    { "status": 1, "academy_id": req.query.id, "id": req.query.level_id },
                    { "sports": 1, "_id": 0 }
                );
            }
            else {
                resultdata = await Collection.find(
                    { "status": 1, "id": req.query.id },
                    { "sports": 1, "_id": 0 }
                );
            }



            // Extract the "sports" field from the result and split it into an array of sport IDs
            let sportsField = resultdata[0].sports; // Assuming there's only one result
            let sportIds = sportsField.split(",");

            // Query your external database to fetch sport names based on sport IDs
            let Sport = `SELECT id, sports_name FROM sports WHERE status = 1 AND id IN (${sportIds.join(",")})`;

            let sportss = await db.query(Sport);
            let sports = sportss.rows;



            let data = sports.map((sport) => ({
                id: sport.id,
                sports_name: sport.sports_name
            }));

            if (data) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data successfully..!',
                    data
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be find..!',
                    data: []
                });
            }

        }

        catch (error) {
            // Handle any errors that occur during the queries
            console.error(error);
        }

    },


    dashbordCount: async (req, res) => {

        let playerCollection = mongoose.model("players", Schema.players);
        let levelCollection = mongoose.model("leveldata", Schema.leveldata);
        let staffdatasCollection = mongoose.model("staffdatas", Schema.staffdatas);
        let batchCollection = mongoose.model("batchdata", Schema.batchdata);
        let curriculumdatasCollection = mongoose.model("Curriculumdata", Schema.Curriculumdata);
        let MainaccountsCollection = mongoose.model("Mainaccounts", Schema.Mainaccounts);

        let resultdata = {};

        try {
            // Counting documents

            resultdata.academyCount = await MainaccountsCollection.countDocuments({
                "status": 1,

            });
            resultdata.playerCount = await playerCollection.countDocuments({
                "status": 1,
                "academy_id": req.query.id,
                "add_by": req.myID
            });
            resultdata.levelCount = await levelCollection.countDocuments({
                "status": 1,
                "academy_id": req.query.id,
                "add_by": req.myID
            });


            resultdata.staffCount = await staffdatasCollection.countDocuments({
                "status": 1,
                "academy_id": req.query.id,
                "add_by": req.myID
            });

            resultdata.batchCount = await batchCollection.countDocuments({
                "status": 1,
                "academy_id": req.query.id,
                "add_by": req.myID
            });
            resultdata.curriculumCount = await curriculumdatasCollection.countDocuments({
                "status": 1,
                "academy_id": req.query.id,
                "add_by": req.myID
            });


            if (resultdata) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data fetched successfully..!',
                    data: resultdata
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Cannot Be Found..!',
                    data: []
                });
            }
        }
        catch (error) {
            // Handle any errors that occur during the queries
            console.error(error);
        }


    },




    Piechartcountdata: async (req, res) => {


        try {
            const playerCollection = mongoose.model("players", Schema.players);
            const batchCollection = mongoose.model("batchdata", Schema.batchdata);
            const attendanceCollection = mongoose.model("Attendance", Schema.Attendance);

            let attendanceByDay = { 'sunday': 0, 'monday': 0, 'tuesday': 0, 'wednesday': 0, 'thursday': 0, 'friday': 0, 'saturday': 0 };




            const batches = await batchCollection.find({ "status": 1 }).select('sports days id');
            for (const batch of batches) {
                // Loop through the days array of each batch
                for (const day of batch.days) {
                    // Get the players in this batch
                    const playersInBatch = await playerCollection.find({
                        "batch_id": batch.id,
                        "status": 1,
                        //"academy_id": academyId
                    }, 'id');

                    // For each player, count their attendance on the given day
                    for (const player of playersInBatch) {
                        const attendance = await attendanceCollection.countDocuments({
                            "player_id": player.id,
                            "attendance_status": "present",
                            "day": day // Assuming the attendance record includes a 'day' field to match with batch days
                        });
                        attendanceByDay[day] += attendance; // Add to the total count for the day
                    }
                }
            }
            let playersAttendance = Object.values(attendanceByDay);
            const allSportIds = [...new Set(batches.map(batch => batch.sports).flat())];
            const placeholders = allSportIds.map((_, index) => `$${index + 1}`).join(',');

            const activeSportsQuery = `SELECT id, sports_name FROM sports WHERE status = 1 AND id IN (${placeholders})`;
            let activeSportsResult = await db.query(activeSportsQuery, allSportIds);
            let sports = activeSportsResult.rows;

            // Map over sports to fetch player count for each
            let sportPlayerCounts = await Promise.all(sports.map(async (sport) => {
                // Find all batches for the current sport
                const sportBatches = await batchCollection.find({ "sports": sport.id }, 'id');

                // Extract batch ids
                const batchIds = sportBatches.map(batch => batch.id);

                // Count players in each batch for the sport
                const playerCount = await playerCollection.countDocuments({
                    "status": 1,
                    "academy_id": req.query.id, // Uncomment this if you need to filter by specific academy id
                    "batch_id": { $in: batchIds }
                });

                return {
                    sports_name: sport.sports_name,
                    player_count: playerCount
                };
            }));

            // Format the result
            let result = {
                sports_name: sportPlayerCounts.map(spc => spc.sports_name),
                player_count: sportPlayerCounts.map(spc => spc.player_count),
                players_attendance: playersAttendance
            };

            res.json(result);
        } catch (error) {
            console.error("Error in Piechartcount: ", error);
            res.status(500).send("Internal Server Error");
        }

    },


    Piechartcountdatabk: async (req, res) => {



        try {
            const playerCollection = mongoose.model("players", Schema.players);
            const batchCollection = mongoose.model("batchdata", Schema.batchdata);
            const attendanceCollection = mongoose.model("Attendance", Schema.Attendance);

            const academyId = req.query.academyId; // Get the academy ID from the request

            // Initialize an object to hold the attendance count for each day friday saturday
            let attendanceByDay = { 'sunday': 0, 'monday': 0, 'tuesday': 0, 'wednesday': 0, 'thursday': 0, 'friday': 0, 'saturday': 0 };

            // Retrieve all batches with their days
            const batches = await batchCollection.find({ "status": 1 }, { id: 1, days: 1 }).lean();

            for (const batch of batches) {
                // Loop through the days array of each batch
                for (const day of batch.days) {
                    // Get the players in this batch
                    const playersInBatch = await playerCollection.find({
                        "batch_id": batch.id,
                        "status": 1,
                        //"academy_id": academyId
                    }, 'id');

                    // For each player, count their attendance on the given day
                    for (const player of playersInBatch) {
                        const attendance = await attendanceCollection.countDocuments({
                            "player_id": player.id,
                            "attendance_status": "present",
                            "day": day // Assuming the attendance record includes a 'day' field to match with batch days
                        });
                        attendanceByDay[day] += attendance; // Add to the total count for the day
                    }
                }
            }

            // Convert the attendance count into an array for the days of the week
            let playersAttendance = Object.values(attendanceByDay);

            // Format the result for the response
            let result = {
                // Include other response properties if necessary
                players_attendance: playersAttendance
            };

            res.json(result);
        } catch (error) {
            console.error("Error in LineGraphCount: ", error);
            res.status(500).send("Internal Server Error");
        }






    },




}





