const db_fn = require('../configs/db.fn.config');
const schema_table = require('../configs/db.schema.table.config').doc_db_config;
const { schema, tl_profile } = schema_table;
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const formRequiredField = require('../configs/table.model');
const formValidation = require('../configs/before.validation').formValidation;


// const get = async (req, id) => {
//     try {
//         const doc = await db_fn.get_one_from_db(req, schema, tl_profile, { id });
//         return doc;
//     } catch (err) {
//         throw err;
//     }
// }


const get = async (dbConnection, criteria, fieldItem) => {
    const columns = fieldItem ? fieldItem : ['user_type_id', 'parent_id', 'action_flag', "created_by", "created_on", "modified_by", "modified_on", "id"];
    const fieldSet = {
        fields: columns,
        // exprs: {
        //     group_name: `${Group} || id`
        // }
    }
    try {
        const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_profile, criteria, fieldSet);
        return doc;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const getAll = async (dbConnection, criteria) => {
    try {
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_profile, criteria, {
            order: [
                { field: "id", direction: "asc" }
            ]
        });
        return doc;
    } catch (err) {
        throw err;
    }
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_profile("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_profile, data);
        return doc;
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

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_profile("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }


        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_profile, criteria, data);
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id: id
        }
        await db_fn.delete_records(dbConnection, schema, tl_profile, criteria);
        return "deleted";
    } catch (err) {
        throw err;
    }
}

module.exports = {
    get,
    getAll,
    insert,
    update,
    saveAll,
    deleteRecord
}