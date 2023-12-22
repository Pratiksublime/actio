const db = require('../../../db');

const init = async (req, res) => {
    const result = {};
    try {
        let userStr = "SELECT s.role role_id,u_r.role,s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id,s.full_name,s.username,s.isd_code||s.mobile_number AS mobile,s.email_id  FROM " + process.env.SCHEMA + ".subscriber AS s INNER JOIN " + process.env.SCHEMA + ".user_role AS u_r ON s.role=u_r.id WHERE " +
            `(subscriber_id || username || mobile_number || full_name) ~* '^.*${req.body.subscriberID}.*$'` + " LIMIT 1";
        const user = await db.query(userStr);
        result.user = user.rows;
        let roleStr = "SELECT id,role FROM " + process.env.SCHEMA + ".user_role WHERE 1=1 AND id IN (" + process.env.ROLE_ORGANIZER + "," + process.env.ROLE_MANAGER + ") ORDER BY id";
        const role = await db.query(roleStr);
        result.role = role.rows;

        if (user.rowCount > 0) {
            let menuStr = "SELECT ur.id role_id,m_m.id main_menu_id,m_m.menu_name main_menu,s_m.id menu_id,s_m.sub_menu_name menu_name, CASE WHEN m_p.id>0 THEN 1 ELSE 0 END userpermission,to_char(m_p.validity_date,'DD-MM-YYYY') AS validity FROM " + process.env.SCHEMA + ".menu AS m_m INNER JOIN " + process.env.SCHEMA + ".sub_menu AS s_m ON m_m.id=s_m.menu_id INNER JOIN  (SELECT id,role,CAST (jsonb_array_elements(menus) AS TEXT)  menu_id FROM " + process.env.SCHEMA + ".user_role WHERE 1=1 AND id IN (" + process.env.ROLE_ORGANIZER + "," + process.env.ROLE_MANAGER + ") ) AS ur ON CAST(m_m.id AS TEXT )=ur.menu_id LEFT JOIN " + process.env.SCHEMA + ".menu_permission m_p ON s_m.id=m_p.sub_menu_id AND m_p.status=1 AND m_p.subscriber_id=" + user.rows[0].subscriber_id + " WHERE 1=1 ORDER BY ur.id,s_m.id";
            // console.log(menuStr);
            const menu = await db.query(menuStr);
            result.menu = menu.rows;
        } else {
            result.menu = [];
        }

        // if(user.rowCount>0){
        //     //let menuStr = "SELECT ur.id role_id,m_m.id main_menu_id,m_m.menu_name main_menu,s_m.id menu_id,s_m.sub_menu_name menu_name, CASE WHEN m_p.id>0 THEN 1 ELSE 0 END userpermission,to_char(m_p.validity_date,'DD-MM-YYYY') AS validity FROM "+process.env.SCHEMA+".menu AS m_m INNER JOIN "+process.env.SCHEMA+".sub_menu AS s_m ON m_m.id=s_m.menu_id INNER JOIN  (SELECT id,role,CAST (jsonb_array_elements(menus) AS TEXT)  menu_id FROM "+process.env.SCHEMA+".user_role WHERE 1=1 AND id IN ("+process.env.ROLE_ORGANIZER+","+process.env.ROLE_MANAGER+") ) AS ur ON CAST(m_m.id AS TEXT )=ur.menu_id LEFT JOIN "+process.env.SCHEMA+".menu_permission m_p ON s_m.id=m_p.sub_menu_id AND m_p.status=1 AND m_p.subscriber_id="+user.rows[0].subscriber_id+" WHERE 1=1 ORDER BY ur.id,s_m.id";
        //     let menuStr =`SELECT menus FROM user_role WHERE id IN (${process.env.ROLE_ORGANIZER},${process.env.ROLE_MANAGER})`
        //     let menus = [];
        //     let menuRows = await db.query(menuStr);
        //     if(menuRows.rowCount) {
        //         let menuArray = [];
        //         menuRows.rows.forEach((j)=>{
        //             let tempArray = (j.menus)?(j.menus):[];
        //             if(Array.isArray(tempArray)) {
        //                 for(let i of tempArray) {
        //                     if(!menuArray.includes(i)) {
        //                         menuArray.push(i);
        //                     }
        //                 }  
        //             }
        //         });
        //        let subMenuQuery = `SELECT 
        //        sm.menu_id,
        //        sm.id as sub_menu_id,
        //        sm.sub_menu_name
        //        from sub_menu as sm 
        //        INNER JOIN menu as m
        //        ON m.id = sm.menu_id
        //        where sm.menu_id IN (${menuArray});` 
        //        let subMenus = await db.query(subMenuQuery);
        //        if(subMenus.rowCount) {
        //         menuArray = subMenus.rows
        //        } 
        //        menus = menuArray
        //     }
        //     result.menu = menus;
        // }else{
        //     result.menu = [];
        // }
    } catch (err) {
        result.role = [];
        result.menu = [];
        result.user = [];
    }
    return result;
}

const submit = async (req, res) => {
    try {
        let resetStr = "UPDATE " + process.env.SCHEMA + ".menu_permission SET status=0,updated_at=now(),updated_by=" + req.myID + " WHERE subscriber_id=" + req.body.subscriberID + " ";
        await db.query(resetStr);
        let permissionStr = "";
        let validity = null;
        if (typeof req.body.validityDate != "undefined" && req.body.validityDate != "") {
            let tDate = req.body.validityDate.split('-');
            validity = "$$" + tDate[2] + "-" + tDate[1] + "-" + tDate[0] + "$$";
        }
        req.body.menuID.forEach(e => {
            permissionStr += "INSERT INTO " + process.env.SCHEMA + ".menu_permission (sub_menu_id,subscriber_id,status,validity_date,created_by) VALUES (" + e + "," + req.body.subscriberID + ",1," + validity + "," + req.myID + ") ON CONFLICT (sub_menu_id,subscriber_id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + ",status=1,validity_date=" + validity + " ;";
        });
        if (req.body.menuID.length > 0) {
            await db.query(permissionStr);
        }
        let roleStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET role=" + req.body.roleID + " WHERE id=" + req.body.subscriberID + " ";
        await db.query(roleStr);

        return true;
    } catch (err) {
        return false;
    }
}

const submitRole = async (req) => {
    try {
        let subscriberId = `select id from subscriber where subscriber_id= ${req.subscriberID}`;
        subscriberId = await db.query(subscriberId);
        subscriberId = subscriberId.rows[0].id;
        if (req.menuID.length > 0) {
        let resetStr = "UPDATE " + process.env.SCHEMA + ".menu_permission SET status=0,updated_at=now(),updated_by=" + req.id + " WHERE subscriber_id=" + subscriberId + " ";
        await db.query(resetStr);
        }
        let permissionStr = "";
        let validity = null;
        if (typeof req.validityDate != "undefined" && req.validityDate != "") {
            let tDate = req.validityDate.split('-');
            validity = "$$" + tDate[2] + "-" + tDate[1] + "-" + tDate[0] + "$$";
        }
        req.menuID.forEach(e => {
            permissionStr += "INSERT INTO " + process.env.SCHEMA + ".menu_permission (sub_menu_id,subscriber_id,status,validity_date,created_by) VALUES (" + e + "," + subscriberId + ",1," + validity + "," + req.id + ") ON CONFLICT (sub_menu_id,subscriber_id) DO UPDATE SET updated_at=now(),updated_by=" + req.id + ",status=1,validity_date=" + validity + " ;";
        });
        if (req.menuID.length > 0) {
            await db.query(permissionStr);
        }
        let roleStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET role=" + req.roleID + " WHERE id=" + subscriberId + " ";
        await db.query(roleStr);

        return true;
    } catch (err) {
        return false;
    }
}

module.exports = { init, submit, submitRole };