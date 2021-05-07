const get_one_from_db = async (dbConnection, schema, table, criteria, fieldSet) => {
    try {
        const documents = await dbConnection[schema][table].findOne(criteria, fieldSet);
        return documents;
    } catch (error) {
        throw error;
    }
}

const get_all_from_db = async (dbConnection, schema, table, criteria, fieldSet) => {
    const documents = await dbConnection[schema][table].find(criteria, fieldSet);
    return documents;
}

const update_records = async (dbConnection, schema, table, criteria, update_obj) => {
    const documents = await dbConnection[schema][table].update(criteria, update_obj);
    return documents;
}

const insert_records = async (dbConnection, schema, table, insert_obj) => {
    const documents = await dbConnection[schema][table].insert(insert_obj);
    return documents;
}

const run_query = async (dbConnection, query) => {
    const documents = await dbConnection["query"](query);
    return documents;
}

const new_insert_id = async (dbConnection, shema_name, table_name) => {
    const query = `select max(id) from ${shema_name}.${table_name}`;
    let max_id = await run_query(dbConnection, query);
    return max_id[0].max + 1;
}

const delete_records = async (dbConnection, schema, table, criteria) => {
    const documents = await dbConnection[schema][table].destroy(criteria);
    return documents;
}

module.exports = {
    get_one_from_db,
    get_all_from_db,
    update_records,
    insert_records,
    run_query,
    new_insert_id,
    delete_records
}