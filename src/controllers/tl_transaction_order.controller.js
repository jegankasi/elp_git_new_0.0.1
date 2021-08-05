const reposne_utils = require("../http/response.utility");
const tl_transport_order_service = require("../services/tl_transaction_order.services");
const express = require('express');
const router = express.Router();

router.get('/group_id/:group_id/activeRoleId/:activeRoleId', async (req, res) => {
    try {
        const data = await tl_transport_order_service.getTransactionOrder(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/group_id/:group_id/activeRoleId/:activeRoleId/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_transport_order_service.getTransactionProducts(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.put('/group_id/:group_id/transaction_id/:transaction_id', async (req, res) => {
    try {

        const data = await tl_transport_order_service.update(req.app.get("db"), req.user_session, req.body, req.headers, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await tl_transport_order_service.insert(req.app.get("db"), req.user_session, req.body, req.headers);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});
module.exports = router;