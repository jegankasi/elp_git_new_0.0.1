const db_fn = require('../configs/db.fn.config');
const { schema, tl_delivery_boy, tl_transaction_transport_quotation, tl_driver, tl_vehicle, tl_transaction_order, tl_transport_mapping } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const tl_transaction_order_quotation_service = require('../services/tl_transaction_order_quotation.services');
const _ = require("underscore");

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

const getTransportMappingDetails = async (dbConnection, userSession, transaction_id) => {
    try {
        return await db_fn.get_all_from_db(dbConnection, schema, tl_transport_mapping, { transaction_id });
    } catch (err) {
        throw err;
    }
}


const get = async (dbConnection, userSession, transport_agent_id) => {
    try {
        const res = {};
        res.deliveryBoy = await getDeliveryBoy(dbConnection, userSession, transport_agent_id);
        res.driver = await getDriver(dbConnection, userSession, transport_agent_id);
        res.vehicle = await getVehicle(dbConnection, userSession, transport_agent_id);
        return res;
    } catch (err) {
        throw error;
    }
}

const compareProductsQuantity = (requestProduct, dbProduct) => {
    const cumulativeProductQuantity = (product_id) => requestProduct.filter(data => data.product_id == product_id).reduce(((accumulator, currentValue) => accumulator + currentValue.quantity), 0);

    dbProduct.map(data => {
        if (cumulativeProductQuantity(data.product_id) != data.quantity) {
            throw `${data.product_id} of quantity does not match with ordered prduct quantity`
        }
    });
}

const getTransportQuotaionId = async (dbConnection, transaction_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_transaction_transport_quotation, { transaction_id }, {});

const insert = async (dbConnection, userSession, body, query, params) => {
    try {
        if (!(userSession.activeRole == 'TPA' || userSession.activeRole == 'ADMIN' || userSession.activeRole == 'CTR')) {
            throw "forbidden access";
        }
        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        // if (_.isEmpty(await getTransportQuotaionId(dbConnection, params.transaction_id))) {
        //     throw "getTransportQuotaionId is not valid";
        // }
        await formValidation(formRequiredField.tl_transport_mapping("insert"), body);
        let data = {
            ...body
        }
        return await db_fn.insert_records(dbConnection, schema, tl_transport_mapping, data);
    } catch (err) {
        throw err;
    }
}




const update = async (dbConnection, userSession, body, query, params) => {
    try {
        if (!(userSession.activeRole == 'TPA' || userSession.activeRole == 'ADMIN' || userSession.activeRole == 'CTR')) {
            throw "forbidden access";
        }
        await formValidation(formRequiredField.tl_transport_mapping("update"), body);
        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: userSession.userId,
        }

        let criteria = {
            transport_mapping_id: params.transport_mapping_id,
            transaction_id: params.transaction_id
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
module.exports.get = get;
module.exports.update = update;
module.exports.getTransportMappingDetails = getTransportMappingDetails;
