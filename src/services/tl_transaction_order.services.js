const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_audit_log, tl_transaction_order, tl_transaction_order_quotation, tl_group } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const { v1: uuidv1 } = require("uuid");
const { getUserId, currentDate, action_flag_A, action_flag_M, isActiveRoleAllowed } = require('../utils/utils');
const { getTypeOfUserNumberByGroupId, get } = require('../services/tl_group.services');
const tl_product_service = require('../services/tl_products_inventory.services');
const tl_transaction_order_quotation_service = require('../services/tl_transaction_order_quotation.services');
const tl_transaction_audit_log_service = require('../services/tl_transaction_audit_log.services');
const _ = require("underscore");


const getTransactionProducts = async (dbConnection, userSession, params) => {

    try {
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }
        let id, criteria, productQuotation;
        if (userSession.activeRole == 'CTR') {
            id = 'contractor_id';
        } else if (userSession.activeRole == 'TPA') {
            id = 'transport_agent_id'
        } else if (userSession.activeRole == 'WP') {
            id = 'water_plant_id'
        } else if (userSession.activeRole == 'SCTR') {
            id = 'sub_contractor_id'
        }
        else if (userSession.activeRole == 'IND') {
            id = 'industry_id'
        }
        if (userSession.activeRole == 'ADMIN' || isActiveRoleAllowed(userSession, id, params.group_id, params.activeRoleId)) {
            productQuotation = await tl_transaction_order_quotation_service.getAll(dbConnection, { transaction_id: params.transaction_id });
            for (const pQtn of productQuotation) {
                pQtn.product = await tl_product_service.getProduct(dbConnection, userSession, { product_id: pQtn.product_id });
                delete pQtn.product_id;
            }
        }
        return productQuotation;
    } catch (err) {
        throw err;
    }
}



const getTransactionOrder = async (dbConnection, userSession, params) => {

    try {
        if (!(userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }
        let id, criteria;
        if (userSession.activeRole == 'CTR') {
            id = 'contractor_id';
        } else if (userSession.activeRole == 'TPA') {
            id = 'transport_agent_id'
        } else if (userSession.activeRole == 'WP') {
            id = 'water_plant_id'
        } else if (userSession.activeRole == 'SCTR') {
            id = 'sub_contractor_id'
        } else if (userSession.activeRole == 'IND') {
            id = 'industry_id'
        }

        if (userSession.activeRole == 'ADMIN' || isActiveRoleAllowed(userSession, id, params.group_id, params.activeRoleId)) {
            return await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_order, { group_id: params.group_id });
        }

    } catch (err) {
        throw err;
    }
}



//role industry, admin
const insert = async (dbConnection, userSession, body, headers) => {
    let group_id, industry_id, groupData;
    try {
        ////////////////////validation section started///////////////

        if (!(userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }
        if (userSession.activeRole === 'ADMIN') {
            if (!body.industry_id) {
                throw "industry_id should not be blank";
            }
            if (!body.group_id) {
                throw "group_id should not be blank";
            }
            groupData = await get(dbConnection, userSession, { parent_id: body.group_id, user_type: "IND", type_of_user_id: body.industry_id });
            if (!groupData) {
                throw "groupid is not matched";
            }
            group_id = groupData.parent_id;
            industry_id = groupData.type_of_user_id;
        }

        if (userSession.activeRole === 'IND') {
            if (!body.industry_id) {
                throw "industry_id should not be blank";
            }
            if (!body.group_id) {
                throw "group_id should not be blank";
            }
            groupData = userSession.IND.filter(industry => industry.industry_id === body.industry_id).map(ind => ind.group_id).find(ele => ele[0] === body.group_id);
            if (_.isEmpty(groupData)) {
                throw "group_id is not matched";
            }
            group_id = body.group_id;
            industry_id = body.industry_id;
        }
        if (!body.products || !Array.isArray(body.products)) {
            throw "products is not collection data"
        }

        if (!['industry submitted', 'Add To Cart'].includes(body.status)) {
            throw "status is not matched";
        }

        if (!['water only', 'water with can'].includes(body.purchase_type)) {
            throw "purchase_type is not matched";
        }

        for (const data of body.products) {
            if (!data.product_id) {
                throw "product_id is required"
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
            industry_id: industry_id,
            industry_status: body.status === "industry submitted" ? "industry submitted" : "Add To Cart",
            previous_status: null,
            current_status: body.status === "industry submitted" ? "industry submitted" : "Add To Cart",
            next_status: body.status === "industry submitted" ? "contractor pending" : "industry pending",
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
            return "success";
        });
        return response;
    } catch (error) {
        throw error;
    }
}

const getTransactionId = async (dbConnection, transaction_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_transaction_order, { transaction_id }, {});
const getGroupUser = async (dbConnection, type_of_user_id, group_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_group, { parent_id: group_id, type_of_user_id }).then(data => {
    if (!data) {
        throw "industry-id is not matched the group";
    }
    return true;
})

const update = async (dbConnection, userSession, body, headers, params) => {
    try {
        /*********    validation started ********/
        if (!(userSession.activeRole == 'SCTR' || userSession.activeRole == 'CTR' || userSession.activeRole == 'TPA' || userSession.activeRole == 'WP' || userSession.activeRole == 'IND' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }

        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        if ((userSession.activeRole == 'ADMIN' && !["IND", "CTR", "SCTR", "TPA", "WP"].includes(body.onBehalfOfRole))) {
            throw "onBehalfOfRole field is not matched or blank"
        }

        let flag = false;;

        if ((userSession.activeRole == 'IND'
            && isActiveRoleAllowed(userSession, 'industry_id', params.group_id, body.industry_id)
            && await industryValidation(dbConnection, userSession, body, params.group_id))
            || (userSession.activeRole == 'ADMIN'
                && body.onBehalfOfRole === 'IND'
                && await getGroupUser(dbConnection, body.industry_id, params.group_id, "IND")
                && await industryValidation(dbConnection, userSession, body, params.group_id)
            )) {
            flag = true;
            let payLoad = industryPayLoad(body, params, userSession);
            let response = await commit(dbConnection, payLoad, userSession, body.status, params, "IND");
            return response;
        }
        else if ((userSession.activeRole == 'CTR'
            && isActiveRoleAllowed(userSession, 'contractor_id', params.group_id, body.contractor_id))
            && await contractorValidation(dbConnection, userSession, body, params.group_id)
            || ('CTR' === body.onBehalfOfRole
                && userSession.activeRole == 'ADMIN'
                && await getGroupUser(dbConnection, body.contractor_id, params.group_id, "CTR")
                && await contractorValidation(dbConnection, userSession, body, params.group_id)
            )) {
            flag = true;
            let payLoad = await contractorPayLoad(dbConnection, body, params, userSession);
            let response = await commit(dbConnection, payLoad, userSession, body.status, params, "CTR");
            return response;
        } else if ((userSession.activeRole == 'WP'
            && isActiveRoleAllowed(userSession, 'water_plant_id', params.group_id, body.water_plant_id))
            && await waterPlantValidation(dbConnection, userSession, body, params.group_id)
            || ('WP' === body.onBehalfOfRole
                && userSession.activeRole == 'ADMIN'
                && await getGroupUser(dbConnection, body.water_plant_id, params.group_id, "WP")
                && await waterPlantValidation(dbConnection, userSession, body, params.group_id)
            )) {
            let payLoad = await waterPlantPayLoadProduct(dbConnection, body, params, userSession);

            let response = await commit(dbConnection, payLoad, userSession, body.status, params, "WP");
            flag = true;
            return response;
        } else if ((userSession.activeRole == 'TPA'
            && await tpaValidation(dbConnection, userSession, body, params.group_id)
            && isActiveRoleAllowed(userSession, 'transport_agent_id', params.group_id, body.transport_agent_id))
            || ('TPA' === body.onBehalfOfRole
                && userSession.activeRole == 'ADMIN'
                && await tpaValidation(dbConnection, userSession, body, params.group_id))) {
            flag = true;
            let payLoad = await tpaPayLoad(dbConnection, body, params, userSession);
            let response = await commit(dbConnection, payLoad, userSession, body.status, params, "TPA");
            return response;
        } else if ((userSession.activeRole == 'SCTR'
            && isActiveRoleAllowed(userSession, 'contractor_id', params.group_id, body.contractor_id))
            && await contractorValidation(dbConnection, userSession, body, params.group_id)
            || ('CTR' === body.onBehalfOfRole
                && userSession.activeRole == 'ADMIN'
                && await getGroupUser(dbConnection, body.contractor_id, params.group_id, "SCTR")
                && await contractorValidation(dbConnection, userSession, body, params.group_id)
            )) {
            flag = true;
            let payLoad = await contractorPayLoad(dbConnection, body, params, userSession);
            let response = await commit(dbConnection, payLoad, userSession, body.status, params, "CTR");
            return response;
        }
        if (flag == false) {
            throw "no proceess for your input";
        }
    } catch (error) {
        throw error;
    }
}



const industryStatus = (status) => { if (!['industry submitted', 'Add To Cart'].includes(status)) throw "status is not matched"; return true; }
const industryValidation = async (dbConnection, userSession, body, group_id) => {
    try {
        industryStatus(body.status);
        if (!['water only', 'water with can'].includes(body.purchase_type)) {
            throw "purchase_type is not matched";
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
        }
    } catch (err) {
        throw err;
    }
    return true;
}

const industryPayLoad = (body, params, userSession) => {
    let payLoad = {};
    payLoad.data = {
        group_id: params.group_id,
        requested_date: currentDate(),
        action_flag: action_flag_A,
        created_on: currentDate(),
        products: body.products,
        modified_on: currentDate(),
        created_by: userSession.user_id,
        modified_by: userSession.user_id,
        industry_id: body.industry_id,
        industry_status: body.status === "industry submitted" ? "industry submitted" : "Add To Cart",
        previous_status: null,
        current_status: body.status === "industry submitted" ? "industry submitted" : "Add To Cart",
        next_status: body.status === "industry submitted" ? "contractor pending" : "industry submitted",
        on_behalf_of_industry: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
    }
    payLoad.criteria = {};
    return payLoad;
}


const contractorStatus = (status) => { if (!['contractor_submitted_product_approval', 'contractor_rejected_industry_submitted'].includes(status)) throw "status is not matched"; return true; }
const contractorValidation = async (dbConnection, userSession, body, group_id) => {
    try {
        contractorStatus(body.status);

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
    } catch (err) {
        throw err;
    }
    return true;
}
const contractorPayLoad = async (dbConnection, body, params, userSession) => {

    let order = await getTransactionId(dbConnection, params.transaction_id);
    let payLoad = {};
    payLoad.data = {
        transaction_id: params.transaction_id,
        products: body.status == 'contractor_submitted_product_approval' ? body.products : null,
        water_plant_status: body.status == 'contractor_submitted_product_approval' ? "water plant pending" : null,
        contractor_status: body.status,
        on_behalf_of_contractor: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
        previous_status: order.current_status,
        current_status: body.status,
        next_status: body.status == 'contractor_submitted_product_approval' ? "water plant pending" : null
    }
    payLoad.criteria = {};
    return payLoad;
}
const tpaStatus = (status) => { if (!['transport_agent_approved', 'transport_agent_rejected'].includes(status)) throw "status is not matched"; return true; }

const waterPlantStatusProduct = (status) => { if (!['product_approval_approved', 'product_approval_rejected'].includes(status)) throw "status is not matched"; return true; }
const waterPlantOwnTransportStatus = (status) => { if (!['Y', 'N'].includes(status)) throw "water_plant_own_transport is not matched or blank"; return true; }
const waterPlantValidation = async (dbConnection, userSession, body, group_id) => {
    waterPlantStatusProduct(body.status);
    if (body.status == 'product_approval_approved') {
        waterPlantOwnTransportStatus(body.water_plant_own_transport);
    }
    return true;
}

const waterPlantPayLoadProduct = async (dbConnection, body, params, userSession) => {
    let order = await getTransactionId(dbConnection, params.transaction_id);
    let payLoad = {};
    payLoad.data = {
        transaction_id: params.transaction_id,
        water_plant_status: body.status,
        on_behalf_of_water_plant: userSession.activeRole == 'ADMIN' ? userSession.user_id : null,
        previous_status: order.current_status,
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
    return payLoad;
}

const tpaValidation = async (dbConnection, userSession, body, group_id) => {
    try {
        tpaStatus(body.status);
    } catch (err) {
        throw err;
    }
    return true;
}

const tpaPayLoad = async (dbConnection, body, params, userSession) => {
    let payLoad = {};
    payLoad.data = {
        transport_agent_status: body.status,
        on_behalf_of_transport_agent: userSession.activeRole == 'ADMIN' ? userSession.user_id : null
    }
    payLoad.criteria = {}
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