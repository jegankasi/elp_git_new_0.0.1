const reposne_utils = require("../http/response.utility");
const tl_transport_agent = require("../services/tl_transport_agent.services");
const express = require('express');
const router = express.Router();

router.get('/transport_agent_id/:transport_agent_id', async (req, res) => {
    try {
        const data = await tl_transport_agent.get(req.app.get("db"), req.user_session, req.params.transport_agent_id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.get('/', async (req, res) => {
    try {
        const data = await tl_transport_agent.getAll(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 400, err)
    }
});


router.post('/', async (req, res) => {
    try {
        const data = await tl_transport_agent.insert(req.app.get("db"), req.user_session, req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});

router.put('/transport_agent_id/:transport_agent_id', async (req, res) => {
    try {
        const data = await tl_transport_agent.update(req.app.get("db"), req.user_session, req.body, req.params.transport_agent_id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.delete('/id/:id', async (req, res) => {
    try {
        const data = await tl_transport_agent.deleteRecord(req.app.get("db"), req.params.id);
        return reposne_utils.send_response(req, res, 200, data);
    } catch (err) {
        return res.status(403).send(err);
    }
});

router.post('/saveAll', async (req, res) => {
    try {
        const data = await tl_transport_agent.saveAll(req.app.get("db"), req.body);
        return reposne_utils.send_response(req, res, 200, data)
    } catch (err) {
        return reposne_utils.send_response(req, res, 403, err)
    }
});


module.exports = router;