const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_order, tl_transport_mapping, tl_trip_sheet, tl_transaction_order_quotation, tl_products_inventory } = require('../configs/db.schema.table.config').doc_db_config;
const tl_transaction_order_quotation_service = require('../services/tl_transaction_order_quotation.services');
const _ = require("underscore");

const getTransactionId = async (dbConnection, transaction_id) => await db_fn.get_one_from_db(dbConnection, schema, tl_transaction_order, { transaction_id }, {});
const getTransactionMappingId = async (dbConnection, transaction_id) => await db_fn.get_all_from_db(dbConnection, schema, tl_transport_mapping, { transaction_id }, {});
const getTripSheetId = async (dbConnection, transaction_id) => await db_fn.get_all_from_db(dbConnection, schema, tl_trip_sheet, { transaction_id }, {});


const compareProductsQuantity = (requestProduct, dbProduct) => {
    const cumulativeProductQuantity = (product_id) => requestProduct.filter(data => data.product_id == product_id).reduce(((accumulator, currentValue) => accumulator + currentValue.quantity), 0);
    dbProduct.map(data => {
        if (cumulativeProductQuantity(data.product_id) != data.quantity) {
            throw `${data.product_id}| of quantity does not match with ordered prduct quantity`
        }
    });
}

const get_transaction_products = async (dbConnection, userSession, params) => {
    const query = `select *  from ${schema}.${tl_transaction_order_quotation} as tlTsoQ  
    inner join ${schema}.${tl_products_inventory} as tlPi on tlTsoQ.product_id = tlPi.product_id
    where tlTsoQ.transaction_id = '${params.transaction_id}'`;
    return await db_fn.run_query(dbConnection, query);
}

const getTripSheet = async (dbConnection, userSession, params) => {
    return await db_fn.get_all_from_db(dbConnection, schema, tl_trip_sheet, { transaction_id: params.transaction_id });
}

const insert = async (dbConnection, userSession, body, query, params) => {
    try {
        if (!(userSession.activeRole == 'TPA' || userSession.activeRole == 'CTR' || userSession.activeRole == 'ADMIN')) {
            throw "forbidden access";
        }
        if (_.isEmpty(await getTransactionId(dbConnection, params.transaction_id))) {
            throw "transaction id is not valid";
        }

        let products = await tl_transaction_order_quotation_service.getAll(dbConnection, userSession, { transaction_id: params.transaction_id }, ['transaction_id', 'product_id', 'contractor_rate', 'status', 'quantity', 'customer_rate', 'transaction_order_quotation_id', 'purchase_type']);
        compareProductsQuantity(body.deliver_product_to_industry, products);

        if (_.isEmpty(await getTransactionMappingId(dbConnection, params.transaction_id))) {
            throw "transaction_mapping_id is not valid";
        }
        await dbConnection.withTransaction(async tx => {
            let transactionMappingId = await getTransactionMappingId(tx, params.transaction_id);
            await db_fn.delete_records(tx, schema, tl_trip_sheet, { transaction_id: params.transaction_id });
            for (const item of body.deliver_product_to_industry) {
                if (item.quantity == 0) {
                    throw `quantity should not be 0 for ${item.product_id}`;
                }
                if (!transactionMappingId || _.isEmpty(transactionMappingId.filter(data => data.transport_mapping_id == item.transport_mapping_id))) {
                    throw `transport_mapping_id ${item.transport_mapping_id} is not valid`;
                }
                await db_fn.insert_records(tx, schema, tl_trip_sheet, { ...item, transaction_id: params.transaction_id });
            }
        });
    } catch (err) {
        throw err;
    }
    return "success";
}

module.exports.insert = insert;
module.exports.get_transaction_products = get_transaction_products;
module.exports.getTripSheet = getTripSheet;
