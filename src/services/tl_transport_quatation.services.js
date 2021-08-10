const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_transport_quotation } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const tl_product_service = require('../services/tl_products_inventory.services');

const getDeliveryBoy = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_transport_quotation, { transport_agent_id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getDriver = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_transport_quotation, { transport_agent_id });
        return doc;
    } catch (err) {
        throw err;
    }
}

const getVehicle = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_transport_quotation, { transport_agent_id });
        return doc;
    } catch (err) {
        throw err;
    }
}



const insert = async (dbConnection, userSession, body, query, transaction_id) => {
    try {
        let param = {};
        if (!body.quotation || !Array.isArray(body.quotation)) {
            throw "quotation is collection records should be sent"
        }

        for (const data of body.quotation) {
            if (!data.product_id) {
                throw "product_id is required"
            }
            let product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: data.product_id, group_id: query.group_id });
            if (!product) {
                throw `${data.product_id} is not exist`;
            }
            if (!data.quantity) {
                throw "quantity is required"
            }
            if (!data.estimation_km) {
                throw "estimation_km is required"
            }
            if (!data.vehicle_type) {
                throw "vehicle_type is required"
            }
        }
        if (query.role == "CTR") {
            param.contractor_id = query.role_id;
        }
        else if (query.role == "SCTR") {
            param.sub_contractor_id = query.role_id;
        }
        param.created_by = userSession.user_id;
        param.modified_by = userSession.user_id;
        param.created_on = currentDate();
        param.modified_on = currentDate();
        param.transaction_id = transaction_id;

        return await db_fn.insert_records(dbConnection, schema, tl_transaction_transport_quotation, { quotation: { quote: body.quotation }, group_id: query.group_id, ...param });
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
        let records = await db_fn.update_records(dbConnection, schema, tl_transaction_transport_quotation, criteria, data);
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
