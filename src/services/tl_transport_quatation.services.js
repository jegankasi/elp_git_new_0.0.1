const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_transport_quotation, tl_group, tl_transaction_order } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, toJSDate } = require('../utils/utils');
const tl_product_service = require('../services/tl_products_inventory.services');
const tl_transaction_order_quotation_service = require('../services/tl_transaction_order_quotation.services');
const _ = require("underscore");

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

const compareProductsQuantity = (requestProduct, dbProduct) => {
    const cumulativeProductQuantity = (product_id) => requestProduct.filter(data => data.product_id == product_id).reduce(((accumulator, currentValue) => accumulator + currentValue.quantity), 0);

    dbProduct.map(data => {
        if (cumulativeProductQuantity(data.product_id) != data.quantity) {
            throw `${data.product_id} of quantity does not match with ordered prduct quantity`
        }
    });
}

const getGroupUser = async (dbConnection, type_of_user_id, group_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_group, { parent_id: group_id, type_of_user_id }).then(data => {
    if (!data) {
        throw "roleId | groupId |  is not matched";
    }
    return true;
})

const insert = async (dbConnection, userSession, body, query, params) => {
    try {
        let param = {};
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'SCTR' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        let products = await tl_transaction_order_quotation_service.getAll(dbConnection, userSession, { transaction_id: params.transaction_id }, ['transaction_id', 'product_id', 'contractor_rate', 'status', 'quantity', 'customer_rate', 'transaction_order_quotation_id', 'purchase_type']);
        compareProductsQuantity(body.quotation, products);

        if (userSession.activeRole == 'ADMIN') {
            group_id = query.groupId;
            role_id = query.roleId;
            role = query.role;
            await getGroupUser(dbConnection, role_id, group_id, role);
        } else {
            group_id = userSession.activeGroupId;
            role_id = userSession.activeRoleId;
            role = userSession.activeRole;
        }

        if (!body.quotation || !Array.isArray(body.quotation)) {
            throw "quotation is collection records should be sent"
        }

        for (const data of body.quotation) {
            if (!data.estimation_km) {
                throw "estimation_km is required"
            }
            if (!data.vehicle_type) {
                throw "vehicle_type is required"
            }
        }

        param.contractor_id = role == "CTR" ? role_id : null;
        param.sub_contractor_id = role == "SCTR" ? role_id : null;
        param.created_by = userSession.user_id;
        param.modified_by = userSession.user_id;
        param.created_on = currentDate();
        param.modified_on = currentDate();
        param.transaction_id = params.transaction_id;
        param.quotation = { quote: body.quotation };
        param.group_id = group_id;
        return await db_fn.insert_records(dbConnection, schema, tl_transaction_transport_quotation, param);
    } catch (error) {
        throw error;
    }
}

const update = async (dbConnection, userSession, body, query, params) => {
    try {
        let data = {};
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'SCTR' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        let products = await tl_transaction_order_quotation_service.getAll(dbConnection, userSession, { transaction_id: params.transaction_id }, ['transaction_id', 'product_id', 'contractor_rate', 'status', 'quantity', 'customer_rate', 'transaction_order_quotation_id', 'purchase_type']);
        compareProductsQuantity(body.quotation, products);

        if (userSession.activeRole == 'ADMIN') {
            group_id = query.groupId;
            role_id = query.roleId;
            role = query.role;
            await getGroupUser(dbConnection, role_id, group_id, role);
        } else {
            group_id = userSession.activeGroupId;
            role_id = userSession.activeRoleId;
            role = userSession.activeRole;
        }

        if (!body.quotation || !Array.isArray(body.quotation)) {
            throw "quotation is collection records should be sent"
        }

        for (const data of body.quotation) {
            if (!data.estimation_km) {
                throw "estimation_km is required"
            }
            if (!data.vehicle_type) {
                throw "vehicle_type is required"
            }
        }

        data.contractor_id = role == "CTR" ? role_id : null;
        data.sub_contractor_id = role == "SCTR" ? role_id : null;
        data.created_by = userSession.user_id;
        data.modified_by = userSession.user_id;
        data.created_on = currentDate();
        data.modified_on = currentDate();
        data.transaction_id = params.transaction_id;
        data.quotation = { quote: body.quotation };
        data.group_id = group_id;
        return await db_fn.update_records(dbConnection, schema, tl_transaction_transport_quotation, { transaction_id: params.transaction_id, transport_quotation_id: params.transport_quotation_id }, data);
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

const get = async (dbConnection, userSession, params) => {
    try {
        let records = await db_fn.get_one_from_db(dbConnection, schema, tl_transaction_transport_quotation, { transaction_id: params.transaction_id });
        const quotation = [];
        for (const data of records.quotation.quote) {
            const prod = {};
            prod.product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: data.product_id });
            prod.vehicle_price_per_km = data.vehicle_price_per_km;
            prod.vehicle_type = data.vehicle_type;
            prod.quantity = data.quantity;
            prod.estimation_km = data.estimation_km;
            quotation.push(prod);
        }

        return quotation;
    } catch (err) {
        console.log("err-----", err);
        throw err;
    }
}






module.exports.getDeliveryBoy = getDeliveryBoy;
module.exports.getDriver = getDriver;
module.exports.getVehicle = getVehicle;
module.exports.insert = insert;
module.exports.update = update;
module.exports.get = get;
module.exports.getTransactionId = getTransactionId;
