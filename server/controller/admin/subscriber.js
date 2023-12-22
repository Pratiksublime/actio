const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const subscriberModel = require('../../model/admin/subscriber');
const commonModel = require('../../model/common');

const push = async (req, res) => {
    try {
        let menuid = req.get('menuID');
        const menuPermission = await commonModel.menuPermission(req.myID, menuid);
        if (!menuPermission) {
            let result = {};
            result.msg = 'User Un-Authorized';
            result.status = process.env.STATUS_401;
            res.status(result.status).send(result);
            return false;
        }
    } catch (err) {
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }
    try {
        const logPush = await subscriberModel.logPush(req);
        res.status(200).send(logPush);
    } catch (err) {
        const error = new Error('Something Went Wrong');
        error.statusCode = 500;
        error.error = err;
        throw error;
    }
}

const bulk = async (req, res) => {
    // try {
    //     let menuid = req.get('menuID');
    //     const menuPermission = await commonModel.menuPermission(req.myID, menuid);
    //     if (!menuPermission) {
    //         let result = {};
    //         result.msg = 'User Un-Authorized';
    //         result.status = process.env.STATUS_401;
    //         res.status(result.status).send(result);
    //         return false;
    //     }
    // } catch (err) {
    // }
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(422).send({ errors: errors.array() });
    // }
    try {
        const logBulk = await subscriberModel.logBulk(req); 
        res.status(200).send(logBulk);
    } catch (err) {
        const error = new Error('Something Went Wrong');
        error.statusCode = 500;
        error.error = err;
        throw error;
    }
}

const updateProfile = async (req, res) => {
    let result = await subscriberModel.updateProfile(req);
    if (typeof result === 'object' && result.validationError) {
        return res.status(process.env.STATUS_200).send({ status: 422, msg: result.error })
    }
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const updateSportsProfile = async (req, res) => {
    let result = await subscriberModel.updateSportsProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getSportsProfile = async (req, res) => {
    let result = await subscriberModel.getSportsProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        sports: result
    });

}

const updateProfessionProfile = async (req, res) => {
    let result = await subscriberModel.updateProfessionProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getProfessionProfile = async (req, res) => {
    let result = await subscriberModel.getProfessionProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        profession: result
    });
}

const updateProfileViewPublic = async (req, res) => {
    let result = await subscriberModel.updateProfileViewPublic(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const updateMyTeams = async (req, res) => {
    let result = await subscriberModel.updateMyTeams(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getMyTeams = async (req, res) => {
    let result = await subscriberModel.getMyTeams(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
   
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        myTeams: result,
       // myTeams: result['team_data'] 
    });
}

const getViewPublic = async (req, res) => {
    let result = await subscriberModel.getViewPublic(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        viewPublic: result
    });
}

const updateHighlightedVideos = async (req, res) => {
    let result = await subscriberModel.updateHighlightedVideos(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getHighlightedVideos = async (req, res) => {
    let result = await subscriberModel.getHighlightedVideos(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        highlights: result
    });
}

const updateHighlightedgallery = async (req, res) => {
    let result = await subscriberModel.updateHighlightedgallery(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getHighlightedgallery = async (req, res) => {
    let result = await subscriberModel.getHighlightedgallery(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        gallery: result
    });
}


const updateMySponsor = async (req, res) => {
    let result = await subscriberModel.updateMySponsor(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getMySponsor = async (req, res) => {
    let result = await subscriberModel.getMySponsor(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        sponsor: result
    });
}

const updateEducationProfile = async (req, res) => {
    let result = await subscriberModel.updateEducationProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getEducationProfile = async (req, res) => {
    let result = await subscriberModel.getEducationProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        profile: result
    });
}

const updateProfileTraffic = async (req, res) => {
    let result = await subscriberModel.updateProfileTraffic(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getProfileTraffic = async (req, res) => {
    let result = await subscriberModel.getProfileTraffic(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        traffic: result
    });
}

const updateCompanyProfile = async (req, res) => {
    let result = await subscriberModel.updateCompanyProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getCompanyProfile = async (req, res) => {
    let result = await subscriberModel.getCompanyProfile(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        company: result
    });
}


const updateMySports = async (req, res) => {

    console.log('123456.....')
    let result = await subscriberModel.updateMySports(req);

    
    
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated!'
    });
}

const getMySports = async (req, res) => {
    let result = await subscriberModel.getMySports(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        sports: result
    });
}


const MySportslist = async (req, res) => {
    let result = await subscriberModel.MySportslist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_sports: result
    });
}

const Mytournamentlist = async (req, res) => {
    console.log('ffff');
    let result = await subscriberModel.Mytournamentlist(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        tournamentlist: result
    });
}

const Myeventlist_byid = async (req, res) => {
    let result = await subscriberModel.Myeventlist_byid(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        tournamentlist_byid: result
    });
}


const deletesubscriberdata = async (req, res) => {
    let result = await subscriberModel.deletesubscriberdata(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        tournamentlist_byid: result
    });
}



module.exports = {
    MySportslist,getMySports,updateMySports,getCompanyProfile, updateCompanyProfile, getProfileTraffic, updateProfileTraffic, getEducationProfile,
    updateEducationProfile, getMySponsor, updateMySponsor, getHighlightedVideos, updateHighlightedVideos,updateHighlightedgallery,getHighlightedgallery, getViewPublic,
    getMyTeams, updateMyTeams, updateSportsProfile, push, bulk, updateProfile, getSportsProfile, updateProfessionProfile,
    getProfessionProfile, updateProfileViewPublic,Mytournamentlist,Myeventlist_byid,deletesubscriberdata
};