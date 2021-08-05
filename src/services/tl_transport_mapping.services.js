const db_fn = require('../configs/db.fn.config');
const { schema, tl_delivery_boy, tl_driver, tl_vehicle, tl_transaction_order, tl_transport_mapping } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');

const getDeliveryBoy = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_delivery_boy, { transport_agent_id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getDriver = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_driver, { transport_agent_id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getVehicle = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_vehicle, { transport_agent_id });
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


const insert = async (dbConnection, userSession, body) => {
    try {
        await formValidation(formRequiredField.tl_transport_mapping("insert"), body);
        let data = {
            ...body,
        }
        return await db_fn.insert_records(dbConnection, schema, tl_transport_mapping, data);
    } catch (error) {
        console.log("error--->", error);
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
        let records = await db_fn.update_records(dbConnection, schema, tl_transport_mapping, criteria, data);
        return records[0];
    } catch (error) {
        throw error;
    }
}


const getTransactionId = async (dbConnection, userSession) => {
    try {
        let records = await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_order, {});
        return records;
    } catch (err) {
        throw err;
    }
}






module.exports.getDeliveryBoy = getDeliveryBoy;
module.exports.getDriver = getDriver;
module.exports.getVehicle = getVehicle;
module.exports.insert = insert;
module.exports.getTransactionId = getTransactionId;
