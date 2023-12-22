const db = require('../../db');

const venue = async (req, res) => {
    try {
        console.log("ddddddddddddddddd");
        let id = ""; let idval = ""; let venueimgstr = ""; let venueimg = false;
        if (typeof (req.body.venueID) != "undefined" && req.body.venueID != "") {
            id = "id,";
            idval = req.body.venueID + ",";
        }
        if (!('latitude' in req.body) || !req.body.latitude) {
            req.body.latitude = null;
        }
        if (!('longitude' in req.body) || !req.body.longitude) {
            req.body.longitude = null;
        }
        if (!('freeWidth' in req.body) || !req.body.freeWidth) {
            req.body.freeWidth = null;
        }
        if (!('freeLength' in req.body) || !req.body.freeLength) {
            req.body.freeLength = null;
        }
        if (!req.body.twoWheeler) {
            req.body.twoWheeler = null
        }
        if (!req.body.fourWheeler) {
            req.body.fourWheeler = null
        }

        if (!req.body.spectatorSeat) {
            req.body.spectatorSeat = null
        }

        if (!req.body.womensToilet) {
            req.body.womensToilet = null
        }

        if (!req.body.mensToilet) {
            req.body.mensToilet = null
        }

        if (!req.body.playerRoom) {
            req.body.playerRoom = null
        }

        if (req.body.water != true && req.body.water != false) {
            req.body.water = null
        }

        if (req.body.snacks != true && req.body.snacks != false) {
            req.body.snacks = null
        }

        if (req.body.beverages != true && req.body.beverages != false) {
            req.body.beverages = null
        }

        if (!req.body.address2) {
            req.body.address2 = null
        }
        else {
            req.body.address2 = "$$" + req.body.address2 + "$$";
        }

        let venueStr = "INSERT INTO " + process.env.SCHEMA + ".venue (" + id + "venue_name,address_1,address_2,city_id,state_id,country_id,latitude,longitude,zip_code,description,spectator_seat,two_wheeler_parking,four_wheeler_parking,free_length,free_width,womens_toilet,mens_toilet,players_room,water,snacks,beverages,created_by,status,venue_type) VALUES(" + idval + "$$" + req.body.title + "$$,$$" + req.body.address1 + "$$," + req.body.address2 + "," + req.body.cityID + "," + req.body.stateID + "," + req.body.countryID + "," + req.body.latitude + "," + req.body.longitude + ",'" + req.body.zipcode + "',$$" + req.body.description + "$$," + req.body.spectatorSeat + "," + req.body.twoWheeler + "," + req.body.fourWheeler + "," + req.body.freeLength + "," + req.body.freeWidth + "," + req.body.womensToilet + "," + req.body.mensToilet + "," + req.body.playerRoom + "," + req.body.water + "," + req.body.snacks + "," + req.body.beverages + "," + req.myID + "," + req.body.status + "," + req.body.venueType + ") ON CONFLICT (id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + ",venue_name=$$" + req.body.title + "$$ ,address_1=$$" + req.body.address1 + "$$,address_2=" + req.body.address2 + " ,city_id=" + req.body.cityID + " ,state_id=" + req.body.stateID + " ,country_id=" + req.body.countryID + ",latitude=" + req.body.latitude + " ,longitude=" + req.body.longitude + ",zip_code='" + req.body.zipcode + "' ,description=$$" + req.body.description + "$$ ,spectator_seat=" + req.body.spectatorSeat + " ,two_wheeler_parking=" + req.body.twoWheeler + ",four_wheeler_parking=" + req.body.fourWheeler + " ,free_length=" + req.body.freeLength + " ,free_width=" + req.body.freeWidth + " ,womens_toilet=" + req.body.womensToilet + " ,mens_toilet=" + req.body.mensToilet + " ,players_room=" + req.body.playerRoom + " ,water=" + req.body.water + " ,snacks=" + req.body.snacks + " ,beverages=" + req.body.beverages + " ,status=" + req.body.status + ",venue_type=" + req.body.venueType + " ";
        console.log("ddddddddddddddd");
        console.log(venueStr);
        await db.query(venueStr);

        let venueID = "";
        if (typeof (req.body.venueID) != "undefined" && req.body.venueID != "") {
            venueID = req.body.venueID;
        } else {
            let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".venue','id'))";
            let regID = await db.query(strID);
            venueID = regID.rows[0].currval;
        }
        req.body.venueImages.forEach(p => {
            venueimg = true;
            venueimgstr += "INSERT INTO " + process.env.SCHEMA + ".venue_images(type,reference_id,path,created_by,status) VALUES ($$" + p.type + "$$," + venueID + ",$$" + p.imagePath + "$$," + req.myID + ",1) ;";
        });

        if (venueimg) {
            await db.query(venueimgstr);
        }

        let resetareaStr = "UPDATE " + process.env.SCHEMA + ".venue_asset SET status=0 WHERE venue_id=" + venueID + "";
        await db.query(resetareaStr);

        let resetcontactStr = "UPDATE " + process.env.SCHEMA + ".venue_contact SET status=0 WHERE venue_id=" + venueID + "";
        await db.query(resetcontactStr);

        let playAreaStr = "";
        if (req.body.playArea && Array.isArray(req.body.playArea)) {
            req.body.playArea.forEach(async e => {
                let otherSurface = "";
                if (typeof (e.others) != "undefined" && e.others != "") {
                    otherSurface = e.others;
                }
                let id = ""; let idval = "";
                if (typeof (e.areaID) != "undefined" && e.areaID != "") {
                    id = "id,";
                    idval = e.areaID + ",";
                }
                if (!e.surface) {
                    e.surface = null;
                }

                if (!e.description) {
                    e.description = '';
                }

                if (!e.subsportsid) {
                    e.subsportsid = [];
                }

                if (!e.subsportsid) {
                    e.subsportsid = [];
                }

                if (!e.sportsid) {
                    e.subsportsid = [];
                }

                if (!Array.isArray(e.sportsid)) {
                    e.sportsid = []
                }
                playAreaStr = "INSERT INTO " + process.env.SCHEMA + ".venue_asset (" + id + "venue_id,title,surface_type,others,sports_id,sub_sports_asset,description,status,created_by) VALUES (" + idval + "" + venueID + ",$$" + e.title + "$$," + e.surface + ",$$" + otherSurface + "$$,$$[" + e.sportsid.toString() + "]$$,$$[" + e.subsportsid.toString() + "]$$,$$" + e.description + "$$,1," + req.myID + ") ON CONFLICT(id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + ",title=$$" + e.title + "$$ ,surface_type=$$" + e.surface + "$$ ,others=$$" + otherSurface + "$$ ,sports_id=$$[" + e.sportsid.toString() + "]$$ ,sub_sports_asset=$$[" + e.subsportsid.toString() + "]$$  ,description=$$" + e.description + "$$  ,status=1 ;";
                await db.query(playAreaStr);

                let areaID = "";
                if (typeof (e.areaID) != "undefined" && e.areaID != "") {
                    areaID = e.areaID;
                } else {
                    let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".venue_asset','id'))";
                    let regID = await db.query(strID);
                    areaID = regID.rows[0].currval;
                }
                let imageStr = ""; let assetimg = false;
                e.imagePath.forEach(p => {
                    assetimg = true;
                    imageStr += "INSERT INTO " + process.env.SCHEMA + ".venue_images(type,reference_id,path,created_by,status) VALUES ($$" + p.type + "$$," + areaID + ",$$" + p.imagePath + "$$," + req.myID + ",1) ;";
                });

                if (assetimg) {
                    await db.query(imageStr);
                }
            });
        }
        if (typeof (req.body.ImagesRemove) != "undefined" && req.body.ImagesRemove.length > 0) {
            let ImagesRemoveStr = "UPDATE " + process.env.SCHEMA + ".venue_images SET status=0 WHERE id in (" + req.body.ImagesRemove.toString() + ") ";
            await db.query(ImagesRemoveStr);
        }
        let contactStr = "";
        req.body.contact.forEach(e => {
            let id = ""; let idval = "";
            if (typeof (e.contactID) != "undefined" && e.contactID != "") {
                id = "id,";
                idval = e.contactID + ",";
            }
            if (!e.socialMedia) {
                e.socialMedia = null
            }
            else {
                if (typeof e.socialMedia === 'object') {
                    e.socialMedia = JSON.stringify(e.socialMedia)
                }
                else {
                    e.socialMedia = null
                }
            }
            if (!e.webSite) {
                e.webSite = null;
            }
            else {
                e.webSite = "$$" + e.webSite + "$$";
            }
            contactStr += "INSERT INTO " + process.env.SCHEMA + ".venue_contact (" + id + "venue_id,contact_person_name,mobile_number,email_id,website,social_media,status,created_by) VALUES (" + idval + "" + venueID + ",$$" + e.personName + "$$,$$" + e.mobileNumber + "$$,$$" + e.emailID + "$$," + e.webSite + ",$$" + e.socialMedia + "$$,1," + req.myID + ") ON CONFLICT (id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + ",contact_person_name=$$" + e.personName + "$$,mobile_number=$$" + e.mobileNumber + "$$,email_id=$$" + e.emailID + "$$,website=" + e.webSite + ",social_media=$$" + e.socialMedia + "$$,status=1 ;";
        });
        if (req.body.contact.length > 0) {
            await db.query(contactStr);
        }
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

const list = async (req, res) => {
    const result = {};
    try {
        let and = "";
        if (typeof (req.body.venueID) != "undefined" && req.body.venueID != "") {
            and = " AND v.id=" + req.body.venueID + "";
        }
        let venueStr = "SELECT v.id AS venue_id,v.venue_name,v.address_1,v.address_2,v.latitude,v.longitude,v.dimension,v.zip_code,v.city_id,city.city_name,v.state_id,st.state_name,v.country_id,co.name AS country,v.description,v.spectator_seat,v.two_wheeler_parking,v.four_wheeler_parking,v.free_length,v.free_width,v.womens_toilet,v.mens_toilet,v.players_room,v.water,snacks,v.beverages,v.status,v.venue_type,v_t.type AS venue_type_name,array_to_json(array(SELECT y FROM (SELECT v_i.id AS img_id,v_i.path FROM " + process.env.SCHEMA + ".venue_images AS v_i WHERE v_i.reference_id=v.id AND v_i.type='venue' AND v_i.status=1 ) y))venue_img,array_to_json(array(SELECT d FROM(SELECT v_a.id AS area_id,v_a.title , v_a.description,v_a.surface_type AS surface,v_s.surface AS surface_name,v_a.others,array_to_json(array(SELECT x FROM (SELECT v_i.id AS img_id,v_i.path FROM " + process.env.SCHEMA + ".venue_images AS v_i WHERE v_i.reference_id=v_a.id AND v_i.type='asset' AND v_i.status=1 ) x))asset_img,v_a.sports_id,array_to_json(array(SELECT d FROM (SELECT  a_s.id,a_s.sub_sport FROM " + process.env.SCHEMA + ".asset_sub_sports AS a_s  LEFT JOIN LATERAL jsonb_array_elements(v_a.sub_sports_asset) pc (child) ON TRUE  WHERE a_s.status=1 AND a_s.id=pc.child::text::int)d)) sub_sports FROM " + process.env.SCHEMA + ".venue_asset AS v_a   INNER JOIN " + process.env.SCHEMA + ".venue_surface AS  v_s ON v_a.surface_type=v_s.id WHERE v_a.venue_id=v.id AND v_a.status=1 )d))play_area, ARRAY_TO_JSON(ARRAY(SELECT d FROM(SELECT v_c.id as contact_id,v_c.contact_person_name , v_c.mobile_number,v_c.email_id,v_c.website,v_c.social_media FROM " + process.env.SCHEMA + ".venue_contact AS v_c  WHERE v_c.venue_id=v.id AND status=1) d)) venue_contact  FROM " + process.env.SCHEMA + ".venue AS v LEFT JOIN " + process.env.SCHEMA + ".city AS city ON v.city_id=city.id INNER JOIN " + process.env.SCHEMA + ".state AS st ON v.state_id=st.id INNER JOIN " + process.env.SCHEMA + ".country AS co ON v.country_id=co.id  INNER JOIN " + process.env.SCHEMA + ".venue_type AS v_t ON v.venue_type=v_t.id WHERE v.status = 1 " + and + " ORDER BY v.id DESC";
        const venue = await db.query(venueStr);
        result.list = venue.rows;
        let sportsIds = [];
        if (venue.rowCount && venue.rows[0].play_area && Array.isArray(venue.rows[0].play_area) && venue.rows[0].play_area.length) {
            let playAreas = venue.rows[0].play_area;
            playAreas.forEach((item) => {
                sportsIds = sportsIds.concat(item.sports_id);
            })
            if (sportsIds.length) {
                let sportsQuery = `Select id,sports_name from sports where id IN (${sportsIds});`;
                sportsQuery = await db.query(sportsQuery);
                let sports = sportsQuery.rows;
                for (let item of venue.rows[0].play_area) {
                    item['sports'] = [];
                    (item.sports_id).map((subitem) => {
                        let foundSports = sports.find(element => element.id == subitem);
                        item['sports'].push(foundSports);
                    });
                }
            }
        }
    } catch (err) {
        result.list = [];
    }
    return result.list;
}

const master = async (req, res) => {
    const result = {};
    try {
        const countryStr = "SELECT id,code,name AS country,alias FROM " + process.env.SCHEMA + ".country";
        const country = await db.query(countryStr);
        result.country = country.rows;
        let stateand = '';
        if (typeof (req.body.countryID) != "undefined" && req.body.countryID != '') {
            stateand = " AND ( CAST(s.country_id AS TEXT) ='" + req.body.countryID + "' OR c.code='" + req.body.countryID + "' )";
        } else {
            stateand = " AND s.country_id IN (" + process.env.COUNTRY_ID + ",196)";
        }
        //const stateStr = "SELECT s.id,s.state_name AS state,s.country_id,c.code FROM " + process.env.SCHEMA + ".state AS s INNER JOIN " + process.env.SCHEMA + ".country AS c ON s.country_id = c.id WHERE 1=1 " + stateand + " ORDER BY s.id";

        const stateStr ="SELECT * from state ";

        const state = await db.query(stateStr);
        result.state = state.rows;
        let cityand = '';
        if (typeof (req.body.stateID) != "undefined" && req.body.stateID != '') {
            cityand = " AND state_id=" + req.body.stateID;
        }
        const cityStr = "SELECT id,city_name AS city,state_id FROM " + process.env.SCHEMA + ".city WHERE 1=1 " + cityand + " ORDER BY state_id,id";
        const city = await db.query(cityStr);
        result.city = city.rows;

        const typeStr = "SELECT id,type FROM " + process.env.SCHEMA + ".venue_type ORDER BY id ";
        const type = await db.query(typeStr);
        result.venueType = type.rows;

        const surfacestr = "SELECT id,surface FROM " + process.env.SCHEMA + ".venue_surface WHERE status=1 ORDER BY id";
        const surface = await db.query(surfacestr);
        result.surface = surface.rows;

        const sportsStr = "SELECT id,sports_name FROM " + process.env.SCHEMA + ".sports ORDER BY id"; 
        const sports = await db.query(sportsStr);
        result.sports = sports.rows;

        const subsportsStr = "SELECT * from " + process.env.SCHEMA + ".sub_sports WHERE status=1 ORDER BY sub_sports_id";
        const subsports = await db.query(subsportsStr);
        result.assetsubsports = subsports.rows;
    } catch (err) {
        result.country = [];
        result.state = [];
        result.city = [];
        result.venueType = [];
        result.surface = [];
        result.sports = [];
        result.assetsubsports = [];
    }
    return result;
}

const venueStatus = async (req, res) => {
    try {
        let statusStr = "UPDATE " + process.env.SCHEMA + ".venue SET status=" + req.body.status + ",updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.venueID + "";
        await db.query(statusStr);
        return true;
    } catch (err) {
        return false;
    }
}

const deletedata = async (req, res) => {
    try {
        console.log("123333");
        let statusStr = "UPDATE venue SET status= 2 ,updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.id + "";

        console.log("statusStr....");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    } catch (err) {
        console.log(err)
        return false;  
    }
}

module.exports = { venue, list, master, venueStatus ,deletedata}