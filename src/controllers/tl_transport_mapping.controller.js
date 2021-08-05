const reposne_utils = require("../http/response.utility");
const tl_transport_mapping = require("../services/tl_transport_mapping.services");
const express = require('express');
const router = express.Router();

router.get('/vehicle/transport_agent_id/:transport_agent_id', async (req, res) => {
    try {
        const data = await tl_transport_mapping.getVehicle(req.app.get("db"), req.user_session, req.params.transport_agent_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/driver/transport_agent_id/:transport_agent_id', async (req, res) => {
    try {
        const data = await tl_transport_mapping.getDriver(req.app.get("db"), req.user_session, req.params.transport_agent_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/delivery_boy/transport_agent_id/:transport_agent_id', async (req, res) => {
    try {
        const data = await tl_transport_mapping.getDeliveryBoy(req.app.get("db"), req.user_session, req.params.transport_agent_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.get('/transaction_id', async (req, res) => {
    try {
        const data = await tl_transport_mapping.getTransactionId(req.app.get("db"), req.user_session, req.params.transaction_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await tl_transport_mapping.insert(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});





module.exports = router;