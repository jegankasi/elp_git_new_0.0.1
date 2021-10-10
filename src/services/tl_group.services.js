const db_fn = require('../configs/db.fn.config');
const { schema, tl_group } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const tl_water_plant_service = require('../services/tl_water_plant.services');
const tl_contractor_service = require('../services/tl_contractor.services');
const tl_sub_contractor_service = require('../services/tl_sub_contractor.services');
const tl_vehicle_service = require('../services/tl_vehicle.services');
const tl_industry_service = require('../services/tl_industry.services');
const tl_transport_agent_service = require('../services/tl_transport_agent.services');
const tl_driver_service = require('../services/tl_driver.services');
const tl_delivery_boy_service = require('../services/tl_delivery_boy.services');


const get = async (dbConnection, userSession, group_id) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_group, { parent_id: group_id });
    return doc;
}

const getGroups = async (dbConnection, userSession) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_group, { user_type: 'G' }, { fields: ['group_id', 'group_name'] });
        return doc;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const runQuery = async (dbConnection, userSession, query) => {
    const doc = await db_fn.run_query(dbConnection, query);
    return doc;
}

const getByGroupName = async (dbConnection, userSession, group_name) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_group, { group_name });
    return doc;
}

const getByUserType = async (dbConnection, userSession, user_type) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_group, { user_type });
    return doc;
}

const getAll = async (dbConnection, userSession, criteria, fields) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_group, criteria, {
        fields,
        order: [
            { field: "group_id", direction: "asc" }
        ]
    });
    return doc;
}

const getTypeOfUserNumberByGroupId = async (dbConnection, group_id) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_group, { parent_id: group_id });
    return doc;
}

const new_insert_id = async (dbConnection, user_type) => {
    try {
        const query = `select max(type_of_user_id) from ${schema}.${tl_group} where user_type = '${user_type}'`;
        let max_id = await db_fn.run_query(dbConnection, query);
        return max_id[0].max + 1;
    } catch (err) {
        throw err;
    }
}


const insertGroup = async (dbConnection, userSession, body) => {
    try {
        await formValidation(formRequiredField.tl_group("insert"), body);
        let data = {
            group_name: body.group_name,
            description: body.description,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            created_by: userSession.user_id,
            parent_id: 0,
            user_type: "G",
            type_of_user_id: await new_insert_id(dbConnection, 'G')
        }
        delete data.group_id;
        return await db_fn.insert_records(dbConnection, schema, tl_group, data);
    } catch (err) {
        throw err;
    }
}

const insert = async (dbConnection, userSession, body) => {
    let data;
    try {
        // if (!Array.isArray(body.groupMembers)) {
        //     throw "it is not array of object";
        // }

        if (await isExistGroupId(dbConnection, { group_name: body.group_name })) {
            throw "group name is already exist";
        }
        data = await dbConnection.withTransaction(async tx => {
            let group = await insertGroup(tx, userSession, body);
            // body.groupMembers.forEach(async ob => {
            //     await insertTypeOfUser(tx, userSession, {
            //         group_id: group.group_id,
            //         type_of_user_id: ob.id,
            //         user_type: ob.category
            //     });
            // })
            return "success";
        });
    } catch (err) {
        throw err;
    }
    return data;
}

const isExistGroupId = async (dbConnection, criteria) => {
    try {

        let isExist = await db_fn.get_one_from_db(dbConnection, schema, tl_group, criteria);

        return isExist;
    } catch (error) {

        throw error;
    }
}


const isExistTypeOfUser = async (dbConnection, type_of_user_id, userSession, user_type) => {
    try {
        let isExist, flag = 0;
        if (user_type === 'WP') {
            flag = 1;
            isExist = await tl_water_plant_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "water plant number not exist";
            }
            return isExist;
        }
        if (user_type === 'CTR') {
            flag = 1;
            isExist = await tl_contractor_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "contractor number not exist";
            }
            return isExist;
        }

        if (user_type === 'TPA') {
            flag = 1;
            isExist = await tl_transport_agent_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "transport agent number not exist";
            }
            return isExist;
        }
        if (user_type === 'SCTR') {
            flag = 1;
            isExist = await tl_sub_contractor_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "sub contractor number not exist";
            }
            return isExist;
        }
        if (user_type === 'IND') {
            flag = 1;
            isExist = await tl_industry_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "industry number not exist";
            }
            return isExist;
        }
        if (user_type === 'DR') {
            flag = 1;
            isExist = await tl_driver_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "driver number not exist";
            }
            return isExist;
        }
        if (user_type === 'VEH') {
            flag = 1;
            isExist = await tl_vehicle_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "vehicle number not exist";
            }
            return isExist;
        }
        if (user_type === 'DB') {
            flag = 1;
            isExist = await tl_delivery_boy_service.get(dbConnection, userSession, type_of_user_id);
            if (!isExist) {
                throw "delivery boy number not exist";
            }
            return isExist;
        }

        if (flag === 0) {
            throw "no category of type of user";
        }

    } catch (error) {
        throw error;
    }
}

const insertTypeOfUser = async (dbConnection, userSession, params) => {
    let { group_id, type_of_user_id, user_type } = params;
    try {
        await isExistTypeOfUser(dbConnection, type_of_user_id, userSession, user_type);

        let data = {
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            created_by: userSession.user_id,
            parent_id: group_id,
            user_type,
            type_of_user_id
        }
        delete data.group_id;
        delete data.group_number;
        return await db_fn.insert_records(dbConnection, schema, tl_group, data);
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_group("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }


        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_group, criteria, data);
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_group, criteria);
        return "deleted";
    } catch (err) {
        throw err;
    }
}

const saveAll = async (dbConnection, body) => {
    try {
        if (!Array.isArray(body)) {
            throw "it is not array of object";
        }
        let data = await dbConnection.withTransaction(async tx => {
            body.forEach(async ob => {
                await insert(tx, ob);
            })
            return "success";
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const groupOfUser = async (dbConnection, userSession, groupName) => {
    try {
        const response = await getByGroupName(dbConnection, userSession, groupName);
        if (!response) {
            return "data is not exist"
        }
        let criteria = { parent_id: response.group_id };
        let data = await getAll(dbConnection, userSession, criteria, ['type_of_user_id', 'user_type']);
        //return data;
        const result = [];
        for (const element of data) {
            const rs = {};
            if (element.user_type == 'CTR') {
                rs.user_type = 'CTR';
                rs.user = await tl_contractor_service.get(dbConnection, userSession, element.type_of_user_id);
                result.push(rs);
            }
            if (element.user_type == 'IND') {
                rs.user_type = 'IND';
                rs.user = await tl_industry_service.get(dbConnection, userSession, element.type_of_user_id);
                result.push(rs);
            }
            if (element.user_type == 'WP') {
                rs.user_type = 'WP';
                rs.user = await tl_water_plant_service.get(dbConnection, userSession, element.type_of_user_id);
                result.push(rs);
            }
            if (element.user_type == 'TPA') {
                rs.user_type = 'TPA';
                rs.user = await tl_water_plant_service.get(dbConnection, userSession, element.type_of_user_id);
                result.push(rs);
            }
        }
        return result;
    } catch (err) {
        throw err;
    }
}

const getAllRoles = async (dbConnection, userSession, groupName) => {
    if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'ADMIN')) {
        throw "forbidden access";
    }
    let response = {}, CTR = {}, SCTR = {}, IND = {}, TPA = {}, WP = {};

    try {
        CTR = await tl_contractor_service.getAll(dbConnection, userSession, {}, { "fields": ["contractor_id", "agency_name"] });
        SCTR = await tl_sub_contractor_service.getAll(dbConnection, userSession, {}, { "fields": ["sub_contractor_id", "agency_name"] });
        IND = await tl_industry_service.getAll(dbConnection, userSession, {}, { "fields": ["industry_id", "industry_name"] });
        TPA = await tl_transport_agent_service.getAll(dbConnection, userSession, {}, { "fields": ["transport_agent_id", "agency_name"] });
        WP = await tl_water_plant_service.getAll(dbConnection, userSession, {}, { "fields": ["water_plant_id", "plant_name"] });
        response.CTR = CTR.forEach(data => ({ id: data.contractor_id, name: data.agency_name }));
        response.SCTR = SCTR.map(data => ({ id: data.sub_contractor_id, name: data.agency_name }));
        response.IND = IND.map(data => ({ id: data.industry_id, name: data.industry_name }));
        response.TPA = TPA.map(data => ({ id: data.transport_agent_id, name: data.agency_name }));
        response.WP = WP.map(data => ({ id: data.water_plant_id, name: data.plant_name }));
    } catch (err) {
        throw err;
    }
    return response;
}

module.exports.runQuery = runQuery;
module.exports.get = get;
module.exports.getGroups = getGroups;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;
module.exports.insertTypeOfUser = insertTypeOfUser;
module.exports.groupOfUser = groupOfUser;
module.exports.getByUserType = getByUserType;
module.exports.getTypeOfUserNumberByGroupId = getTypeOfUserNumberByGroupId;
module.exports.getAllRoles = getAllRoles;
module.exports.isExistGroupId = isExistGroupId;
