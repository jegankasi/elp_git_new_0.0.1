const db_fn = require('../configs/db.fn.config');
const { schema, tl_field_labels } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A } = require('../utils/utils');

const get = async (req, id) => {
    try {
        const doc = await db_fn.get_one_from_db(req, schema, tl_field_labels, { id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getAll = async (dbConnection, criteria) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_field_labels, {});
        return doc;
    } catch (err) {
        throw err;
    }
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_field_labels, body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_field_labels, data);
        return doc;
    } catch (err) {
        throw err;
    }
}

const update = async (req, body) => {
    try {
        const doc = await db_fn.update_records(req, schema, tl_field_labels, body);
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

module.exports = {
    get,
    getAll,
    insert,
    update,
    saveAll
}