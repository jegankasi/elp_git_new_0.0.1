const jwt = require('jsonwebtoken');
const login = require("../services/tl_login.services");
const tlUser = require("../services/tl_user.services");
const util = require("../utils/utils");


function matchUrl(param1, param2) {
    if (param1 && param2) {
        let v1 = "/v1/agency/uploadFile/base64/:id/xx/:uu/KARTHI/:ll",
            v2 = "/v1/agency/uploadFile/base64/SK5/xx/564/KARTHIK/541";
        v1 = param1, v2 = param2;
        v1 = v1.replace(/\//g, "\\/");
        let splitStrs = v1.split(":");
        let myStr = splitStrs[0];
        for (let i = 1; i < splitStrs.length; i++) {
            if (splitStrs[i].indexOf('/') > 1) {
                let ij = splitStrs[i].indexOf('/'),
                    spStr = splitStrs[i].slice(ij, splitStrs[i].length);
                myStr += "(.+)";
                myStr += "\\" + spStr;

            } else {
                myStr += "(.+)";
            }
        }
        let nRgx = new RegExp(myStr);
        let retStmnt = nRgx.test(v2);
        return retStmnt;
    } else {
        return false;
    }
}

const isAuthorized = (requestURL, collectionURL) => {
    for (const currentObject of collectionURL) {
        let isMatch = matchUrl(currentObject.url, requestURL);
        if (isMatch) {
            return true;
        }
    }
    return false;
}

function getFunctionName(url) {
    let av = "/v1/agency/tl_util",
        splitStr = "v1/agency";
    av = url;
    if (av.indexOf(splitStr) > -1) {
        let fInd = av.indexOf(splitStr);
        fInd = fInd + splitStr.length + 1;

        fInd = av.slice(fInd, av.length);
        let retStr = "";

        if (fInd.indexOf('/') > 0) {
            let fSlash = fInd.indexOf('/');
            retStr = fInd.slice(0, fSlash);
        } else if (fInd.indexOf('/?') > 0) {
            let fSlash = fInd.indexOf('/');
            retStr = fInd.slice(0, fSlash);

        } else if (fInd.indexOf('?') > 0) {
            let fSlash = fInd.indexOf('?');
            retStr = fInd.slice(0, fSlash);
        }
        else {
            retStr = fInd;
        }
        return retStr;
    }
}

const filterURl = (method, authURL) => {
    return authURL.filter(data => data.method === method);
}

const authorize_token = async (req, res, next) => {
    const auth_token = req.headers['authorization'];
    const activeRole = req.headers['activerole'];
    const findUrl = (requestUrl, requestMethod, userRoleAuthUrls) => {
        let functionName = getFunctionName(requestUrl);

        let authUrl = userRoleAuthUrls && userRoleAuthUrls[functionName];

        if (!authUrl) {
            throw "no authorization url";
        }
        let accessURL = filterURl(requestMethod, authUrl);

        if (!isAuthorized(requestUrl, accessURL)) {
            throw "Access Forbidden";
        }

    }
    try {
        const token = auth_token && auth_token.replace('Bearer ', '');
        if (!token) return res.status(401).send({ status: 'error', data: 'Unauthorized!' });
        if (!activeRole) return res.status(401).send({ status: 'error', data: 'please mentioned activerole in header!' });
        let data = jwt.verify(token, process.env.SECRET_JWT_KEY);
        let profileData = await tlUser.getProfile(req.app.get("db"), data.userId);
        req.user_details = profileData['user_profile'];
        if (activeRole) {
            let userRoleUrls = profileData['user_profile'].profiles[activeRole];
            findUrl(req.originalUrl, req.method, userRoleUrls.authUrl);
        }
        next();
    } catch (err) {
        return res.status(401).send({ status: 'error', data: err });
    }
}

const get_token = async (req, res, next) => {
    try {
        const user = await login.authCheck(req.app.get("db"), req.body);
        const access_token = jwt.sign({ userId: user }, process.env.SECRET_JWT_KEY, { expiresIn: 60 * 15 });
        return res.status(200).send({ status: 'success', data: { access_token } });
    } catch (err) {
        return res.status(401).send({ status: 'error', data: err });
    }
}
module.exports = { authorize_token, get_token }