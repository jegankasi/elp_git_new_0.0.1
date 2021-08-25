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

const get = async (dbConnection, userSession, criteria) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_group, criteria);
    return doc;
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


const insert = async (dbConnection, userSession, body) => {
    await formValidation(formRequiredField.tl_group("insert"), body);
    let data = {
        ...body,
        action_flag: action_flag_A,
        created_on: currentDate(),
        modified_on: currentDate(),
        modified_by: userSession.user_id,
        created_by: userSession.user_id,
        parent_id: 0,
        user_type: "G",

    }
    delete data.group_id;
    delete data.group_number;
    return await db_fn.insert_records(dbConnection, schema, tl_group, data);
}

const isExistGroupId = async (dbConnection, group_id) => {
    try {
        let criteria = {
            group_id
        }
        let isExist = await db_fn.get_one_from_db(dbConnection, schema, tl_group, criteria);
        if (!isExist) {
            throw "group_id not exist";
        }
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
        await isExistGroupId(dbConnection, group_id);
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
    const response = await getByGroupName(dbConnection, userSession, groupName);
    let criteria = { parent_id: response.group_id };
    return await getAll(dbConnection, criteria, ['type_of_user_number', 'user_type']);
}

module.exports.runQuery = runQuery;
module.exports.get = get;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;
module.exports.insertTypeOfUser = insertTypeOfUser;
module.exports.groupOfUser = groupOfUser;
module.exports.getByUserType = getByUserType;
module.exports.getTypeOfUserNumberByGroupId = getTypeOfUserNumberByGroupId;
