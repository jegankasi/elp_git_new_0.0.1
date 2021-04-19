const db_fn = require('../configs/db.fn.config');
const { schema, tl_user_type } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M, Group } = require('../utils/utils');



const get = async (dbConnection, criteria, fieldItem) => {
    const columns = fieldItem ? fieldItem : ['user_type', 'action_flag', "created_by", "created_on", "modified_by", "modified_on", "id"];
    const fieldSet = {
        fields: columns,
        // exprs: {
        //     group_name: `${Group} || id`
        // }
    }
    const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_user_type, criteria, fieldSet);
    return doc;
}

const getAll = async (dbConnection, criteria, fieldItem) => {
    console.log("getAll----->");
    try {
        const columns = fieldItem ? fieldItem : ['user_type', 'action_flag', "created_by", "created_on", "modified_by", "modified_on", "id"];
        const fieldSet = {
            fields: columns,
            // exprs: {
            //     group_name: `${Group} || id`
            // }
        }
        console.log("criteria-------->", criteria);
        const doc = await db_fn.get_all_from_db(dbConnection, schema, tl_user_type, criteria, fieldSet);
        return doc;
    } catch (error) {
        throw error;
    }
}


const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_user_type('insert'), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        return await db_fn.insert_records(dbConnection, schema, tl_user_type, data);
    } catch (error) {
        throw error;
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
        await formValidation(formRequiredField.tl_user_type('update'), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }


        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_user_type, criteria, data);
    } catch (error) {
        throw error;
    }
}

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id
        }
        await db_fn.delete_records(dbConnection, schema, tl_user_type, criteria);
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