const jwt = require('jsonwebtoken');
const login = require("../services/tl_login.services");
const util = require("../utils/utils");

const authorize_token = async (req, res, next) => {

    const findUrl = (requestUrl, requestMethod, userRoleAuthUrls) => {

        console.log("requestUrl--->", requestUrl);
        console.log("requestMethod--->", requestMethod);
        console.log("userRoleAuthUrls--->", userRoleAuthUrls);


    }




    const auth_token = req.headers['authorization'];
    const token = auth_token && auth_token.replace('Bearer ', '');
    if (!token) return res.status(401).send({ status: 'error', data: 'Unauthorized!' });
    jwt.verify(token, process.env.SECRET_JWT_KEY, (err, data) => {
        if (err) res.status(401).send({ status: 'error', data: 'Unauthorized' });
        req.user_details = data;
        let role = req.headers['role'];
        if (role) {
            let userRoleUrls = data.profiles[role];
            findUrl(req.url, req.method, userRoleUrls);
        }
        next();
    })
}

const get_token = async (req, res, next) => {
    try {
        const user = await login.authCheck(req.app.get("db"), req.body);
        const access_token = jwt.sign(user, process.env.SECRET_JWT_KEY);
        res.status(200).send({ status: 'success', data: { access_token } });
    } catch (err) {
        res.status(413).send({ status: 'error', data: err });
    }
}
module.exports = { authorize_token, get_token }