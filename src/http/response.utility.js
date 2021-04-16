const logger = require("../configs/logger.config")
const send_success = (res, status_code, data) => {
    return res.status(status_code).send(data);
}

const send_error = (res, status_code, data) => {
    return res.status(status_code).send(data);
}

const send_response = (req, res, status_code, data, type, template_id) => {
    if (status_code < 400) {
        send_success(res, status_code, { status: "success", data: data })
    } else {
        send_error(res, status_code, { status: "error", data: data })
    }
    // logger.log_data(req, { request: req.body, response: data }, type, template_id);
}

module.exports = {
    send_response
} 