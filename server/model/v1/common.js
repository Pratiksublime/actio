const db = require('../../db');
const helper = require('../../helper/helper');
const subscriberModel = require('./admin/subscriber');
const BannerWebsiteLink =process.env.HOST+process.env.PORT+'/';
const TestimonialWebsiteLink =process.env.HOST+process.env.PORT+'/';

const login = async (req, res) => {
    /*let userStr = "SELECT id,subscriber_id,status,full_name,username,isd_code,mobile_number FROM subscriber where username='"+req.body.username.toLowerCase()+"' and password=MD5('"+req.body.password+"')";
    and r.role='"+req.body.role.toLowerCase()+"'
    */
    let userStr = "SELECT s.id,s.id,s.subscriber_id,sp.profile_image,s.status,s.full_name,s.username,s.isd_code,mobile_number,s.role,s.email_id FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".user_role r ON s.role=r.id LEFT JOIN subscriber_profile as sp on sp.subscriber_id = s.id WHERE s.username='" + req.body.username.toLowerCase() + "' and s.password=MD5('" + req.body.password + "') ";

    console.log('userStr');
    console.log(userStr);

    const result = {};
    try {
        const user = await db.query(userStr); 
        if (user.rows[0]) {
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        result.user = false;
    }
    return result;
}

const academy_login = async (req, res) => {
    /*let userStr = "SELECT id,subscriber_id,status,full_name,username,isd_code,mobile_number FROM subscriber where username='"+req.body.username.toLowerCase()+"' and password=MD5('"+req.body.password+"')";
    and r.role='"+req.body.role.toLowerCase()+"'
    */
    let userStr = "SELECT s.id,s.id,s.subscriber_id,sp.profile_image,s.status,s.full_name,s.username,s.isd_code,mobile_number,s.role,s.email_id FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".user_role r ON s.role=r.id LEFT JOIN subscriber_profile as sp on sp.subscriber_id = s.id WHERE s.username='" + req.body.username.toLowerCase() + "' and s.password=MD5('" + req.body.password + "') ";

    console.log('userStr');
    console.log(userStr);

    const result = {};
    try {
        const user = await db.query(userStr); 
        if (user.rows[0]) {
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        result.user = false;
    }
    return result;
}

const logout = async (req, res) => {
    const result = {};
    try {
        let logoutStr = "UPDATE " + process.env.SCHEMA + ".user_session SET device_token='' , status=0 , updated_at=NOW() WHERE subscriber_id=" + req.myID + " "
        if (req.body.Mode == 1) {
            logoutStr += "AND device_token='" + req.body.deviceToken + "'";
        }
        await db.query(logoutStr);
        result.logout = true;
    } catch (err) {
        result.logout = false;
    }
    return result;
}

const logSession = async (req, res) => {
    const result = {};
    try {
        const existStr = "SELECT * FROM " + process.env.SCHEMA + ".user_session WHERE subscriber_id=" + req.ID + " AND mode=" + req.Mode + "";
        const existlog = await db.query(existStr);
        let logStr = "";
        if (existlog.rowCount) {
            logStr = "UPDATE " + process.env.SCHEMA + ".user_session SET device_token='" + req.deviceToken + "',status=1,updated_at=NOW() WHERE subscriber_id=" + req.ID + " and mode=" + req.Mode + " ";
        } else {
            logStr = "INSERT INTO " + process.env.SCHEMA + ".user_session(subscriber_id, mode, device_token, status) VALUES (" + req.ID + ", " + req.Mode + ", '" + req.deviceToken + "', 1)";
        }
        console.log(logStr)
        await db.query(logStr);
        result.log = true;
    } catch (err) {
        console.log(err)
        result.log = false;
    }
    return result;
}

const validateOTP = async (req, res) => {
    let otpStr = "SELECT o.id,o.otp ,s.id,s.subscriber_id,s.full_name,s.email_id,s.username FROM " + process.env.SCHEMA + ".subscriber s INNER JOIN " + process.env.SCHEMA + ".otp o ON s.isd_code=o.isd_code AND s.mobile_number=o.mobile_number WHERE s.id=" + req.myID + "  ORDER BY o.id DESC LIMIT 1";
    const result = {};
    try {
        const otp = await db.query(otpStr);
        if (otp.rows[0]) {
            result.otp = otp.rows[0];
        } else {
            result.otp = false;
        }
    } catch (err) {
        result.otp = false;
    }
    return result;
}

const relation = async (req, res) => {
    const result = {};
    try {
        let relStr = "SELECT * FROM " + process.env.SCHEMA + ".relationship";
        const relation = await db.query(relStr);
        result.relation = relation.rows;
    } catch (err) {
        result.relation = [];
    }
    return result;
}

const getfcmTokenbyID = async (id, res) => {
    const result = {};
    try {
        let fcmStr = "SELECT distinct u_s.device_token  FROM " + process.env.SCHEMA + ".user_session u_s  WHERE u_s.subscriber_id=" + id + " AND u_s.status=1 AND u_s.mode=1";
        const fcm = await db.query(fcmStr);
        if (fcm.rowCount) {
            result.status = true;
            result.fcmToken = fcm.rows;
        } else {
            result.status = false;
        }
    } catch (err) {
        result.status = false;
    }
    return result;
}

const menuPermission = async (user, menu, res) => {
    const result = {};
    try {
        let menuStr = " SELECT * FROM " + process.env.SCHEMA + ".menu_permission WHERE status=1 AND sub_menu_id=" + menu + " AND subscriber_id=" + user + " ";
        const permission = await db.query(menuStr);
        if (permission.rowCount) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

/*const userMenu = async (id, res) => {
    const result = [];
    try {
        let menuStr = "SELECT  menu.id ,menu.menu_name as title,'collapse' AS type , menu.menu_icon AS icon, array_to_json (array((SELECT d FROM (SELECT sm.id,sm.sub_menu_name AS title , 'item' AS type ,sm.menu_url AS url FROM " + process.env.SCHEMA + ".menu_permission AS mp INNER JOIN " + process.env.SCHEMA + ".sub_menu AS sm ON mp.sub_menu_id=sm.id AND mp.status=1 WHERE mp.subscriber_id=" + id + " and sm.menu_id=menu.id ORDER BY sm.id) d)))  AS  children FROM " + process.env.SCHEMA + ".menu_permission AS m_p INNER JOIN " + process.env.SCHEMA + ".sub_menu AS s_m ON m_p.sub_menu_id = s_m.id INNER JOIN " + process.env.SCHEMA + ".menu ON s_m.menu_id = menu.id WHERE m_p.status=1 AND m_p.subscriber_id = " + id + "  GROUP BY menu.id ORDER BY menu.id ";
        const menu = await db.query(menuStr);
        let d_menu = {
            id: "landing-page",
            title: "Dashboard",
            type: "item",
            icon: "feather icon-home",
            url: "/dashboard/analytics",
            classes: "nav-item"
        };
        let p_menu = {
            id: "profile-page",
            title: "My Profile",
            type: "item",
            icon: "feather icon-user",
            url: "/profile",
            classes: "nav-item"
        };
        let c_menu = {
            id: "calendar-page",
            title: "My Calendar",
            type: "item",
            icon: "feather icon-calendar",
            url: "/calendar/view",
            classes: "nav-item"
        };
        let app_version_menu = {
            id: "support",
            title: "Support",
            type: "group",
            icon: "feather icon-help-circle",
            children: [
                {
                    id: 'app-version',
                    title: 'Version',
                    type: 'item',
                    icon: 'feather icon-help-circle',
                    classes: 'nav-item',
                    url: '#/dashboard/analytics',
                    target: true,
                    external: true,
                    badge: {
                        title: process.env.WEBVERSION,
                        type: 'label-warning'
                    }
                }
            ]
        }

        const kpi = {
            "id": 6,
            "title": "KPI",
            "type": "collapse",
            "icon": "feather icon-sliders",
            "children": [
                {
                    "id": 10,
                    "title": "KPI Details",
                    "type": "item",
                    "url": "/kpi"
                },
            ]
        }
        // {
        //     "id": 11,
        //     "title": "Non actio Events",
        //     "type": "item",
        //     "url": "/kpi/non-actio-event"
        // }
        // let payment = {
        //     "id": 7,
        //     "title": "Payment Details",
        //     "type": "collapse",
        //     "icon": "feather icon-monitor",
        //     "children": [
        //         {
        //             "id": 12,
        //             "title": "Payment list",
        //             "type": "item",
        //             "url": "/payment/list"
        //         },
        //     ]
        // } 
        let menus = [];
        menus.push(d_menu);
        menus.push(p_menu);
        // menus.push(c_menu);
        // menus.push(payment);

        let isKpi = false
        menu.rows.forEach(e => {
            if (e.title == 'KPI') {
                isKpi = true
            } else if (e.title == 'Event') {
                const importEvent = e.children.length > 0 ? e.children.find(i => i.title == 'Import') : null;
                let eventMenu = []
                e.children.forEach((item, index) => {
                    if (index == 1 && importEvent != null) {
                        eventMenu.push(importEvent);
                        eventMenu.push(item);
                    } else if (item.title != 'Import') {
                        eventMenu.push(item);
                    }
                });
                e.children = eventMenu;
            }
            menus.push(e);
        });
        if (!isKpi) {
            menus.push(kpi)
        }
        result.menu = [];
        result.menu.push({
            id: "navigation",
            title: "Navigation",
            type: "group",
            icon: "feather icon-monitor",
            children: menus
        });
        result.menu.push(app_version_menu);
    } catch (err) {
        result.menu = {};
    }
    return result.menu;
}*/

/*const userMenu = async (id, res) => {
    const result = [];
    try {
        console.log("userMenu id: ");
        console.log(id);

        let menuStr = "SELECT  menu.id ,menu.menu_name as title,'collapse' AS type , menu.menu_icon AS icon, array_to_json (array((SELECT d FROM (SELECT sm.id,sm.sub_menu_name AS title , 'item' AS type ,sm.menu_url AS url FROM " + process.env.SCHEMA + ".menu_permission AS mp INNER JOIN " + process.env.SCHEMA + ".sub_menu AS sm ON mp.sub_menu_id=sm.id AND mp.status=1 WHERE mp.subscriber_id=" + id + " and sm.status = 1 and sm.menu_id=menu.id ORDER BY sm.sub_menu_name) d)))  AS  children FROM " + process.env.SCHEMA + ".menu_permission AS m_p INNER JOIN " + process.env.SCHEMA + ".sub_menu AS s_m ON m_p.sub_menu_id = s_m.id INNER JOIN " + process.env.SCHEMA + ".menu ON s_m.menu_id = menu.id WHERE m_p.status=1 AND m_p.subscriber_id = " + id + "  GROUP BY menu.id ORDER BY menu.order_key ";

        console.log("menuStr: ");
        console.log(menuStr);

        const menu = await db.query(menuStr);
        let t_menu = {};
        if(id===1){
            
            t_menu = {
            id: "landing-page",
            title: "Tours",
            type: "item",
            icon: "feather icon-home",
            url: "/tours/dashboard",
            classes: "nav-item"
            };
        }
        let d_menu = {
            id: "landing-page",
            title: "Dashboard",
            type: "item",
            icon: "feather icon-home",
            url: "/dashboard/analytics",
            classes: "nav-item"
        };
        let p_menu = {
            id: "profile-page",
            title: "My Profile",
            type: "item",
            icon: "feather icon-user",
            url: "/profile",
            classes: "nav-item"
        };
        let c_menu = {
            id: "calendar-page",
            title: "My Calendar",
            type: "item",
            icon: "feather icon-calendar",
            url: "/calendar/view",
            classes: "nav-item"
        };
        let app_version_menu = {
            id: "support",
            title: "Support",
            type: "group",
            icon: "feather icon-help-circle",
            children: [
                {
                    id: 'app-version',
                    title: 'Version',
                    type: 'item',
                    icon: 'feather icon-help-circle',
                    classes: 'nav-item',
                    url: '#/dashboard/analytics',
                    target: true,
                    external: true,
                    badge: {
                        title: process.env.WEBVERSION,
                        type: 'label-warning'
                    }
                }
            ]
        }

        const kpi = {
            "id": 6,
            "title": "KPI",
            "type": "collapse",
            "icon": "feather icon-sliders",
            "children": [
                {
                    "id": 10,
                    "title": "KPI Details",
                    "type": "item",
                    "url": "/kpi"
                },
            ]
        }
        // {
        //     "id": 11,
        //     "title": "Non actio Events",
        //     "type": "item",
        //     "url": "/kpi/non-actio-event"
        // }
        // let payment = {
        //     "id": 7,
        //     "title": "Payment Details",
        //     "type": "collapse",
        //     "icon": "feather icon-monitor",
        //     "children": [
        //         {
        //             "id": 12,
        //             "title": "Payment list",
        //             "type": "item",
        //             "url": "/payment/list"
        //         },
        //     ]
        // } 
        let menus = [];
        
        menus.push(d_menu); 
        menus.push(p_menu);
        // menus.push(c_menu);
        // menus.push(payment);


        let isKpi = false
        menu.rows.forEach(e => {
            if (e.title == 'KPI') {
                isKpi = true
            } else if (e.title == 'Event') {
                const importEvent = e.children.length > 0 ? e.children.find(i => i.title == 'Import') : null;
                let eventMenu = []
                e.children.forEach((item, index) => {
                    if (index == 1 && importEvent != null) {
                        eventMenu.push(importEvent);
                        eventMenu.push(item);
                    } else if (item.title != 'Import') {
                        eventMenu.push(item);
                    }
                });
                e.children = eventMenu;
            }
            menus.push(e);
        });
        if(t_menu && Object.keys(t_menu).length>0){
            menus.push(t_menu);
        }
        if (!isKpi) {
            menus.push(kpi)
        }

        
        // if(t_menu && Object.keys(t_menu).length>0){
        //     menus.push(t_menu);
        // }
        result.menu = [];
        result.menu.push({
            id: "navigation",
            title: "Navigation",
            type: "group",
            icon: "feather icon-monitor",
            children: menus
        });
        result.menu.push(app_version_menu);
    } catch (err) {
        console.log("error: ");
        console.log(err);


        result.menu = {};
    }
    return result.menu;
}*/


const userMenu = async (id,req) => {
    const result = [];
    try {

        console.log(req.body.role);
        console.log('req.body.id');
        var role =" "
        if(req.body.role){
            role = `and m_p.role = ${req.body.role}`;
        }

        if(id && (id===1 || id==="1")){
            result.menu = [];
            result.menu = [{"id":"navigation","title":"Navigation","type":"group","icon":"feather icon-monitor","children":[{"id":"landing-page","title":"Dashboard","type":"item","icon":"feather icon-home","url":"/dashboard/analytics","classes":"nav-item"},{"id":"profile-page","title":"My Profile","type":"item","icon":"feather icon-user","url":"/profile","classes":"nav-item"}, {"id":8,"title":"Permission","type":"item","icon":"feather icon-user","url":"/dashboard/permission","classes":"nav-item"} ,{"id":1,"title":"Upload","type":"collapse","icon":"feather icon-upload-cloud","children":[{"id":1,"title":"Subscriber Import","type":"item","url":"/bulk/upload"},{"id":2,"title":"Subscriber SMS","type":"item","url":"/sms/push"}]},{"id":3,"title":"Subscriber","type":"collapse","icon":"feather icon-users","children":[{"id":6,"title":"Subscriber List","type":"item","url":"/subscriber/list"}]},{"id":4,"title":"Master","type":"collapse","icon":"feather icon-layers","children":[{"id":16,"title":"Championship","type":"item","url":"/master/championship"},{"id":21,"title":"Performance","type":"item","url":"/master/Performance"},{"id":17,"title":"Sports","type":"item","url":"/master/sports"},{"id":18,"title":"Sub Sports","type":"item","url":"/master/sub_sports"},{"id":7,"title":"Tournament","type":"item","url":"/master/tournament"},{"id":22,"title":"Tours Type","type":"item","url":"/master/tours-type"},{"id":23,"title":"Tours","type":"item","url":"/tours/dashboard"},{"id":31,"title":"Inclusions","type":"item","url":"/master/tours-inclusions"},{"id":32,"title":"Exclusion","type":"item","url":"/master/tours-exclusion"},{"id":8,"title":"Venue","type":"item","url":"/master/venue"},{"id":19,"title":"Website Banner","type":"item","url":"/master/banner_website"},{"id":20,"title":"Website Testimonial","type":"item","url":"/master/testimonial_website"}]},

            {"id":2,"title":"Event","type":"collapse","icon":"feather icon-box","children":[{"id":12,"title":"Control Center","type":"item","url":"/event/controller/list"},{"id":15,"title":"Import","type":"item","url":"/event/import"},{"id":3,"title":"Create Event","type":"item","url":"/event/create"},{"id":4,"title":"Event List","type":"item","url":"/event/list"},{"id":14,"title":"Match Statistics","type":"item","url":"/event/controller/matchstatistics"},{"id":13,"title":"Player Statistics","type":"item","url":"/event/controller/playerstatistics"},{"id":5,"title":"Register List","type":"item","url":"/event/register"}]},

            {"id":8,"title":"Matches","type":"collapse","icon":"feather icon-box","children":[{"id":28,"title":"Create Match","type":"item","url":"/matches/create"},{"id":29,"title":"Match List","type":"item","url":"/matches/list"},{"id":30,"title":"Action Master","type":"item","url":"/matches/action"},{"id":33,"title":"Points Table Master","type":"item","url":"/matches/pointstable"}]},

            {"id":5,"title":"Roles","type":"collapse","icon":"feather icon-sliders","children":[{"id":9,"title":"Roles","type":"item","url":"/roles"}]},{"id":6,"title":"KPI","type":"collapse","icon":"feather icon-users","children":[{"id":10,"title":"View KPI","type":"item","url":"/kpi"}]},{"id":7,"title":"Payment","type":"collapse","icon":null,"children":[{"id":11,"title":"Payment List","type":"item","url":"/payment/list"}]}]},{"id":"support","title":"Support","type":"group","icon":"feather icon-help-circle","children":[{"id":"app-version","title":"Version","type":"item","icon":"feather icon-help-circle","classes":"nav-item","url":"#/dashboard/analytics","target":true,"external":true,"badge":{"title":"7.1","type":"label-warning"}}]}];     
        }else{
            console.log("userMenu id: ");
            console.log(id);
            
            let menuStr = "SELECT  menu.id ,menu.menu_name as title,'collapse' AS type , menu.menu_icon AS icon, array_to_json (array((SELECT d FROM (SELECT sm.id,sm.sub_menu_name AS title , 'item' AS type ,sm.menu_url AS url FROM " + process.env.SCHEMA + ".menu_permission AS mp INNER JOIN " + process.env.SCHEMA + ".sub_menu AS sm ON mp.sub_menu_id=sm.id AND mp.status=1 WHERE mp.subscriber_id=" + id + " and mp.role = "+req.body.role+" and sm.status = 1 and sm.menu_id=menu.id ORDER BY sm.sub_menu_name) d)))  AS  children FROM " + process.env.SCHEMA + ".menu_permission AS m_p INNER JOIN " + process.env.SCHEMA + ".sub_menu AS s_m ON m_p.sub_menu_id = s_m.id INNER JOIN " + process.env.SCHEMA + ".menu ON s_m.menu_id = menu.id WHERE m_p.status=1 AND m_p.subscriber_id = " + id + " "+role+"  GROUP BY menu.id ORDER BY menu.order_key ";

            console.log("menuStr: ");
            console.log(menuStr);

            const menu = await db.query(menuStr);
            let t_menu = {};
            if(id===1){
                
                t_menu = {
                id: "landing-page",
                title: "Tours",
                type: "item",
                icon: "feather icon-home",
                url: "/tours/dashboard",
                classes: "nav-item"
                };
            }
            let d_menu = {
                id: "landing-page",
                title: "Dashboard",
                type: "item",
                icon: "feather icon-home",
                url: "/dashboard/analytics",
                classes: "nav-item"
            };
            let p_menu = {
                id: "profile-page",
                title: "My Profile",
                type: "item",
                icon: "feather icon-user",
                url: "/profile",
                classes: "nav-item"
            };
            let c_menu = {
                id: "calendar-page",
                title: "My Calendar",
                type: "item",
                icon: "feather icon-calendar",
                url: "/calendar/view",
                classes: "nav-item"
            };
            let app_version_menu = {
                id: "support",
                title: "Support",
                type: "group",
                icon: "feather icon-help-circle",
                children: [
                    {
                        id: 'app-version',
                        title: 'Version',
                        type: 'item',
                        icon: 'feather icon-help-circle',
                        classes: 'nav-item',
                        url: '#/dashboard/analytics',
                        target: true,
                        external: true,
                        badge: {
                            title: process.env.WEBVERSION,
                            type: 'label-warning'
                        }
                    }
                ]
            }

            const kpi = {
                "id": 6,
                "title": "KPI",
                "type": "collapse",
                "icon": "feather icon-sliders",
                "children": [
                    {
                        "id": 10,
                        "title": "KPI Details",
                        "type": "item",
                        "url": "/kpi"
                    },
                ]
            }
            // {
            //     "id": 11,
            //     "title": "Non actio Events",
            //     "type": "item",
            //     "url": "/kpi/non-actio-event"
            // }
            // let payment = {
            //     "id": 7,
            //     "title": "Payment Details",
            //     "type": "collapse",
            //     "icon": "feather icon-monitor",
            //     "children": [
            //         {
            //             "id": 12,
            //             "title": "Payment list",
            //             "type": "item",
            //             "url": "/payment/list"
            //         },
            //     ]
            // } 
            let menus = [];
            
            menus.push(d_menu); 
            menus.push(p_menu);
            // menus.push(c_menu);
            // menus.push(payment);


            let isKpi = false
            menu.rows.forEach(e => {
                if (e.title == 'KPI') {
                    isKpi = true
                } else if (e.title == 'Event') {
                    const importEvent = e.children.length > 0 ? e.children.find(i => i.title == 'Import') : null;
                    let eventMenu = []
                    e.children.forEach((item, index) => {
                        if (index == 1 && importEvent != null) {
                            eventMenu.push(importEvent);
                            eventMenu.push(item);
                        } else if (item.title != 'Import') {
                            eventMenu.push(item);
                        }
                    });
                    e.children = eventMenu;
                }
                menus.push(e);
            });
            if(t_menu && Object.keys(t_menu).length>0){
                menus.push(t_menu);
            }
            if (!isKpi) {
                menus.push(kpi)
            }

            
            // if(t_menu && Object.keys(t_menu).length>0){
            //     menus.push(t_menu);
            // }
            result.menu = [];
            result.menu.push({
                id: "navigation",
                title: "Navigation",
                type: "group",
                icon: "feather icon-monitor",
                children: menus
            });
            result.menu.push(app_version_menu);
        }
    } catch (err) {
        console.log("error: ");
        console.log(err);


        result.menu = {};
    }
    return result.menu;
}

const activityLog = async (id, value, req, res) => {
    try {
        

        let nvalue = JSON.stringify(value);
        if (typeof (value) == "object" && nvalue.length > 5) {
            value = nvalue;
        }
        let activityStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_activity_log (log_id,subscriber_id,remarks,created_by)VALUES ('" + id + "'," + req.myID + ",$$" + value + "$$," + req.myID + ")";

        console.log('req.myIDreq.myIDreq.myIDreq.myIDreq.myIDreq.myIDreq.myIDreq.myID');
        console.log(activityStr);
        await db.query(activityStr);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const getUserForgotPassword = async (req) => {
    let result;
    try {
        let username = isNaN(req.body.username) ? `username = '${req.body.username}'` : `subscriber_id = ${req.body.username}`;
        const query = `SELECT * FROM ${process.env.SCHEMA}.subscriber WHERE ${username};`
        result = await db.query(query);
    }
    catch (error) {
        return [];
    }
    return result.rows;
};

const validateUserForgotPassword = async (req, res) => {
    let result;
    try {
        result = await db.query(`SELECT o.id,o.otp FROM 
        ${process.env.SCHEMA}.subscriber AS s
        INNER JOIN otp as o 
        on s.id = o.subscriber_sid
        AND s.isd_code=o.isd_code 
        AND s.mobile_number = o.mobile_number 
        WHERE s.username='${req.body.username}'
        ORDER BY o.id DESC LIMIT 1;`);
        const invalid = {
            status: process.env.STATUS_TEMP_422,
            isValid: false,
            msg: 'Invalid OTP !'
        }
        const valid = {
            status: process.env.STATUS_200,
            isValid: true
        }
        if (!result.rows.length) {
            return res.send(invalid);
        }
        if (result.rows[0].otp != req.body.otp) {
            return res.send(invalid);
        }
        return res.send(valid);
    }
    catch (error) {
        return res.send({
            status: process.env.STATUS_TEMP_422,
            error: 'Server error'
        });
    }
}

const updatePassword = async (req, res) => {
    if (req.body.password1 != req.body.password2) {
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_TEMP_422,
            msg: 'Passwords donot match'
        })
    };
    let result;
    try {
        if (req.body.oldpassword) {
            let userStr = await db.query("SELECT s.subscriber_id FROM " + process.env.SCHEMA + ".subscriber as s WHERE s.username='" + req.body.username.toLowerCase() + "' and s.password=MD5('" + req.body.oldpassword + "') ");
            if (!userStr.rowCount) {
                return res.status(process.env.STATUS_200).send({
                    status: process.env.STATUS_TEMP_422,
                    msg: 'Old Password is incorrect'
                })
            }
        }
        result = await db.query(`UPDATE subscriber SET password=MD5('${req.body.password1}') WHERE username='${req.body.username}';`);
        if (!result.rowCount) {
            return res.status(process.env.STATUS_200).send({
                status: process.env.STATUS_TEMP_422,
                msg: 'Update not successful'
            })
        }
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_200,
            msg: 'Password successfully updated !'
        });
    }
    catch (err) {
        return res.status(process.env.STATUS_TEMP_422).send({
            status: process.env.STATUS_TEMP_422,
            msg: 'Update Query not successful !'
        })
    }
}

const getUserForgotUsername = async (req) => {
    let result;
    try {
        result = `SELECT username,subscriber_id FROM ${process.env.SCHEMA}.subscriber WHERE mobile_number='${req.body.mobileNumber}' AND email_id='${req.body.emailID}' LIMIT 1;`
        result = await db.query(result);
    }
    catch (error) {
        return {};
    }
    if (result.rowCount) {
        return result.rows[0];
    }
    return {};
}

const suggestion = async (body) => {
    try {
        let result = [];
        if (body.type == 'tournament') {
            let query = await db.query(`SELECT id,tournament_name as name FROM tournament  WHERE (tournament_name) ~* '^.*${body.search}.*$'`);
            if (query.rowCount) {
                result = query.rows;
            }
        }
        else if (body.type == 'event') {
            let tournamentId = (body.id) ? `AND tournament_id=${body.id}` : '';
            let query = await db.query(`SELECT id,event_name as name FROM event WHERE (event_name) ~* '^.*${body.search}.*$' ${tournamentId}`);
            if (query.rowCount) {
                result = query.rows;
            }
        }
        return result;
    }
    catch (err) {
        return [];
    }
}

const getRequestValidationToken = async (ip) => {
    try {
        await db.query(`INSERT INTO client_request(ip,created_at) VALUES('${ip}',now())`);
    }
    catch (err) {
        console.log(err)
    }
}

const sendClient = async (req, res) => {
    try {
        let result = {
            imageAPIURL: "https://playactio.com:8086/"
        }
        // let userType = `SELECT * FROM user_type`;
        // userType = await db.query(userType);
        // if(userType.rowCount) {
        //     result['user_type'] = userType.rows;
        // }

        // let gender = `SELECT * FROM gender`;
        // gender = await db.query(gender);
        // if(gender.rowCount) {
        //     result['gender'] = gender.rows;
        // }

        // let government_proof = `SELECT * FROM government_proof`;
        // government_proof = await db.query(government_proof);
        // if(government_proof.rowCount) {
        //     result['government_proof'] = government_proof.rows;
        // }

        // let institute = `SELECT * FROM institute`;
        // institute = await db.query(institute);
        // if(institute.rowCount) {
        //     result['institute'] = institute.rows;
        // }

        // let subscriber_status = `SELECT * FROM subscriber_status`;
        // subscriber_status = await db.query(subscriber_status);
        // if(subscriber_status.rowCount) {
        //     result['subscriber_status'] = subscriber_status.rows;
        // }

        // Comments temp
        let subscriber = `SELECT 
        s.subscriber_id as actio_subscription_id,substa.status as subscriber_status,user_role.role,gen.gender,
        s.full_name,
        CASE
        WHEN s.user_type=1  THEN 'Company'
        WHEN s.user_type=2 THEN 'User'
        END as subscriber_type,
        s.isd_code,
        s.mobile_number,
        s.email_id,
        s.username,
        s.password,
        to_char(s.date_of_birth,'DD-MM-YYYY') AS date_of_birth,
        gp.proof as subscriber_proof_type,
        s.proof_number_sole,
        s.proof_number_pair,
        s.proof_copy_sole,
        s.proof_copy_pair,
        sprof.profile_image,
        sprof.height AS subscriber_height,
        sprof.weight AS subscriber_weight,
        c0.city_name AS subscriber_city_name,
        st.state_name AS subscriber_state_name,
        coun.name AS subscriber_country_name,
        sprof.is_student,
        sprof.is_coach,
        sprof.is_sponsor,
        sprof.is_organizer,
        sprof.sponsor_remarks,
        sprof.organizer_remarks,
        sp1.sports_name as coaching_sport_name,
        c1.city_name as coaching_city_name,
        scoach.locality as coaching_locality,
        scoach.remarks as coaching_remarks
           
        FROM subscriber as s
        LEFT JOIN subscriber_status AS substa
        ON substa.id = s.status
        LEFT JOIN gender AS gen
        ON gen.id = s.gender
        LEFT JOIN government_proof AS gp
        ON gp.id = s.proof_type
        LEFT JOIN user_role
        ON user_role.id = s.role
        LEFT JOIN subscriber_profile as sprof 
        ON sprof.subscriber_id = s.id
        LEFT JOIN city as c0
        ON c0.id = sprof.city
        LEFT JOIN state as st
        ON st.id = sprof.state
        LEFT JOIN country as coun
        ON coun.code = s.isd_code
        LEFT JOIN subscriber_coaching as scoach
        ON scoach.subscriber_id = s.id
        LEFT JOIN sports as sp1
        ON sp1.id = scoach.sports_id
        LEFT JOIN city as c1
        ON c1.id = scoach.city_id
        WHERE s.id = ${req.body.playerId}
        ORDER BY actio_subscription_id asc`;

        subscriber = await db.query(subscriber);
        if (subscriber.rowCount) {
            console.log(db)
            result['subscriber'] = subscriber.rows[0];
            result['subscriber']['parentDetails'] = await helper.checkParent(null, req.body.playerId);
            result['subscriber']['sportsDetails'] = await subscriberModel.getSportsProfile({
                myID: req.body.playerId
            })
            result['subscriber']['professionDetails'] = await subscriberModel.getProfessionProfile({
                myID: req.body.playerId
            })
            result['subscriber']['myTeams'] = await subscriberModel.getMyTeams({
                myID: req.body.playerId
            })
            result['subscriber']['highlightedVideos'] = await subscriberModel.getHighlightedVideos({
                myID: req.body.playerId
            })
            result['subscriber']['getMySponsor'] = await subscriberModel.getMySponsor({
                myID: req.body.playerId
            })
            result['subscriber']['getEducationProfile'] = await subscriberModel.getEducationProfile({
                myID: req.body.playerId
            })
            result['subscriber']['getProfileTraffic'] = await subscriberModel.getProfileTraffic({
                myID: req.body.playerId
            })
            result['subscriber']['getCompanyProfile'] = await subscriberModel.getCompanyProfile({
                myID: req.body.playerId
            })
            result['subscriber']['getViewPublic'] = await subscriberModel.getViewPublic({
                myID: req.body.playerId
            })
        }

        // let subscriber_education = `SELECT * FROM `;
        // subscriber_education = await db.query(subscriber_education);
        // if(subscriber_education.rowCount) {
        //     result['subscriber_education'] = subscriber_education.rows;
        // }

        // let subscriber_profile = `SELECT * FROM subscriber_profile`;
        // subscriber_profile = await db.query(subscriber_profile);
        // if(subscriber_profile.rowCount) {
        //     result['subscriber_profile'] = subscriber_profile.rows;
        // }

        // let subscriber_play = `SELECT * FROM subscriber_play`;
        // subscriber_play = await db.query(subscriber_play);
        // if(subscriber_play.rowCount) {
        //     result['subscriber_play'] = subscriber_play.rows;
        // }
        return result;
    }
    catch (err) {
        return {
            status: 500,
            err: err.message
        };
    }
}

const getCalendarInformation = async (req, res) => {
    try {
        let result = {};
        // Events registered by the user as opponent and competitor
        let eventRegisteredOpponent = `
        SELECT *,
        'opponent' as match_person,
        to_char(ems.created_at,'YYYY-MM-DD') created_at,
        to_char(ems.match_date,'YYYY-MM-DD') match_date,
        (SELECT row_to_json(t) FROM (SELECT * FROM event_registration WHERE id = ems.competitor_id)t ) AS competitor_json,
        (SELECT row_to_json(t) FROM (SELECT * FROM event_registration WHERE id = ems.opponent_id)t ) AS opponent_json
        FROM event_match_schedule AS ems
        WHERE opponent_id IN (SELECT er.id FROM event_players as ep INNER JOIN event_registration as er ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID})`;
        eventRegisteredOpponent = await db.query(eventRegisteredOpponent);
        eventRegisteredOpponent = eventRegisteredOpponent.rows;

        let eventRegisteredCompetitor = `
        SELECT *,
        'competitor' as match_person,
        to_char(ems.created_at,'YYYY-MM-DD') created_at,
        to_char(ems.match_date,'YYYY-MM-DD') match_date,
        (SELECT row_to_json(t) FROM (SELECT * FROM event_registration WHERE id = ems.competitor_id)t ) AS competitor_json,
        (SELECT row_to_json(t) FROM (SELECT * FROM event_registration WHERE id = ems.opponent_id)t ) AS opponent_json
        FROM event_match_schedule AS ems
        WHERE competitor_id IN
        (SELECT 
        er.id
        FROM 
        event_players as ep 
        INNER JOIN
        event_registration as er
        ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID})`;
        eventRegisteredCompetitor = await db.query(eventRegisteredCompetitor);
        eventRegisteredCompetitor = eventRegisteredCompetitor.rows;
        result['eventMatchRegistered'] = eventRegisteredOpponent.concat(eventRegisteredCompetitor);

        // Events created by the user
        let eventCreated = `SELECT 
        event_name,
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') event_start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') event_end_date
        FROM event As e WHERE created_by = ${req.myID}`;
        eventCreated = await db.query(eventCreated);
        eventCreated = eventCreated.rows;
        result['eventCreated'] = eventCreated;

        // Events managed by the user
        let eventManaged = `SELECT 
        e.event_name,
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') event_start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') event_end_date
        FROM event_managers as em
        INNER JOIN event as e
        ON em.event_id = e.id
        WHERE em.subscriber_id = ${req.myID}`;
        eventManaged = await db.query(eventManaged);
        eventManaged = eventManaged.rows;
        result['eventManaged'] = eventManaged;

        // Events controlled by the user
        let eventControlled = `SELECT 
        e.event_name,
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') event_start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') event_end_date
        FROM event_controllers as ec
        INNER JOIN event as e
        ON ec.event_id = e.id
        INNER JOIN subscriber as s
        ON s.subscriber_id = ec.subscriber_id
        WHERE s.id = ${req.myID}`;
        eventControlled = await db.query(eventControlled);
        eventControlled = eventControlled.rows;
        result['eventControlled'] = eventControlled;

        // Tournament Directors
        let tournamentDirectors = `SELECT 
        t.tournament_name,
        t.tournament_description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') tournament_start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') tournament_end_date
        FROM tournament_directors as td
        INNER JOIN tournament as t
        ON t.id = td.tournament_id
        INNER JOIN subscriber as s
        ON s.subscriber_id = td.subscriber_id
        WHERE s.id = ${req.myID}`;
        tournamentDirectors = await db.query(tournamentDirectors);
        tournamentDirectors = tournamentDirectors.rows;
        result['tournamentDirected'] = tournamentDirectors;

        // Tournament Created
        let tournamentCreated = `SELECT 
        t.tournament_name,
        t.tournament_description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') tournament_start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') tournament_end_date
        FROM tournament as t
        WHERE t.created_by = ${req.myID}`;
        tournamentCreated = await db.query(tournamentCreated);
        tournamentCreated = tournamentCreated.rows;
        result['tournamentCreated'] = tournamentCreated;

        return result;
    }
    catch (err) {
        return {
            status: 500,
            err: err.message
        };
    }
}

const getSpecificCalendarInformation = async (req, res) => {
    try {
        let result = {};
        if (req.body.weekly) {
            let query = `SELECT * FROM event WHERE`
        }
        else if (req.body)

            return result;
    }
    catch (err) {
        console.log(err)
        return {
            status: 500,
            err: err.message
        };
    }
}


const bannerList = async (req, res) => {
    try {

        console.log("BannerWebsiteLink: ");
        console.log(BannerWebsiteLink);

        let result = {};
        let query = "SELECT *, Concat('"+BannerWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM banner_website WHERE status = 1";
        
        console.log("query: ");
        console.log(query);

        result = await db.query(query);

        if(result && typeof result !=="undefined" && result!=="" && Object.keys(result).length>0)
        {
            result = result.rows;
        }

        return result;
    }
    catch (err) {
        console.log(err)
        return {
            status: 500,
            err: err.message
        };
    }
}

const testimonialList = async (req, res) => {
    try {

        console.log("TestimonialWebsiteLink: ");
        console.log(TestimonialWebsiteLink);

        let result = {};
        let query = "SELECT *, Concat('"+TestimonialWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM testimonial_website WHERE status = 1";
        
        console.log("query: ");
        console.log(query);

        result = await db.query(query);

        if(result && typeof result !=="undefined" && result!=="" && Object.keys(result).length>0)
        {
            result = result.rows;
        }
        
        return result;
    }
    catch (err) {
        console.log(err)
        return {
            status: 500,
            err: err.message
        };
    }
}

module.exports = {
    getSpecificCalendarInformation, getCalendarInformation, sendClient, getRequestValidationToken, suggestion,
    getUserForgotUsername, login, validateOTP, relation, logout, logSession, getfcmTokenbyID, menuPermission, userMenu, activityLog,
    getUserForgotPassword, validateUserForgotPassword, updatePassword, bannerList, testimonialList,academy_login
}
