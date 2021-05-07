const db_fn = require('../configs/db.fn.config');
const { schema, tl_user } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');

const get = async (dbConnection, critera) => {
    try {
        const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_user, critera);
        return doc;
    } catch (err) {
        console.log("err----->", err);
        throw err;
    }
}



const getAll = async (dbConnection, critera) => {

    const fieldSet = ['id', 'user_number', 'first_name', "last_name", "gender", "dob", "contact_address", "contat_email", "id_proof_type", "id_proof_no", "secondary_check_enabled", "otpenabled_phone", "otpenabled_email"];


    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_user, critera, { fields: fieldSet });
    return doc;
}


const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_user("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId,
            dob: toJSDate(body.dob),
            last_login_time: currentDate()
        }
        return await db_fn.insert_records(dbConnection, schema, tl_user, data);
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_user("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            dob: toJSDate(body.dob),
        }



        let criteria = {
            id: body.id
        }
        let records = await db_fn.update_records(dbConnection, schema, tl_user, criteria, data);
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
        await db_fn.delete_records(dbConnection, schema, tl_user, criteria);
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