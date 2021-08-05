const db_fn = require('../configs/db.fn.config');
const { schema, tl_transaction_order_quotation } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { currentDate, action_flag_A, action_flag_M } = require('../utils/utils');


const get = async (dbConnection, userSession, group_id) => {
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_group, { group_id });
    return doc;
}


const getAll = async (dbConnection, criteria, fields) => {
    const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_transaction_order_quotation, criteria, {
        fields,
        order: [
            { field: "transaction_order_quotation_id", direction: "asc" }
        ]
    });
    return doc;
}



const insert = async (dbConnection, userSession, body, header) => {
    await formValidation(formRequiredField.tl_transaction_order_quotation("insert"), body);
    let data = {
        ...body,
        action_flag: action_flag_A,
        created_on: currentDate(),
        modified_on: currentDate(),
        modified_by: userSession.user_id,
        created_by: userSession.user_id
    }
    return await db_fn.insert_records(dbConnection, schema, tl_transaction_order_quotation, data);
}

const update = async (dbConnection, userSession, criteria, body) => {
    await formValidation(formRequiredField.tl_transaction_order_quotation("update"), body);
    let data = {
        ...body,
        action_flag: action_flag_A,
        created_on: currentDate(),
        modified_on: currentDate(),
        modified_by: userSession.user_id,
        created_by: userSession.user_id
    }
    delete data.group_id;
    delete data.group_number;
    return await db_fn.update_records(dbConnection, schema, tl_transaction_order_quotation, criteria, data);
}


const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_group, criteria);
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


