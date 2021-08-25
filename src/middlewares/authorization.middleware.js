const jwt = require('jsonwebtoken');
const login = require("../services/tl_login.services");
const tlUser = require("../services/tl_user.services");
const util = require("../utils/utils");
const tl_group_service = require("../services/tl_group.services");
const { schema, tl_group } = require('../configs/db.schema.table.config').doc_db_config;


const checkRoles = (roles, activeRole) => roles.filter((role) => role === activeRole);
const authorize_token = async (req, res, next) => {
    const auth_token = req.headers['authorization'];
    const activeRole = req.headers['active_role'];
    const activeGroupId = req.headers['group_id'];
    const activeRoleId = req.headers['active_role_id'];
    try {
        const token = auth_token && auth_token.replace('Bearer ', '');
        if (!token) return res.status(401).send({ status: 'error', data: 'Unauthorized!' });
        if (!activeRole) return res.status(401).send({ status: 'error', data: 'please mentioned activerole in header!' });
        let data = jwt.verify(token, process.env.SECRET_JWT_KEY);
        let profileData = await tlUser.getProfile(req.app.get("db"), data.user_id);
        req.user_session = { ...profileData['user_profile'], activeRole, activeGroupId, activeRoleId };
        let active_role = checkRoles(req.user_session['roles'], activeRole);
        if (!active_role.length >= 1) {
            throw "please mentioned relavant activeRole"
        }

        if (activeRole != 'ADMIN' && req.url.includes("getUserMenu") == false && req.url.includes("getUserItemsByRole") == false) {
            util.isActiveRoleAllowed(req.user_session, activeGroupId, activeRoleId);
        }
        next();
    } catch (err) {
        return res.status(401).send({ status: 'error', data: err });
    }
}

const get_token = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const password = req.params.password;
        const user = await login.authCheck(req.app.get("db"), { user_id, password });
        if (!user) {
            return res.status(401).send({ status: 'error', data: "unAuthorized" });
        }
        const access_token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_JWT_KEY, {});
        //const access_token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_JWT_KEY, { expiresIn: "365d" }); //60 * 15 
        return res.status(200).send({ status: 'success', data: { 'token': access_token, user } });
    } catch (err) {
        throw err;
        return res.status(401).send({ status: 'error', data: err });
    }
}

const get_user_menu = async (req, res, next) => {
    try {
        const userMenu = await login.getUserMenu(req.app.get("db"), req.user_session['activeRole']);
        return res.status(200).send({ status: 'success', data: { 'menulist': userMenu } });
    } catch (err) {
        return res.status(500).send({ status: 'error', data: err });
    }
}

const reducer = (accumulator, currentValue) => accumulator.concat(currentValue);

const groupList = async (req, role) => {
    let collectGroupId = req.user_session[role].map(data => data.group_id).reduce(reducer).filter((v, i, a) => a.indexOf(v) === i);
    return Array.isArray(collectGroupId) && collectGroupId.length >= 1 ? await tl_group_service.runQuery(req.app.get("db"), req.user_session, `select group_id, group_name from ${schema}.${tl_group} where group_id in (${collectGroupId.toString()})`) : [];
}

const getUserItemsByRole = async (req, res) => {
    try {
        let activeRole = req.user_session['activeRole'];
        if (!(activeRole == 'SCTR' || activeRole == 'CTR' || activeRole == 'TPA' || activeRole == 'WP' || activeRole == 'IND' || activeRole == 'DR' || activeRole == 'DB')) {
            return res.status(500).send({ status: 'error', data: "user role does not match" });
        }
        if (activeRole == 'WP') {
            return res.status(200).send({ status: 'success', data: req.user_session.WP, groups: await groupList(req, 'WP') });
        }
        if (activeRole == 'CTR') {
            return res.status(200).send({ status: 'success', data: req.user_session.CTR, groups: await groupList(req, 'CTR') });
        }
        if (activeRole == 'TPA') {
            return res.status(200).send({ status: 'success', data: req.user_session.TPA, groups: await groupList(req, 'TPA') });
        }
        if (activeRole == 'IND') {
            return res.status(200).send({ status: 'success', data: req.user_session.IND, groups: await groupList(req, 'IND') });
        }

        if (activeRole == 'DR') {
            return res.status(200).send({ status: 'success', data: req.user_session.DR, groups: await groupList(req, 'DR') });
        }

        if (activeRole == 'DB') {
            return res.status(200).send({ status: 'success', data: req.user_session.DB, groups: await groupList(req, 'DB') });
        }
        return null;

    } catch (err) {
        throw err;
    }
}
module.exports = { authorize_token, get_token, get_user_menu, getUserItemsByRole }
