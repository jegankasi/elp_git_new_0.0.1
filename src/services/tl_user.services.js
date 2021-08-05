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
        throw err;
    }
}



const getAll = async (dbConnection, critera) => {

    const fieldSet = ['user_id', 'user_number', 'first_name', "last_name", "gender", "dob", "contact_address", "contat_email", "id_proof_type", "id_proof_no", "secondary_check_enabled", "otpenabled_phone", "otpenabled_email"];


    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_user, critera, { fields: fieldSet });
    return doc;
}


const insert = async (dbConnection, userSession, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_user("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: userSession.user_id,
            created_by: userSession.user_id,
            dob: toJSDate(body.dob),
            last_login_time: currentDate(),
            services_granted: 'Y',
            is_activeuser: 'Y',
            is_loggedin: 'N'
        }
        delete data.user_id;
        delete data.user_number;
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

const updateProfile = async (dbConnection, profile, userId) => {
    try {
        let criteria = {
            user_id: userId
        }
        let records = await db_fn.update_records(dbConnection, schema, tl_user, criteria, { user_profile: profile });
        return records;
    } catch (err) {
        throw err;
    }
}

const getProfile = async (dbConnection, user_id) => {
    try {
        let criteria = {
            user_id
        }
        let records = await db_fn.get_one_from_db(dbConnection, schema, tl_user, criteria, { fields: ['user_profile'] });
        return records;
    } catch (err) {
        throw err;
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


module.exports.get = get;
module.exports.getAll = getAll;
module.exports.insert = insert;
module.exports.update = update;
module.exports.saveAll = saveAll;
module.exports.deleteRecord = deleteRecord;
module.exports.updateProfile = updateProfile;
module.exports.getProfile = getProfile;