const db_config = require('./db.schema.table.config');
const db_service = require("./db.fn.config");
const log_data = async (req, data, type, template_id) => {
    const insert_object = {
        data: data,
        url: req.originalUrl,
        created_at: new Date(),
        type: type,
        template_id: template_id || ''
    }
    db_service.insert_records(req, db_config.log_db_config.schema, db_config.log_db_config.log_table, insert_object);
}


module.exports = {
    log_data
}