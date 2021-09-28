const db_fn = require('../configs/db.fn.config');
const { schema, tl_driver } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const { checkAndInsertProfile } = require('../utils/database_common_function');
const tl_group_service = require('../services/tl_group.services');

const get = async (dbConnection, userSeession, driver_id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_driver, { driver_id });
    return doc;
}


const getAll = async (dbConnection, userSession, criteria, fieldSet) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_driver, criteria, fieldSet);
    return doc;
}


const insert = async (dbConnection, userSession, body) => {
    try {
        await formValidation(formRequiredField.tl_driver("insert"), body);
        let response = await dbConnection.withTransaction(async tx => {
            let profile = await checkAndInsertProfile(tx, body.user_id, "DR", userSession.user_id);
            if (!profile) {
                throw "error is occured on generating profile_id"
            }
            let groupRecord = await tl_group_service.isExistGroupId(tx, userSession, { group_id: body.group_id });
            if (!groupRecord) {
                throw "group_id does not exist"
            }
            let data = {
                ...body,
                profile_id: profile.id,
                action_flag: action_flag_A,
                created_on: currentDate(),
                modified_on: currentDate(),
                modified_by: userSession.user_id,
                created_by: userSession.user_id,
                dl_expires_on: toJSDate(body.dl_expires_on),
            }
            let driver = await db_fn.insert_records(tx, schema, tl_driver, data);
            await tl_group_service.insertTypeOfUser(tx, userSession, { group_id: data.group_id, type_of_user_id: driver.driver_id, user_type: "DR" });
            return driver;
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, userSession, body, driver_id) => {
    try {
        await formValidation(formRequiredField.tl_driver("update"), body);
        let profile = await checkAndInsertProfile(dbConnection, body.user_id, "DR", userSession.user_id);

        if (!profile) {
            throw "error is occured on generating profile_id"
        }
        let data = {
            ...body,
            profile_id: profile.id,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            dl_expires_on: toJSDate(body.dl_expires_on),
        }
        let criteria = {
            driver_id
        }
        let records = await db_fn.update_records(dbConnection, schema, tl_driver, criteria, data);
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
        await db_fn.delete_records(dbConnection, schema, tl_driver, criteria);
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

const getByUserId = async (dbConnection, userSession, user_id) => {
    let criteria = {
        user_id
    }
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_driver, criteria);
    return doc;
}



module.exports.get = get;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;
module.exports.getByUserId = getByUserId;