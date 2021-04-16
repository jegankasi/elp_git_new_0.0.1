const db_fn = require('../configs/db.fn.config');
const { schema, tl_util } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');

const get = async (dbConnection, critera, fieldSet) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_util, critera, fieldSet);
    return doc;
}

const getAll = async (dbConnection, critera, fieldSet) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_util, critera, {
        ...fieldSet,
        order: [
            { field: "id", direction: "asc" }
        ]
    });
    return doc;
}


const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_util("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId,
        }
        return await db_fn.insert_records(dbConnection, schema, tl_util, data);
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_util("update"), body);
        let { parent_id, key, value, id, options } = body;
        let data = {
            parent_id,
            key,
            value,
            options,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
        }
        let criteria = {
            id
        }

        return await db_fn.update_records(dbConnection, schema, tl_util, criteria, data);
    } catch (error) {
        throw error;
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

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {

        }
        let record = await get(dbConnection, { id });
        if (record && record.parent_id === '0') {
            criteria.parent_id = id;
            criteria.id = id;
        } else {
            criteria.id = id
        }


        if (criteria.parent_id) {
            await db_fn.delete_records(dbConnection, schema, tl_util, { parent_id: criteria.parent_id });
        }

        if (criteria.id) {
            await db_fn.delete_records(dbConnection, schema, tl_util, { id: criteria.id });
        }
        return "deleted";
    } catch (err) {
        throw err;
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