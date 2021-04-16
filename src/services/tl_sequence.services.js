const db_fn = require('../configs/db.fn.config');
const schema_table = require('../configs/db.schema.table.config').doc_db_config;
const { schema, tl_sequence } = schema_table;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');

const get = async (req, id) => {
    try {
        const doc = await db_fn.get_one_from_db(req, schema, tl_sequence, { id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getAll = async (dbConnection) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_sequence, {});
        return doc;
    } catch (err) {
        throw err;
    }
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_sequence, body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_sequence, data);
        return doc;
    } catch (error) {
        throw error;
    }
}

const update = async (req, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_sequence, body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }
        let criteria = {
            group_id: body.group_id
        }
        const doc = await db_fn.update_records(req, schema, tl_sequence, criteria, data);
        return doc;
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

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_sequence, criteria);
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