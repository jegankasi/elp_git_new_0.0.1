const db_fn = require('../configs/db.fn.config');
const schema_table = require('../configs/db.schema.table.config').doc_db_config;
const { schema, tl_profile, tl_user, tl_user_type, tl_profile_function, tl_function, tl_cache } = schema_table;
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const formRequiredField = require('../configs/table.model');
const formValidation = require('../configs/before.validation').formValidation;
const tl_cache_service = require('./tl_cache.services');


const profile_short = ["ADMIN", "CTR", "SCTR", "IND", "WP", "TPA", "VEH", "DR", "DB"];

const getProfileAuthAccess = async (dbConnection, profile_id) => {
    let user_profile_function = await db_fn.get_all_from_db(dbConnection, schema, tl_profile_function, { profile_id });
    const item = {};
    for (const prfFn of user_profile_function) {
        let property = {};
        let fn = await db_fn.get_one_from_db(dbConnection, schema, tl_function, { id: prfFn.function_id }, { fields: ['function_name'] });
        property._create = prfFn._create;
        property._createAll = prfFn._createAll;
        property._read = prfFn._read;
        property._readAll = prfFn._readAll;
        property._update = prfFn._update;
        property._updateAll = prfFn._updateAll;
        property._delete = prfFn._delete;
        property._deleteAll = prfFn._deleteAll;
        item[fn.function_name] = property;
    }
    return item;
}



const userProfile = async (dbConnection, user_id, roles) => {
    let user_profiles = await db_fn.get_all_from_db(dbConnection, schema, tl_profile, { user_type_id: user_id, type: "U" });
    let profiles = {};
    for (const rec of user_profiles) {
        let userProfile = {};
        let profile_rec = await db_fn.get_one_from_db(dbConnection, schema, tl_profile, { id: rec.parent_id });
        if (profile_rec) {
            let userType = await db_fn.get_one_from_db(dbConnection, schema, tl_user_type, { id: profile_rec.user_type_id });
            if (userType) {
                userProfile.user_type_id = userType.id;
                userProfile.user_type = userType.user_type;
                userProfile.profile_id = rec.id;
                userProfile.authUrl = await getProfileAuthAccess(dbConnection, profile_rec.id);
                roles.push(userType.user_type);
                profiles[userType.user_type] = userProfile;
            }
        }
    }

    return profiles;
}


const authCheck = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_login("insert"), body);
        let criteria = {
            ...body,
        }

        const user = {};
        const tlUser = await db_fn.get_one_from_db(dbConnection, schema, tl_user, criteria);
        if (tlUser) {
            user.user_id = tlUser.id;
            user.first_name = tlUser.first_name;
            user.last_name = tlUser.last_name;
            user.user_number = tlUser.user_number;
            user.gender = tlUser.gender;
            user.country_code = tlUser.country_code;
            user.roles = [];
            user.activeRole = "";
            user.profiles = await userProfile(dbConnection, tlUser.id, user.roles);
        }
        let payLoad = {
            user_id: tlUser.id,
            document: user
        }
        await tl_cache_service.insert(dbConnection, payLoad);
        return "checked";
    } catch (err) {
        throw err;
    }
}




module.exports = {
    authCheck
}