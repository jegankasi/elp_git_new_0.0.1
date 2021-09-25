const db_fn = require('../configs/db.fn.config');
const schema_table = require('../configs/db.schema.table.config').doc_db_config;
const { schema, tl_group, tl_user, tl_user_roles, tl_profile_function, tl_function, tl_cache } = schema_table;
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const formRequiredField = require('../configs/table.model');
const formValidation = require('../configs/before.validation').formValidation;
const tl_profile_service = require('./tl_profile.services');
const tl_user_roles_service = require('./tl_user_roles.services');
const tl_profile_function_service = require('./tl_profile_function.services');
const tl_function_service = require('./tl_function.services');
const tl_user_service = require('./tl_user.services');
const tl_user_profiles = require('./tl_user_profiles.services')
const tl_menu_functions = require('./tl_menu_functions.services')
const tl_water_plant_service = require('./tl_water_plant.services');
const tl_industry_service = require('./tl_industry.services');
const tl_contractor_service = require('./tl_contractor.services');
const tl_delivery_boy_service = require('./tl_delivery_boy.services');
const tl_driver_service = require('./tl_driver.services');
const tl_sub_contractor_service = require('./tl_sub_contractor.services');
const tl_transport_agent_service = require('./tl_transport_agent.services');
const tl_vehicle_service = require('./tl_vehicle.services');
const tl_group_service = require("./tl_group.services");


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


// { fields: ['type', 'parent_id', 'user_role_id'] }
const userProfile = async (dbConnection, user_id, roles) => {
    const user_profile_List = [];
    let user_profiles = await tl_profile_service.getAll(dbConnection, { user_role_id: user_id, type: "U" });
    for (const rec of user_profiles) {
        let profile_rec = await tl_profile_service.get(dbConnection, { profile_id: rec.parent_id });
        if (profile_rec) {
            let userType = await tl_user_roles_service.get(dbConnection, { user_role_id: profile_rec.user_role_id });
            // const user_profile = {};
            if (userType) {
                // user_profile.user_role_id = profile_rec.user_role_id;
                //user_profile.user_role = userType.user_role;
                // user_profile.profile_id = rec.profile_id;
                roles.push(userType.user_role);
                //user_profile_List.push(user_profile);
            }
        }
    }

    console.log("user_profile_List---->", user_profile_List);
    return user_profile_List;
}

const getUserRoleOfGroup = async (dbConnection, user) => {
    let groupList = [];
    const userRoles = async (service, fields, user_type) => {
        const group = [];
        for (const role of await service.getAll(dbConnection, "", { user_id: user.user_id }, { fields })) {
            let groups = await tl_group_service.getAll(dbConnection, "", { type_of_user_id: role[fields[0]], user_type }, ['parent_id']);
            group.push({ id: role[fields[0]], name: role[fields[1]], group_id: groups.map(item => item.parent_id) });
            groupList.push([groups.map(item => item.parent_id), ...groupList]);
        }
        return group;
    }
    user.WP = await userRoles(tl_water_plant_service, ['water_plant_id', 'plant_name'], 'WP');
    user.IND = await userRoles(tl_industry_service, ["industry_id", 'industry_name'], "IND");
    user.CTR = await userRoles(tl_contractor_service, ["contractor_id", "agency_name"], "CTR");
    user.DB = await userRoles(tl_delivery_boy_service, ["delivery_boy_id", "deliveryboy_name"], "DB");
    user.DR = await userRoles(tl_driver_service, ["driver_id", "driver_name"], "DR");
    user.SCTR = await userRoles(tl_sub_contractor_service, ["sub_contractor_id", "agency_name"], "SCTR");
    user.TPA = await userRoles(tl_transport_agent_service, ["transport_agent_id", "agency_name"], "TPA");
    user.VEH = await userRoles(tl_vehicle_service, ["vehicle_id", 'vehicle_reg_no'], "VEH");


    user.groupList = Array.isArray(groupList) && groupList.length >= 1 ? await tl_group_service.runQuery(dbConnection, null, `select group_id, group_name from ${schema}.${tl_group} where group_id in (${groupList.toString()})`) : [];
    return user;
}


const authCheck = async (dbConnection, body) => {
    try {
        await formValidation(formRequiredField.tl_login("insert"), body);
        let criteria = {
            user_id: body.user_id,
            password: body.password,
        }
        const user = {};
        const tlUser = await tl_user_service.get(dbConnection, criteria);
        if (tlUser) {
            user.user_id = tlUser.user_id;
            user.first_name = tlUser.first_name;
            user.last_name = tlUser.last_name;
            user.gender = tlUser.gender;
            user.country_code = tlUser.country_code;
            user.roles = [];
            await userProfile(dbConnection, tlUser.user_id, user.roles);
            await getUserRoleOfGroup(dbConnection, user);
            await tl_user_service.updateProfile(dbConnection, user, user.user_id);
        } else {
            return null;
        }
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            user_id: user.user_id,
            gender: user.gender,
            country: user.country_code,
            roles: user.roles,
            ...user
        };
    } catch (err) {
        throw err;
    }
}

const getUserMenu = async (dbConnection, role) => {
    try {
        const userMenuProfile = await tl_user_profiles.getAll(dbConnection, { 'user_profile': role });
        const functionIds = [];
        for (const profile of userMenuProfile) {
            functionIds.push(profile['functionid']);
        }
        const userMenus = await tl_menu_functions.getAll(dbConnection, { 'functionid': functionIds })
        return userMenus;
    } catch (err) {
        throw err;
    }
}

module.exports.authCheck = authCheck;
module.exports.getUserMenu = getUserMenu;
