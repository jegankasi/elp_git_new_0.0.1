const db_fn = require('../configs/db.fn.config');
const { schema, tl_water_plant } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const { checkAndInsertProfile } = require('../utils/database_common_function');



const get = async (dbConnection, id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_water_plant, { id });
    return doc;
}

const getAll = async (dbConnection) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_water_plant, {});
    return doc;
}


const insert = async (dbConnection, body, tokenId) => {
    try {

        await formValidation(formRequiredField.tl_water_plant("insert"), body);
        let profile = await checkAndInsertProfile(dbConnection, body.user_id, "WP");

        if (!profile) {
            throw "error is occured on generating profile_id"
        }
        let data = {
            ...body,
            profile_id: profile.id,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId,
            established_on: toJSDate(body.established_on),
        }
        return await db_fn.insert_records(dbConnection, schema, tl_water_plant, data);
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_water_plant("update"), body);
        let profile = await checkAndInsertProfile(dbConnection, body.user_id, "WP");

        if (!profile) {
            throw "error is occured on generating profile_id"
        }
        let data = {
            ...body,
            profile_id: profile.id,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            established_on: toJSDate(body.established_on)
        }


        let criteria = {
            id: body.id
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

module.exports = {
    get,
    getAll,
    insert,
    update,
    saveAll,
    deleteRecord
}