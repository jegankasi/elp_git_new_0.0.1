const _ = require('underscore');
var aes256 = require('aes256');
const moment = require("moment");


let cache = null;

const action_flag_A = "A";
const action_flag_M = "M";
const action_flag_D = "D";
const Group = "'group_'";
//const currentDate = moment().utcOffset(0, true).format();

const currentDate = () => {
    return new Date();
}

const toJSDate = (dateTime) => {
    try {
        moment.defaultFormat = "DD/MM/YYYY";
        if (!moment(dateTime, moment.defaultFormat, true).isValid()) {
            throw "date format is not correct"
        }
        return moment(dateTime, moment.defaultFormat, true).toDate();
    } catch (err) {
        throw err + " format is DD/MM/YYYY";
    }
}





const check_required_fields = (actual_array, reference_array) => {
    const common_keys = _.intersection(actual_array, reference_array);
    if (common_keys.length === reference_array.length) {
        return true;
    } else {
        return false;
    }
}

function encrypt(text, key) {
    if (text && key) {
        return aes256.encrypt(key, text);
    } else {
        return "";
    }
}

const decrypt = (text, key) => {
    if (text && key) {
        return aes256.decrypt(key, text);
    } else {
        return "";
    }
}

function json_parse(str) {
    let json = {};
    try {
        json = JSON.parse(str);
    } catch (e) {
        return {};
    }
    return json;
}

const get_all_keys_of_json = (object, return_object) => {
    const keys = Object.keys(object);
    return_object = _.union(return_object, keys);
    _.each(object, (value) => {
        if (typeof value === "object") {
            return_object = get_all_keys_of_json(value, return_object);
        }
    })
    return return_object;
}

const allowedUrls = ["v1/agency/tl_login"];

const getUserId = (tokenId) => {
    return {
        userId: "12345"
    }
}

const isActiveRoleAllowed = (userSession, id, group_id, active_role_id) => {
    let group = Array.isArray(userSession[userSession.activeRole]) && userSession[userSession.activeRole].filter(data => data[id]).map(ob => ob[id] == active_role_id && ob.group_id.find((itms) => itms));
    if (group[0] != group_id) {
        throw "group id does not match";
    }
    return true;
}

module.exports = {
    check_required_fields,
    decrypt,
    encrypt,
    json_parse,
    get_all_keys_of_json,
    getUserId,
    currentDate,
    action_flag_A,
    action_flag_M,
    action_flag_D,
    Group,
    allowedUrls,
    toJSDate,
    isActiveRoleAllowed
}
