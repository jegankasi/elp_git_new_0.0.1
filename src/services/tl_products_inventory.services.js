const db_fn = require('../configs/db.fn.config');
const { schema, tl_products_inventory } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');

const getProduct = async (dbConnection, userSession, criteria) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_products_inventory, criteria);
    return doc;
}


module.exports.getProduct = getProduct;