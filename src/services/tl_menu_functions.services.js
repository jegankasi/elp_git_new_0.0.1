const db_fn = require('../configs/db.fn.config');
const { schema, tl_menu_functions } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');


const get = async (dbConnection, criteria) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_menu_functions,  criteria);
    return doc;
}

const getAll = async (dbConnection,criteria) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_menu_functions, criteria);
    return doc;
}


const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_menu_functions("insert"), body);
        return await db_fn.insert_records(dbConnection, schema, tl_menu_functions, body);
    } catch (error) {
        if (error) {
            throw "user Already Logged in";
        }
        throw error;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_menu_functions("update"), body);
        let criteria = {
            functionId: body.functionId
        }
        return await db_fn.update_records(dbConnection, schema, tl_menu_functions, criteria, body);
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            functionId: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_menu_functions, criteria);
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
    deleteRecord
}