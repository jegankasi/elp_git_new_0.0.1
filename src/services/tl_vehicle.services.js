const db_fn = require('../configs/db.fn.config');
const { schema, tl_vehicle } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const { checkAndInsertProfile } = require('../utils/database_common_function');
const tl_group_service = require('../services/tl_group.services');

const get = async (dbConnection, userSession, vehicle_id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_vehicle, { vehicle_id });
    return doc;
}

const getAll = async (dbConnection, userSession, criteria, fieldSet) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_vehicle, criteria, fieldSet);
    return doc;
}

const insert = async (dbConnection, userSession, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_vehicle("insert"), body);
        let response = await dbConnection.withTransaction(async tx => {
            let profile = await checkAndInsertProfile(tx, body.user_id, "VEH");
            if (!profile) {
                throw "error is occured on generating profile_id"
            }
            let data = {
                ...body,
                action_flag: action_flag_A,
                created_on: currentDate(),
                modified_on: currentDate(),
                modified_by: userSession.user_id,
                created_by: userSession.user_id,
                next_service_due: toJSDate(body.next_service_due),
                insurance_expires_on: toJSDate(body.insurance_expires_on)

            }
            delete data.vehicle_id;
            delete data.vehicle_number;
            let vehicle = await db_fn.insert_records(tx, schema, tl_vehicle, data);
            if (userSession.activeRole === 'ADMIN') {
                let adminRecord = await tl_group_service.getByUserType(tx, userSession, 'ADMIN');
                await tl_group_service.insertTypeOfUser(tx, userSession, { group_id: adminRecord.parent_id, type_of_user_id: vehicle.vehicle_id, user_type: "VEH" })
            }
            return vehicle;
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, userSession, body, vehicle_id) => {
    try {
        await formValidation(formRequiredField.tl_vehicle("update"), body);
        let profile = await checkAndInsertProfile(dbConnection, body.user_id, "VEH", userSession.user_id);

        if (!profile) {
            throw "error is occured on generating profile_id"
        }
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            next_service_due: toJSDate(body.next_service_due),
            insurance_expires_on: toJSDate(body.insurance_expires_on)
        }
        let criteria = {
            vehicle_id
        }
        let records = await db_fn.update_records(dbConnection, schema, tl_vehicle, criteria, data);
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
        await db_fn.delete_records(dbConnection, schema, tl_vehicle, criteria);
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
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_vehicle, criteria);
    return doc;
}

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;
module.exports.getByUserId = getByUserId;
