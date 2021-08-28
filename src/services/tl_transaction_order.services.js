const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_order, tl_transaction_order_quotation, tl_group } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const { v1: uuidv1 } = require("uuid");
const { getUserId, currentDate, action_flag_A, action_flag_M, isActiveRoleAllowed } = require('../utils/utils');
const { getTypeOfUserNumberByGroupId, get } = require('../services/tl_group.services');
const tl_product_service = require('../services/tl_products_inventory.services');
const tl_transaction_order_quotation_service = require('../services/tl_transaction_order_quotation.services');
const tl_transaction_audit_log_service = require('../services/tl_transaction_audit_log.services');
const _ = require("underscore");
const tl_transport_quotation_service = require('../services/tl_transport_quatation.services');


const insertTransportQuotation = async (dbConnection, userSession, body, params, query) => {
    try {
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'SCTR' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

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
        return await tl_transport_quotation_service.insert(dbConnection, userSession, body, { group_id, role_id, role }, params.transaction_id);
    } catch (err) {
        throw err;
    }
}

const getTransactionProducts = async (dbConnection, userSession, params) => {
    try {
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }
        let productQuotation = await tl_transaction_order_quotation_service.getAll(dbConnection, { transaction_id: params.transaction_id });
        for (const pQtn of productQuotation) {
            pQtn.product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: pQtn.product_id });
            delete pQtn.product_id;
        }
        return productQuotation;
    } catch (err) {
        throw err;
    }
}



const getTransactionOrder = async (dbConnection, userSession, query) => {
    let criteria = {};
    try {
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }
        if (userSession.activeRole == 'ADMIN') {
            if (_.isEmpty(query) || query.group_id == '') {
                throw 'group_id should be sent in query param';
            }
            criteria.group_id = query.group_id;
        } else {
            criteria.group_id = userSession.activeGroupId;
        }
        query.status ? criteria.current_status = query.status : "";

        return await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_order, criteria);
    } catch (err) {
        console.log("err--->", err);
        throw err;
    }
}



//role industry, admin
const insert = async (dbConnection, userSession, body, query) => {
    let group_id, industry_id, groupData;
    try {
        ////////////////////validation section started///////////////


        if (!(userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (userSession.activeRole == 'ADMIN' && !(query.groupId && query.roleId)) {
            throw "group id or role Id empty in query param";
        }

        if (userSession.activeRole == 'ADMIN') {
            group_id = query.groupId;
            role_id = query.roleId;

            await getGroupUser(dbConnection, role_id, group_id, role);
        } else {
            group_id = userSession.activeGroupId;
            role_id = userSession.activeRoleId;
        }




        if (!body.products || !Array.isArray(body.products)) {
            throw "products is not collection data"
        }

        if (!['industry submitted', 'Add To Cart'].includes(body.status)) {
            throw "status is not matched";
        }

        for (const data of body.products) {
            if (!data.product_id) {
                throw "product_id is required"
            }
            if (!['water only', 'water with can'].includes(data.purchase_type)) {
                throw "purchase_type is not matched";
            }

            let product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: data.product_id, group_id: group_id });
            if (!product) {
                throw `${data.product_id} is not exist`;
            }
            if (!data.quantity) {
                throw "quantity is required"
            }
        }
        ////////////////////validation section completed///////////////
        let transactionQuatationAudit = [];
        const uniqueId = uuidv1();
        let data = {
            transaction_id: uniqueId,
            group_id: group_id,
            requested_date: currentDate(),
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            created_by: userSession.user_id,
            modified_by: userSession.user_id,
            industry_id: role_id,
            industry_status: body.status == "industry submitted" ? "industry submitted" : "Add To Cart",
            previous_status: null,
            current_status: body.status == "industry submitted" ? "industry submitted" : "Add To Cart",
            next_status: body.status == "industry submitted" ? "contractor pending" : "industry pending",
            on_behalf_of_industry: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
        }

        let response = await dbConnection.withTransaction(async tx => {
            let tlTransactionOrder = await db_fn.insert_records(tx, schema, tl_transaction_order, data);
            for (const product of body.products) {
                let productRate = await tl_product_service.getProduct(dbConnection, userSession, { product_id: product.product_id });
                let trace = await tl_transaction_order_quotation_service.insert(tx, userSession, { ...product, actual_rate: productRate.rate, transaction_id: tlTransactionOrder.transaction_id, status: "industry submitted" });
                transactionQuatationAudit.push(trace);
            }
            await tl_transaction_audit_log_service.insert(tx, userSession, { transaction_id: tlTransactionOrder.transaction_id, object: { orderRequest: tlTransactionOrder, productDetails: transactionQuatationAudit }, userRole: "IND", created_by: industry_id, created_date: currentDate(), status: "industry submitted", on_behalf_of_user_id: userSession.activeRole === 'ADMIN' ? userSession.user_id : null });
            return {
                transaction_id: tlTransactionOrder.transaction_id,
                message: body.status == "industry submitted" ? `Product ordered Successfully` : "Products added your Basket"
            };
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const getTransactionId = async (dbConnection, transaction_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_transaction_order, { transaction_id }, {});
const getGroupUser = async (dbConnection, type_of_user_id, group_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_group, { parent_id: group_id, type_of_user_id }).then(data => {
    if (!data) {
        throw "roleId | groupId |  is not matched";
    }
    return true;
})

const update = async (dbConnection, userSession, body, params, query) => {
    let group_id, role_id, role;
    try {
        /*********    validation started ********/
        if (!(userSession.activeRole == 'SCTR' || userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        if ((userSession.activeRole == 'ADMIN' && !["IND", "CTR", "SCTR", "TPA", "WP"].includes(query.onBehalfOfRole))) {
            throw "onBehalfOfRole field is not matched or blank, set in query param"
        }

        if (userSession.activeRole == 'ADMIN' && !(query.groupId && query.roleId)) {
            throw "group id or role Id empty in query param";
        }
        if (userSession.activeRole == 'ADMIN') {
            group_id = query.groupId;
            role_id = query.roleId;
            role = query.onBehalfOfRole;
            await getGroupUser(dbConnection, role_id, group_id, role);
        } else {
            group_id = userSession.activeGroupId;
            role_id = userSession.activeRoleId;
            role = userSession.activeRole;
        }
        if (['IND', 'ADMIN'].includes(role)) {
            let payLoad = await industryValidation(dbConnection, userSession, body, group_id, role_id);
            return await commit(dbConnection, payLoad, userSession, body.status, params, role);
        }
        else if (['CTR', 'ADMIN'].includes(role)) {
            let payLoad = await contractorValidation(dbConnection, userSession, body, group_id, params)
            return await commit(dbConnection, payLoad, userSession, body.status, params, role);
        }
        else if (['WP', 'ADMIN'].includes(role)) {
            let payLoad = await waterPlantValidation(userSession, body, params);
            return await commit(dbConnection, payLoad, userSession, body.status, params, role);
        }
        else if (['TPA', 'ADMIN'].includes(role)) {
            let payLoad = await tpaValidation(userSession, body);
            return await commit(dbConnection, payLoad, userSession, body.status, params, role);
        }
        else if (['SCTR', 'ADMIN'].includes(role)) {
            let payLoad = await contractorValidation(dbConnection, userSession, body, group_id)
            return await commit(dbConnection, payLoad, userSession, body.status, params, role);
        }
        throw "no proceess for your input";
    } catch (error) {
        throw error;
    }
}




const industryValidation = async (dbConnection, userSession, body, group_id, role_id) => {
    let payLoad = {};
    try {
        if (!['industry submitted', 'Add To Cart'].includes(body.status)) {
            throw "status is not matched";
        }

        if (!body.products || !Array.isArray(body.products)) {
            throw "products is not collection data"
        }
        for (const prd of body.products) {
            if (!prd.product_id) {
                throw "product_id is required";
            }
            let product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: prd.product_id, group_id: group_id });
            if (!product) {
                throw `${prd.product_id} is not exist`;
            }
            if (!prd.quantity) {
                throw "quantity is required"
            }
            if (!['water only', 'water with can'].includes(prd.purchase_type)) {
                throw "purchase_type is not matched";
            }
        }
        payLoad.data = {
            group_id: group_id,
            requested_date: currentDate(),
            action_flag: action_flag_A,
            created_on: currentDate(),
            products: body.products,
            modified_on: currentDate(),
            created_by: userSession.user_id,
            modified_by: userSession.user_id,
            industry_id: role_id,
            industry_status: body.status == "industry submitted" ? "industry submitted" : "Add To Cart",
            previous_status: null,
            current_status: body.status == "industry submitted" ? "industry submitted" : "Add To Cart",
            next_status: body.status == "industry submitted" ? "contractor pending" : "industry submitted",
            on_behalf_of_industry: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
        }
        payLoad.criteria = {};

    } catch (err) {
        throw err;
    }
    return payLoad;
}





const contractorValidation = async (dbConnection, userSession, body, group_id, params) => {
    let payLoad = {};
    try {
        if (!['contractor_submitted_product_approval', 'contractor_rejected_industry_submitted'].includes(body.status))
            throw "status is not matched";
        if (!body.products || !Array.isArray(body.products)) {
            throw "products is not collection data"
        }
        for (const prd of body.products) {
            if (!prd.product_id) {
                throw "product_id is required";
            }
            let product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: prd.product_id, group_id: group_id });
            if (!product) {
                throw `${prd.product_id} is not exist`;
            }
            if (!prd.contractor_rate) {
                throw "contractor_rate is required"
            }
        }
        payLoad.data = {
            transaction_id: params.transaction_id,
            products: body.status == 'contractor_submitted_product_approval' ? body.products : null,
            water_plant_status: body.status == 'contractor_submitted_product_approval' ? "water plant pending" : null,
            contractor_status: body.status,
            on_behalf_of_contractor: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
            previous_status: "industry submitted",
            current_status: body.status,
            next_status: body.status == 'contractor_submitted_product_approval' ? "water plant pending" : null
        }
        payLoad.criteria = {};
    } catch (err) {
        throw err;
    }
    return payLoad;
}




const waterPlantValidation = async (userSession, body, params) => {
    if (!['product_approval_approved', 'product_approval_rejected'].includes(body.status)) throw "status is not matched";

    if (body.status == 'product_approval_approved') {
        if (!['Y', 'N'].includes(body.water_plant_own_transport))
            throw "water_plant_own_transport is not matched or blank";
    }
    let payLoad = {};
    try {
        payLoad.data = {
            transaction_id: params.transaction_id,
            water_plant_status: body.status,
            on_behalf_of_water_plant: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
            previous_status: "contractor_submitted_product_approval",
            current_status: body.status,
            water_plant_own_transport: body.water_plant_own_transport,

        }
        if ("product_approval_approved" == body.status) {
            payLoad.data.next_status = "Y" == body.water_plant_own_transport ? "waterplant_mapped_transport_agent" : "contractor_mapped_transport_agent";
        }
        else {
            payLoad.data.next_status = "water_plant_rejected_status_informed_to_industry"
        }
        payLoad.criteria = {};
    } catch (err) {
        throw err;
    }
    return payLoad;
}


const tpaValidation = async (userSession, body) => {
    let payLoad = {};
    try {
        if (!['transport_agent_approved', 'transport_agent_rejected'].includes(body.status)) throw "status is not matched";
        payLoad.data = {
            transport_agent_status: body.status,
            on_behalf_of_transport_agent: userSession.activeRole == 'ADMIN' ? userSession.user_id : null
        }
        payLoad.criteria = {}
    } catch (err) {
        throw err;
    }
    return payLoad;
}


const commit = async (dbConnection, payLoad, userSession, status, params, userRole) => { //"CTR", "contractor submitted"
    let transactionQuatationAudit = [];
    let { data, criteria } = payLoad;
    try {
        let response = await dbConnection.withTransaction(async tx => {
            let tlTransactionOrder = await db_fn.update_records(tx, schema, tl_transaction_order, { transaction_id: params.transaction_id }, data);
            if (data.products) {
                for (const product of data.products) {
                    let isExistProduct = await db_fn.get_one_from_db(tx, schema, tl_transaction_order_quotation, { product_id: product.product_id, transaction_id: params.transaction_id }, {});
                    let trace;
                    if (_.isEmpty(isExistProduct)) {
                        trace = await tl_transaction_order_quotation_service.insert(tx, userSession, {
                            ...product,
                            transaction_id: params.transaction_id,
                            status
                        }, {});
                        transactionQuatationAudit.push(trace);
                    } else {
                        trace = await tl_transaction_order_quotation_service.update(tx, userSession, { product_id: product.product_id, transaction_id: params.transaction_id }, {
                            ...product,
                            transaction_id: params.transaction_id,
                            status
                        });
                        transactionQuatationAudit.push(trace[0]);
                    }

                }
            }
            await tl_transaction_audit_log_service.insert(tx, userSession, { transaction_id: params.transaction_id, object: { orderRequest: tlTransactionOrder[0], productDetails: transactionQuatationAudit }, user_role: userRole, created_by: userSession.user_id, created_date: currentDate(), status, on_behalf_of_user_id: userSession.activeRole === 'ADMIN' ? userSession.user_id : null });
            return "success";
        });
        return response;
    } catch (err) {

        throw err;
    }
}


module.exports.getTransactionProducts = getTransactionProducts;
module.exports.getTransactionOrder = getTransactionOrder;
module.exports.insert = insert;
module.exports.update = update;
module.exports.insertTransportQuotation = insertTransportQuotation;
