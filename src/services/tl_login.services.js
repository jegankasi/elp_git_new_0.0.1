const db_fn = require('../configs/db.fn.config');
const schema_table = require('../configs/db.schema.table.config').doc_db_config;
const { schema, tl_profile, tl_user, tl_user_type, tl_profile_function, tl_function, tl_cache } = schema_table;
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const formRequiredField = require('../configs/table.model');
const formValidation = require('../configs/before.validation').formValidation;
const tl_profile_service = require('./tl_profile.services');
const tl_user_type_service = require('./tl_user_type.services');
const tl_profile_function_service = require('./tl_profile_function.services');
const tl_function_service = require('./tl_function.services');
const tl_user_service = require('./tl_user.services');
const tl_user_profiles = require('./tl_user_profiles.services')
const tl_menu_functions = require('./tl_menu_functions.services')


const profile_short = ["ADMIN", "CTR", "SCTR", "IND", "WP", "TPA", "VEH", "DR", "DB"];


const getFunction = async (dbConnection, function_id, auth_url) => {
    const fn = await tl_function_service.get(dbConnection, function_id, { fields: ['function_name', 'options'] });

    const options = auth_url.map(data => fn.options[data]);
    return { function_name: fn.function_name, options };
}

const getProfileAuthAccess = async (dbConnection, profile_id) => {
    try {
        let user_profile_function = await tl_profile_function_service.getAll(dbConnection, { profile_id });
        const item = {};
        for (const prfFn of user_profile_function) {
            const authUrl = await getFunction(dbConnection, prfFn.function_id, prfFn.auth_url);
            item[authUrl.function_name] = authUrl.options;
        }
        return item;
    } catch (err) {
        throw err;
    }
}



const userProfile = async (dbConnection, user_id, roles) => {
    let user_profiles = await tl_profile_service.getAll(dbConnection, { user_type_id: user_id, type: "U" });
    let profiles = {};
    for (const rec of user_profiles) {
        let userProfile = {};
        let profile_rec = await tl_profile_service.get(dbConnection, { id: rec.parent_id });
        if (profile_rec) {
            let userType = await tl_user_type_service.get(dbConnection, { id: profile_rec.user_type_id });
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


const authCheck = async (dbConnection, body) => {
    try {
        await formValidation(formRequiredField.tl_login("insert"), body);
        let criteria = {
            ...body,
        }

        const user = {};
        const tlUser = await tl_user_service.get(dbConnection, criteria);
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

        await tl_user_service.updateProfile(dbConnection, user, tlUser.id);
        return {'user' : tlUser.id, 'roles' :user.roles} ;
    } catch (err) {
        throw err;
    }
}

const getUserMenu = async (dbConnection, role)=>{
    try{
    const userMenuProfile = await tl_user_profiles.getAll(dbConnection, {'user_profile':role});
    const functionIds = [];
    for (const profile of userMenuProfile) {
        functionIds.push(profile['functionid']);
    }
    const userMenus = await tl_menu_functions.getAll(dbConnection , {'functionid':functionIds})
    return userMenus;
    }catch (err) {
        throw err;
    }
}


module.exports = {
    authCheck,getUserMenu
}