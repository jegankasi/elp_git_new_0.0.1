const reposne_utils = require("../http/response.utility");
const tl_transaction_order_service = require("../services/tl_transaction_order.services");
const tl_transport_quatation_service = require("../services/tl_transport_quatation.services");
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await tl_transaction_order_service.getTransactionOrder(req.app.get("db"), req.user_session, req.query);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.get('/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_transaction_order_service.getTransactionProducts(req.app.get("db"), req.user_session, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.put('/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_transaction_order_service.update(req.app.get("db"), req.user_session, req.body, req.params, req.query);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await tl_transaction_order_service.insert(req.app.get("db"), req.user_session, req.body, req.headers);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.post('/transport_quotation/transaction_id/:transaction_id', async (req, res) => {
    try {
        const data = await tl_transport_quatation_service.insert(req.app.get("db"), req.user_session, req.body, req.query, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.put('/transport_quotation/transaction_id/:transaction_id/transport_quotation_id/:transport_quotation_id', async (req, res) => {
    try {
        const data = await tl_transport_quatation_service.update(req.app.get("db"), req.user_session, req.body, req.query, req.params);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});
module.exports = router;