const db_fn = require('../configs/db.fn.config');
const { schema, tl_field_info, tl_section_form_fields } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const tl_util = require("../services/tl_util.services");


const get = async (dbConnection, id, raw) => {
    try {
        const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_field_info, { id });
        if (!raw) {
            doc['field_options'] = await tl_util.getAll(dbConnection, { "parent_id": doc.field_options }, { "fields": ['id', 'name'] });
            doc["field_optionsicon"] = await tl_util.getAll(dbConnection, { "parent_id": doc.field_optionsicon }, { "fields": ['id', 'name'] });
        }
        return doc;
    } catch (err) {
        throw err;
    }
}

// const getRaw = async (dbConnection, formId) => {

//     let criteria = {};
//     if (formId) {
//         criteria.form_name = formId
//     }
//     try {
//         let doc = await db_fn.get_all_from_db(dbConnection, schema, tl_section_form_fields, { ...criteria });
//         return doc;
//     } catch (err) {
//         throw err;
//     }
// }




const getAll = async (dbConnection, formName) => {
    let response = [];
    try {
        if (formName) {
            let section = await db_fn.get_one_from_db(dbConnection, schema, tl_section_form_fields, { key: formName });
            response.push(section);
        } else {
            throw `${formName} does not exist`;
        }
    } catch (err) {
        throw err;
    }
    return response;
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_field_info("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_field_info, data);
        return doc;
    } catch (err) {
        throw err;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_field_info("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }
        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_field_info, criteria, data);
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
            id
        }
        return await db_fn.delete_records(dbConnection, schema, tl_field_info, criteria);
    } catch (err) {
        throw err;
    }
}


module.exports.getAll = getAll;

