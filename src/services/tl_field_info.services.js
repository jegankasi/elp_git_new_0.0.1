const db_fn = require('../configs/db.fn.config');
const { schema, tl_field_info } = require('../configs/db.schema.table.config').doc_db_config;
const formValidation = require('../configs/before.validation').formValidation;
const formRequiredField = require('../configs/table.model');
const { getUserId, currentDate, action_flag_A, action_flag_M } = require('../utils/utils');
const tl_util = require("../services/tl_util.services");


const get = async (dbConnection, id, raw) => {
    try {
        const doc = await db_fn.get_one_from_db(dbConnection, schema, tl_field_info, { id });
        if (!raw) {
            doc['field_options'] = await tl_util.getAll(dbConnection, { "parent_id": doc.field_options }, { "fields": ['id', 'name'] });
            doc["field_optionsicon"] = await tl_util.getAll(dbConnection, { "parent_id": doc.field_optionsicon }, { "fields": ['id', 'name'] });
        }
        return doc;
    } catch (err) {
        throw err;
    }
}

const getRaw = async (dbConnection, criteria) => {
    try {
        let doc = await db_fn.get_all_from_db(dbConnection, schema, tl_field_info, {});
        return doc;
    } catch (err) {
        throw err;
    }
}




const getAll = async (dbConnection, formName) => {
    let response = [];
    try {
        let form = await tl_util.get(dbConnection, { "key": formName }, { "fields": ['id', 'value'] });
        if (form && form.id) {
            let doc = await db_fn.get_all_from_db(dbConnection, schema, tl_field_info, { form_name: form.id });
            for (const currentValue of doc) {
                const sectionRecord = { section: "", section_position: "", section_column_grid: "", fields: [] };
                const fieldRecord = {};
                let { section, ctry_cd, field_label, field_nm, component_type, lang_cd,
                    field_description, field_data_type, field_length, field_tooltip_text_id,
                    is_readonly, display_order, is_enabled, field_options, field_validations, field_icon,
                    col_grid, id, field_position, section_position, section_column_grid } = currentValue;

                let countryCode = ctry_cd ? await tl_util.get(dbConnection, { "id": ctry_cd }, { "fields": ['key', 'value'] }) : null;
                let fieldLabel = field_label ? await tl_util.get(dbConnection, { "id": field_label }, { "fields": ['key', 'value'] }) : null;
                let componentType = component_type ? await tl_util.get(dbConnection, { "id": component_type }, { "fields": ['key', 'value'] }) : null;
                let langCd = lang_cd ? await tl_util.get(dbConnection, { "id": lang_cd }, { "fields": ['key', 'value'] }) : null;
                let fieldPosition = field_position ? await tl_util.get(dbConnection, { "id": field_position }, { "fields": ['key', 'value'] }) : null;
                let section_position_key = section_position ? await tl_util.get(dbConnection, { "id": section_position }, { "fields": ['key', 'value'] }) : null;



                sectionRecord.section = section ? await tl_util.get(dbConnection, { "id": section }, { "fields": ['key', 'value'] }) : null;
                sectionRecord.section_position = section_position_key && section_position_key.key;
                sectionRecord.section_column_grid = section_column_grid;

                fieldRecord.ctry_cd = countryCode && countryCode.key;
                fieldRecord.field_label = fieldLabel && fieldLabel.value;
                fieldRecord.component_type = componentType && componentType.key
                fieldRecord.lang_cd = langCd && langCd.key;
                fieldRecord.field_options = field_options ? await tl_util.getAll(dbConnection, { "parent_id": field_options }, { "fields": ['key', 'value', 'options'] }) : null;
                fieldRecord.field_position = fieldPosition && fieldPosition.key;
                if (field_validations) {
                    let fValid = await tl_util.getAll(dbConnection, { "parent_id": field_validations }, { "fields": ['key', 'value'] });
                    let Object = {}
                    for (const item of fValid) {
                        Object[item.key] = item.value
                    }
                    fieldRecord.field_validations = Object;
                }
                fieldRecord.field_nm = field_nm;
                fieldRecord.field_description = field_description;
                fieldRecord.field_data_type = field_data_type;
                fieldRecord.field_length = field_length;
                fieldRecord.field_tooltip_text_id = field_tooltip_text_id;
                fieldRecord.is_readonly = is_readonly;
                fieldRecord.display_order = display_order;
                fieldRecord.is_enabled = is_enabled;
                fieldRecord.field_icon = field_icon;
                fieldRecord.col_grid = col_grid;
                fieldRecord.id = id;
                let existRecord = response.filter(item => item.section['key'] === sectionRecord.section['key']);
                if (existRecord.length === 1) {
                    existRecord[0]["fields"] = [...existRecord[0].fields, fieldRecord];
                    existRecord[0]["section_column_grid"] = sectionRecord.section_column_grid ? sectionRecord.section_column_grid : existRecord[0]["section_column_grid"];
                    existRecord[0]["section_position"] = sectionRecord.section_position && sectionRecord.section_position ? sectionRecord.section_position : existRecord[0]["section_position"];
                } else {
                    sectionRecord.fields.push(fieldRecord);
                    response.push(sectionRecord);
                }
            }
        } else {
            throw `${formName} does not exist`;
        }
    } catch (err) {
        throw err;
    }
    return response;
}

const insert = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_field_info("insert"), body);
        let data = {
            ...body,
            action_flag: action_flag_A,
            created_on: currentDate(),
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId,
            created_by: getUserId(tokenId).userId
        }
        const doc = await db_fn.insert_records(dbConnection, schema, tl_field_info, data);
        return doc;
    } catch (err) {
        throw err;
    }
}

const update = async (dbConnection, body, tokenId) => {
    try {
        await formValidation(formRequiredField.tl_field_info("update"), body);
        let data = {
            ...body,
            action_flag: action_flag_M,
            modified_on: currentDate(),
            modified_by: getUserId(tokenId).userId
        }
        let criteria = {
            id: body.id
        }
        return await db_fn.update_records(dbConnection, schema, tl_field_info, criteria, data);
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

const deleteRecord = async (dbConnection, id) => {
    try {
        let criteria = {
            id
        }
        return await db_fn.delete_records(dbConnection, schema, tl_field_info, criteria);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    get,
    getRaw,
    getAll,
    insert,
    update,
    saveAll,
    deleteRecord
}