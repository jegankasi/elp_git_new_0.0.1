const db_fn = require('../configs/db.fn.config');
const { schema, tl_customers } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');

const get = async (dbConnection, id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_customers, { id });
    return doc;
}

const getAll = async (dbConnection) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_customers, {});
    return doc;
}


const insert = async (dbConnection, body, tokenId) => {
    await formValidation(formRequiredField.tl_customers("insert"), body);
    let data = {
        ...body,
        action_flag: action_flag_A,
        created_on: currentDate(),
        modified_on: currentDate(),
        modified_by: getUserId(tokenId).userId,
        created_by: getUserId(tokenId).userId
    }
    return await db_fn.insert_records(dbConnection, schema, tl_customers, data);
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_customers("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }


        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_customers, criteria, data);
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id
        }
        await db_fn.delete_records(dbConnection, schema, tl_customers, criteria);
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