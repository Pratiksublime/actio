const { Query } = require('pg');
const db = require('../../db');
const helper = require('../../helper/helper');

const BannerWebsiteLink =process.env.HOST+process.env.PORT+'/';

const list = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT *, Concat('"+BannerWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM banner_website WHERE status = 1 ORDER BY id DESC";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const info = async (req, res) => {
    console.log("banner website info")
    let result = {};
    try {
        console.log("req.query.id: ");
        console.log(req.query.id);

        //let listStr = "SELECT *, Concat('"+BannerWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM banner_website WHERE status = 1 and id = "+req.query.id;
        let listStr = "SELECT *, Concat('"+BannerWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM banner_website WHERE status = 1 and id = "+req.body.id;

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err:");
        console.log(err);

        result = {};
    }
    return result;
}

const insert = async (req, res) => {
    try {
        var bannerPath = 'images/banner_website/';

        var image_path = req.body.image_path;

        var image_path_new = "";

        if (image_path && typeof image_path !=="undefined" && image_path.length) {
            var image_path = helper.uploadBase64(image_path[0], bannerPath);
            image_path_new = image_path.path;
        }

        var statusStr = "INSERT into " + process.env.SCHEMA + ".banner_website (title, description, image_path, status,url,created_by, created_at ) values ('"+req.body.title+"', '"+req.body.description+"', '"+image_path_new+"',1,'"+req.body.url+"', 1, now()) ";

        console.log("statusStr ");
        console.log(statusStr);

        await db.query(statusStr);

        return true;
    } catch (err) {
        console.log("err: ");
        console.log(err);

        return false;
    }
}

const update = async (req, res) => {
    try {

        var bannerPath = 'images/banner_website/';

        var image_path = req.body.image_path;

        var image_path_new = "";

        if (image_path && typeof image_path !=="undefined" && image_path.length) {
            var image_path = helper.uploadBase64(image_path[0], bannerPath);
            image_path_new = image_path.path;
        }

        var updateStr = "";

        if(image_path_new && typeof image_path_new !=="undefined" && image_path_new!==""){
            updateStr = ", image_path='"+image_path_new+"' "
        }

    var statusStr = "UPDATE " + process.env.SCHEMA + ".banner_website SET title='" + req.body.title + "', description='" + req.body.description + "',url='" + req.body.url + "', updated_at=now() "+updateStr+" WHERE id=" + req.body.id + "";

        console.log("update statusStr:");
        console.log(statusStr);

        await db.query(statusStr);
        return true;
    } catch (err) {
        
        console.log("update err:");
        console.log(err);

        return false;
    }
}

const deletedata = async (req, res) => {
    try {
        let statusStr = "UPDATE banner_website SET status= 2 ,updated_at=now() WHERE id=" + req.body.id + "";
         

        console.log("statusStr.....");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    } catch (err) {
        console.log("err///");
        console.log(err);
        return false;
    }
}

module.exports = { list, info, insert, update ,deletedata}