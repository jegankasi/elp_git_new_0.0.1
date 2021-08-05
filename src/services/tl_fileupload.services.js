const db_fn = require('../configs/db.fn.config');
const { schema, tl_base64 } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A } = require('../utils/utils');

const get = async (dbConnection, id) => {
    try {
        const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_base64, { id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getAll = async (dbConnection, criteria) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_base64, {});
        return doc;
    } catch (err) {
        throw err;
    }
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_fileupload("insert"), body);
        let data = {
            "data": { base64: body.base64 },
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_base64, data);
        return doc;
    } catch (err) {
        throw err;
    }
}

const update = async (req, id, body) => {
    try {
        await formValidation(formRequiredField.tl_fileupload("update"), body);
        let criterea = {
            id: id
        }
        let data = {
            "data": { base64: body.base64 },
        }
        await db_fn.update_records(req, schema, tl_base64, criterea, data);
        return "success";
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
