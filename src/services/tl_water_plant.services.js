const db_fn = require('../configs/db.fn.config');
const { schema, tl_water_plant } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const { checkAndInsertProfile } = require('../utils/database_common_function');
const tl_group_service = require('../services/tl_group.services');



const get = async (dbConnection, userSession, water_plant_id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_water_plant, { water_plant_id });
    return doc;
}


const getByUserId = async (dbConnection, userSession, user_id) => {
    let criteria = {
        user_id
    }

    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_water_plant, criteria);
    return doc;
}

const getAll = async (dbConnection, userSession, criteria, fieldSet) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_water_plant, criteria, fieldSet);
        return doc;
    } catch (error) {
        throw error;
    }
}


const insert = async (dbConnection, userSession, body) => {
    try {
        await formValidation(formRequiredField.tl_water_plant("insert"), body);
        let response = await dbConnection.withTransaction(async tx => {
            await checkAndInsertProfile(tx, body.user_id, "WP", userSession.user_id);
            let groupRecord = await tl_group_service.isExistGroupId(tx, { group_id: body.group_id });
            if (!groupRecord) {
                throw "group_id does not exist"
            }

            let data = {
                ...body,
                action_flag: action_flag_A,
                created_on: currentDate(),
                modified_on: currentDate(),
                modified_by: userSession.user_id,
                created_by: userSession.user_id,
                established_on: toJSDate(body.established_on)
            }
            delete data.water_plant_id;
            delete data.water_plant_number;
            let waterPlant = await db_fn.insert_records(tx, schema, tl_water_plant, data);
            await tl_group_service.insertTypeOfUser(tx, userSession, { group_id: body.group_id, type_of_user_id: waterPlant.water_plant_id, user_type: "WP" })
            return waterPlant;
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, userSession, body, water_plant_id) => {
    try {
        await formValidation(formRequiredField.tl_water_plant("update"), body);
        let profile = await checkAndInsertProfile(dbConnection, body.user_id, "WP", userSession.user_id);

        if (!profile) {
            throw "error is occured on generating profile_id"
        }
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            established_on: toJSDate(body.established_on)
        }
        let criteria = {
            water_plant_id: water_plant_id
        }
        let records = await db_fn.update_records(dbConnection, schema, tl_water_plant, criteria, data);
        return records[0];
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_water_plant, criteria);
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

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;